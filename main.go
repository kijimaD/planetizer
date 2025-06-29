package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"os"
	"sort"
	"time"

	"strings"

	"github.com/kijimaD/planetizer/lib/generated"
	"github.com/mmcdole/gofeed"
	"golang.org/x/net/html"
)

const maxContentSize = 1000
const configPath = "config.json"
const feedPath = "frontend/public/feed.json"

// これより過去は表示しない
var entryMinDate = time.Now().AddDate(-1, 0, 0)

func main() {
	fp := gofeed.NewParser()
	feedResult := generated.FeedResult{
		GeneratedAt: time.Now(),
		SourceMap:   make(generated.SourceMap),
	}
	data, err := os.ReadFile(configPath)
	if err != nil {
		log.Fatal(err)
	}

	config := &generated.Config{}
	err = json.Unmarshal([]byte(data), config)
	if err != nil {
		log.Fatalln(err)
	}
	feedResult.Config = *config

	if err := formatConfig(config); err != nil {
		log.Fatal(gofeed.ErrFeedTypeNotDetected)
	}

	for _, s := range config.Sources {
		feedResult.SourceMap[s.Name] = struct {
			ConfigSource generated.ConfigSource `json:"config_source"`
			EntryCount   int                    `json:"entry_count"`
		}{}
		url := strings.TrimSpace(s.RssUrl)
		if url == "" {
			continue
		}
		feed, err := fp.ParseURL(url)
		if err != nil {
			log.Printf("Failed to parse %s: %v", url, err)
			continue
		}
		feedResult.SourceMap[s.Name] = struct {
			ConfigSource generated.ConfigSource `json:"config_source"`
			EntryCount   int                    `json:"entry_count"`
		}{
			ConfigSource: s,
			EntryCount:   0,
		}
		for _, item := range feed.Items {
			var publised *time.Time
			if item.PublishedParsed != nil {
				publised = item.PublishedParsed
			} else {
				now := time.Now()
				publised = &now
			}

			if publised.Before(entryMinDate) {
				continue
			}
			{
				current := feedResult.SourceMap[s.Name]
				current.EntryCount++
				feedResult.SourceMap[s.Name] = current
			}

			var summary string
			if len(item.Content) > 0 {
				summary, err = TruncateHTML(item.Content, maxContentSize)
				if err != nil {
					log.Fatal(err)
				}
			} else if len(item.Description) > 0 {
				summary, err = TruncateHTML(item.Description, maxContentSize)
				if err != nil {
					log.Fatal(err)
				}
			}

			feedResult.Entries = append(feedResult.Entries, generated.FeedEntry{
				Title:        item.Title,
				Link:         item.Link,
				Published:    *publised,
				Summary:      string(template.HTML(summary)),
				FeedSource:   feed.Title,
				ConfigSource: s.Name,
			})
		}
	}

	// 公開日時でソート
	sort.Slice(feedResult.Entries, func(i, j int) bool {
		if feedResult.Entries[i].Published == feedResult.Entries[j].Published {
			return feedResult.Entries[i].Title > feedResult.Entries[j].Title
		}

		return feedResult.Entries[i].Published.After(feedResult.Entries[j].Published)
	})

	// 収集フィードでJSON生成する
	f, err := os.Create(feedPath)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	if err := enc.Encode(feedResult); err != nil {
		log.Fatal(err)
	}
}

// 設定を整形して書き出し直す
func formatConfig(config *generated.Config) error {
	sort.Slice(config.Sources, func(i, j int) bool {
		return config.Sources[i].Name < config.Sources[j].Name
	})
	for _, src := range config.Sources {
		sort.Slice(src.Tags, func(i, j int) bool {
			return src.Tags[i] < src.Tags[j]
		})
	}
	sort.Slice(config.Tags, func(i, j int) bool {
		return config.Tags[i].Name < config.Tags[j].Name
	})

	file, err := os.Create(configPath)
	if err != nil {
		return err
	}
	defer file.Close()
	enc := json.NewEncoder(file)
	enc.SetIndent("", "  ")
	if err := enc.Encode(config); err != nil {
		return err
	}

	return nil
}

// HTML をパースして、最初の N 文字分のテキストだけ含む HTML を出力する
func TruncateHTML(input string, maxTextLen int) (string, error) {
	doc, err := html.Parse(strings.NewReader(input))
	if err != nil {
		return "", err
	}

	var body *html.Node
	var findBody func(*html.Node)
	findBody = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "body" {
			body = n
			return
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			findBody(c)
		}
	}
	findBody(doc)

	if body == nil {
		// bodyがなければ全体を対象にする
		body = doc
	}

	var buf bytes.Buffer
	_, _ = truncateNode(body, &buf, maxTextLen, 0)
	return buf.String(), nil
}

func truncateNode(n *html.Node, w io.Writer, maxLen, currentLen int) (newLen int, stop bool) {
	switch n.Type {
	case html.TextNode:
		text := n.Data
		length := len([]rune(text)) // バイト数でなく文字数カウント
		if currentLen+length > maxLen {
			return maxLen, true
		}
		w.Write([]byte(html.EscapeString(text)))

		return currentLen + length, false
	case html.ElementNode:
		var buf bytes.Buffer
		buf.WriteString("<" + n.Data)
		for _, attr := range n.Attr {
			buf.WriteString(fmt.Sprintf(` %s="%s"`, attr.Key, attr.Val))
		}
		buf.WriteString(">")
		w.Write(buf.Bytes())

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			var stop bool
			currentLen, stop = truncateNode(c, w, maxLen, currentLen)
			if stop {
				break
			}
		}
		w.Write([]byte(fmt.Sprintf("</%s>", n.Data)))

		return currentLen, stop
	default:
		// 無視
		return currentLen, false
	}
}
