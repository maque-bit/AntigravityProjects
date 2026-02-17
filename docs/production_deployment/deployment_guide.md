# GitHubデプロイ設定ガイド

Phase 5 で実装した本番環境へのデプロイを正常に機能させるための設定ガイドです。

## 1. GitHub Repository Secrets の設定

GitHub リポジトリの `Settings` > `Secrets and variables` > `Actions` にて、以下の Secrets を追加してください。

| Secret 名 | 内容 | 必須 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | 分析用 AI (Gemini) の API キー | ✅ |
| `GH_WORKSPACE_USER_ID` | データ収集対象の GitHub ユーザー ID | ✅ |
| `GH_PAGES_BASE` | リポジトリ名（例: `/MCP4Antigravity`） | ✅ |

## 2. GitHub Pages の有効化

1. リポジトリの `Settings` > `Pages` を開きます。
2. `Build and deployment` > `Source` を `GitHub Actions` に設定します。
3. これにより、`deploy.yml` ワークフローからの自動デプロイが有効になります。

## 3. GHCR イメージの利用

ビルドされたコンテナイメージは `ghcr.io` に保存されます。
実行環境（本番サーバー等）で利用する際は、`ghcr.io/${{ github.repository }}/${service}:latest` を指定してください。
