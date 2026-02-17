# 技術引き継ぎ・開発ガイド

今後、新しい機能を追加したりサービスを拡張したりする際のガイドラインです。

## 1. ディレクトリ構成と役割
現状、モノリポ構成を採用しています。
- `src/admin`: 管理画面 (Express)
- `src/collector`: データ収集サービス
- `src/analyzer`: AI分析サービス (Gemini API 使用)
- `src/web`: 公開用Webサイト (Astro)
- `src/config`: 共通設定ファイル
- `.github/workflows`: CI/CD パイプライン (GitHub Actions)

## 2. コンテナビルドシステム
`src/Containerfile` はマルチステージビルドを採用しており、以下の2つのターゲットを使い分けます。

- **xxxx-dev**: 開発用。`npm install` を行い、ソースをボリュームマウントして使用します。
- **xxxx-prod**: 本番用。`npm ci --only=production` を行い、ソースをコンテナ内に COPY します。

### 新しいサービスを追加する場合
1. `src/` 配下にディレクトリを作成。
2. `Containerfile` に対応する `-dev` と `-prod` のステージを追記。
3. `compose.yaml` (ローカル検証用) および `deploy.yml` (GHAデプロイ用) に追記。

## 3. CI/CD パイプライン (GitHub Actions)
- **build-verification.yml**: プルリクエスト時に全イメージのビルド成否をチェックします。
- **deploy.yml**: mainブランチへのプッシュでトリガー。GHCRへのイメージプッシュとGitHub PagesへのWeb公開を行います。

## 4. 設定とシークレット
- **共通設定**: `src/config/config.json` に記載。
- **機密情報**: Gemini APIキー等は GitHub の `Repository Secrets` に設定し、`deploy.yml` 内の `build-args` 経由でコンテナに渡されます。
- **環境差異**: `GH_PAGES_BASE` などの環境依存値は、Astro のビルド時に環境変数として参照されます。

## 5. 推奨される開発サイクル
1. 新機能の開発とローカルでのユニットテスト。
2. `Containerfile` への反映。
3. **GitHub でのビルド確認**: ローカルのフリーズを避けるため、`build-verification.yml` を通じたリモートビルドでの検証を推奨します。
4. デプロイ後の GitHub Pages および各サービスの動作確認。
