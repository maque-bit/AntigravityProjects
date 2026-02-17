# GitHub Actionsへのビルド・検証プロセス移行計画

ローカル環境でのリソース制限およびI/O飽和によるビルド困難を解消するため、ビルドおよび検証のプロセスを GitHub Actions (GHA) へ移行します。

## ユーザーレビューが必要な項目
- GitHub Actions の実行権限およびリポジトリ設定が完了しているか。
- ビルドされたイメージの保存先（GitHub Packages 等）の利用要否。現時点ではビルドの成否確認のみを目的とします。

## 提案される変更

### 全般
ローカルの Podman 環境の残骸をクリーンアップし、負荷を軽減します。

### GitHub Actions 設定
#### [NEW] [build-verification.yml](file:///home/maki/projects/MCP4Antigravity/.github/workflows/build-verification.yml)
以下のサービスをビルドするためのワークフローを定義します：
- `admin` (target: `admin-dev`)
- `collector` (target: `collector-dev`)
- `analyzer` (target: `analyzer-dev`)
- `web` (target: `web-dev`)

## 検証計画

### 自動テスト（CI）
作成した GitHub Actions ワークフローが正常に完了し、すべてのサービスイメージがエラーなくビルドできることを確認します。

### 手動検証
1. ローカルマシンでの `podman ps -a` 等の応答が正常に戻ることを確認（クリーンアップ後）。
2. GitHub 上の Actions タブでビルドログを確認し、各ステップの成功を確認。
