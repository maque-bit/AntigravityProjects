# Phase 5: GitHubデプロイと本番設定 実施計画

ビルドプロセスが GitHub Actions (GHA) へ移行されたことを受け、本番環境での動作に適した最適化（マルチステージビルド、シークレット管理、デプロイ自動化）を実施します。

## ユーザーレビューが必要な事項

> [!IMPORTANT]
> - **シークレットの設定**: 分析に使用する `GEMINI_API_KEY` や、データの収集に必要な `GITHUB_USER_ID` などの機密情報を GitHub の Repository Secrets に設定する必要があります。
> - **GitHub Pages のドメイン**: GitHub Pages の URL （例: `https://<username>.github.io/<repo>/`）に合わせて、Astro の設定 (`site`, `base`) を固定する必要があります。

## 提案する変更内容

### 1. 本番用ビルドの最適化 (Containerfile)

開発用 (`-dev`) イメージとは別に、実行に必要な最小限のファイルのみを含む本番用ステージ (`-prod`) を追加します。

#### [MODIFY] [Containerfile](file:///home/maki/projects/MCP4Antigravity/src/Containerfile)

- 各サービスに `production` ステージを追加。
- `npm ci --only=production` を使用し、イメージサイズを削減。

### 2. デプロイワークフローの最終調整 (deploy.yml)

#### [MODIFY] [deploy.yml](file:///home/maki/projects/MCP4Antigravity/.github/workflows/deploy.yml)

- ビルドターゲットを本番用ターゲットに変更。
- セキュアなイメージ管理のため、プッシュ時のタグ付け（`latest` および `sha`）を確実に行う。

### 3. デプロイ設定ガイドの作成

#### [NEW] [deployment_guide.md](file:///home/maki/projects/MCP4Antigravity/docs/production_deployment/deployment_guide.md)

- ユーザーが GitHub 上で設定すべき Secrets 一覧と、GitHub Pages の有効化手順をまとめます。

## 検証計画

### 自動テスト (GHA)
- `deploy.yml` が正常に走り、全イメージが GitHub Packages (GHCR) に登録されること。
- GitHub Pages にウェブサイトが公開されること。

### 手動検証
1. 公開された GitHub Pages の URL にアクセスし、正常に表示されるか確認。
2. GHCR に登録されたイメージをローカル等で pull し、設定（環境変数）が正しく反映されるか確認。
