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

	"github.com/mmcdole/gofeed"
	"golang.org/x/net/html"
)

type FeedItem struct {
	// 記事のタイトル
	Title string `json:"title"`
	// URL
	Link string `json:"link"`
	// 公開日
	Published time.Time `json:"published"`
	// 本文
	Summary template.HTML `json:"summary"`
	// 収集元サイトの名前
	Source string `json:"source"`
}

const maxContentSize = 1000
const configPath = "config.txt"
const feedPath = "frontend/public/feed.json"

func main() {
	fp := gofeed.NewParser()
	var items []FeedItem

	data, err := os.ReadFile(configPath)
	if err != nil {
		log.Fatal(err)
	}
	lines := strings.Split(string(data), "\n")

	for _, url := range lines {
		url = strings.TrimSpace(url)
		if url == "" {
			continue
		}
		feed, err := fp.ParseURL(url)
		if err != nil {
			log.Printf("Failed to parse %s: %v", url, err)
			continue
		}
		for _, e := range feed.Items {
			t := e.PublishedParsed
			if t == nil {
				now := time.Now()
				t = &now
			}
			short, err := TruncateHTML(e.Content, maxContentSize)
			if err != nil {
				log.Fatal(err)
			}
			items = append(items, FeedItem{
				Title:     e.Title,
				Link:      e.Link,
				Published: *t,
				Summary:   template.HTML(short),
				Source:    feed.Title,
			})
		}
	}

	// 公開日時でソート
	sort.Slice(items, func(i, j int) bool {
		if items[i].Published == items[j].Published {
			return items[i].Title > items[j].Title
		}

		return items[i].Published.After(items[j].Published)
	})

	// 収集フィードでJSON生成する
	f, err := os.Create(feedPath)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	if err := enc.Encode(items); err != nil {
		log.Fatal(err)
	}
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
		if currentLen+len(text) > maxLen {
			return maxLen, true
		}
		w.Write([]byte(html.EscapeString(text)))
		return currentLen + len(text), false

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
