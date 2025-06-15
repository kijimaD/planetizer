Planet with static file generation.

## Run

```
npm run dev < /dev/null &
```

## TODO

- [x] faviconを正しく設定する
- [x] フィードによってスタイルが崩れるのを直す
- [x] ローディングスピナーをつける
- [x] 日付の次にタイトルでソートする
- [ ] フィード設定をtxt->JSONで保持する
- [ ] 設定中のフィード情報を表示する
- [ ] 情報源ごとに表示を切り替えられる
- [ ] 直近1年表示にする
- [ ] 既読にできるようにする

## ファイル仕様

config.json 仕様。フェッチする設定

```json
  {
      "sources": [
          {
              url: example.com/feed.atom,
              name: example,
              desc: 説明,
              tags: ["go"],
          }
      ],
      "tags": [
          {
              "name": "go",
              "desc": "Goに関する情報"
          },
          {
              "name": "official",
              "desc": "公式情報"
          }
      ]
  }
```

feed.json 仕様。保存データ仕様

```json
{
  "generated_at": "2025-06-13T09:31:07Z",
  "entries": [
    {
      "title": "xxx",
      "link": "example.com",
      "published": "2025-06-13T09:31:07Z",
      "summary": "",
      "source": ""
    }
  ]
}
```
