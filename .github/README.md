# ごはん提案アプリ

OpenAI API（gpt-4o-mini）を使って、朝食・昼食・夕食のおすすめメニューを1つ提案するWebアプリです。

デモ: https://meal-app-jet.vercel.app/

## 使用技術
- Node.js / Express
- Pug（テンプレートエンジン）
- OpenAI API

## セットアップ
```
npm i
```

### API key
1. https://platform.openai.com/account/api-keys でAPIキーを発行
2. プロジェクトルートに `.env` を作成し、以下を保存

```
OPENAI_API_KEY={API key}
```

### 起動
```
npm start
```
http://localhost:3000/ にアクセス

## 使い方
朝食・昼食・夕食のいずれかを選択すると、OpenAIがおすすめのメニューを1つ提案します。

### TODO
- APIのレスポンスが遅くてタイムアウトになることがある（10秒以上）
