package main

import (
	"html/template"
	"log"
	"os"
	"sort"
	"time"

	"strings"

	"github.com/mmcdole/gofeed"
)

type FeedItem struct {
	Title     string
	Link      string
	Published time.Time
	Summary   template.HTML
	Source    string
}

func main() {
	fp := gofeed.NewParser()
	var items []FeedItem

	data, err := os.ReadFile("feeds.txt")
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
			summary := e.Content
			if len(summary) > 2000 {
				summary = summary[:2000] + "..."
			}
			items = append(items, FeedItem{
				Title:     e.Title,
				Link:      e.Link,
				Published: *t,
				Summary:   template.HTML(summary),
				Source:    feed.Title,
			})
		}
	}

	// 日時でソート
	sort.Slice(items, func(i, j int) bool {
		return items[i].Published.After(items[j].Published)
	})

	// HTML生成
	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		log.Fatal(err)
	}
	os.MkdirAll("public", 0755)
	out, err := os.Create("public/index.html")
	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()

	err = tmpl.Execute(out, struct {
		Items   []FeedItem
		Updated time.Time
	}{
		Items:   items,
		Updated: time.Now(),
	})
	if err != nil {
		log.Fatal(err)
	}
}
