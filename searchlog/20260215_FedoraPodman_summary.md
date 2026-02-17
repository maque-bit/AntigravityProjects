# Fedora 43 Podman Nginx セットアップガイド

Fedora 43でPodmanを使用した軽量なWebサーバー（Nginx）の最短セットアップ手順と、初心者向けの重要なTipsをまとめました。

## 🚀 最短セットアップ手順

Fedora 43ではPodmanが標準でルートレス動作するため、`sudo`なしで以下のコマンドを実行するだけでWebサーバーが立ち上がります。

### 1. Nginxコンテナの起動
```bash
podman run -d --name my-web -p 8080:80 nginx
```
- `-d`: バックグラウンドで実行（デタッチモード）
- `--name my-web`: コンテナに名前を付ける
- `-p 8080:80`: ホストの8080番ポートをコンテナの80番に繋ぐ

### 2. 動作確認
ブラウザで `http://localhost:8080` にアクセスしてください。

---

## 📂 自分のHTMLファイルを公開する場合
ホスト上のディレクトリをコンテナにマウントして公開する手順です。

```bash
mkdir ~/html
echo "<h1>Hello from Fedora 43 Podman</h1>" > ~/html/index.html
podman run -d --name my-app -p 8081:80 -v ~/html:/usr/share/nginx/html:Z nginx
```
- `-v`: フォルダを共有する（ボリュームマウント）
- `:Z`: **重要！** SELinuxの権限を自動調整するフラグ

---

## 💡 初心者向けTips

### 1. Rootless（ルートレス）の利点
FedoraのPodmanは一般ユーザー権限で動作します。`sudo`を必要としないため、システム全体への影響を抑えられ、セキュリティが非常に高いのが特徴です。

### 2. SELinuxの `:Z` を忘れずに
Fedoraでフォルダをマウントする際、`Permission Denied`エラーが出ることがあります。これはSELinuxが保護しているためです。コロンに続けて `:Z` を付けることで、Podmanが自動的に適切なラベルを付与してくれます。

### 3. ポート番号の選び方
1024番以下のポート（80番など）を一般ユーザーで使うには設定が必要ですが、1024番以降（8080, 9000など）なら自由に選べます。

### 4. Podman 5.0の新機能「Pasta」
Fedora 43ではネットワークスタックとして「pasta」が採用されています。ルートレスでも非常に高速で、ホストとの通信がよりスムーズになっています。

---

## 🛠 よく使う管理コマンド
- `podman ps`: 動作中のコンテナ確認
- `podman stop <名前>`: 停止
- `podman rm -f <名前>`: 強制削除
- `podman logs <名前>`: ログの確認（トラブル時に重宝します）

---
## 🔍 情報ソース
- [Fedora Magazine](https://fedoramagazine.org/)
- [Podman.io Documentation](https://podman.io/)
- 取得日: 2026年2月15日
