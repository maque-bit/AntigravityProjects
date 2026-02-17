# メンテナンスモード実装 実施計画

ウェブサイトを一時的にメンテナンス中表示に切り替えます。GitHub Pages で公開されているサイトに適用するため、ソースコードの変更とプッシュによって反映させます。

## ユーザーレビューが必要な事項

> [!NOTE]
> - **切り替え方法**: `index.astro` の中身を一時的にメンテナンス表示に置き換えます。元のコンテンツは `index.astro.bak` として保存し、いつでも戻せるようにします。

## 提案する変更内容

### 1. メンテナンスページの作成と適用

#### [NEW] [maintenance.astro](file:///home/maki/projects/MCP4Antigravity/src/web/src/pages/maintenance.astro)
- モダンで高品質なデザインを採用したメンテナンス画面を作成します。

#### [MODIFY] [index.astro](file:///home/maki/projects/MCP4Antigravity/src/web/src/pages/index.astro)
- メンテナンス期間中、すべてのアクセスに対して上記のメンテナンス表示を返すように修正します。

### 2. デプロイ

- 変更を GitHub にプッシュし、GHA による自動ビルド・デプロイをトリガーします。

## 検証計画

### 手動検証
1. GitHub Actions の完了を確認。
2. 公開サイト URL にアクセスし、メンテナンス画面が表示されることを確認。
