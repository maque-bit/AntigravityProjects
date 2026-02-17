# CPUリソース負荷軽減対策の提案

ビルド時および実行時のCPU負荷を抑制し、ローカル環境での開発をスムーズにするための追加対策を提案します。

## ユーザーレビューが必要な事項

> [!NOTE]
> - **Alpine Linuxへの移行**: 承認されました。軽量化されますが、バイナリ依存の問題が発生した場合は報告します。
> - **共通イメージの事前ビルド**: 承認されました。ビルド負荷を分散させるため、シリアル（順次）実行を行います。

## 提案する変更内容

### 1. ベースイメージとパッケージマネージャの最適化 (Containerfile)

現状の `node:20-alpine` をベースに、日本のミラーサイト（mirror.kakao.com）の使用とビルドキャッシュの効率化を適用します。

#### [MODIFY] [Containerfile](file:///home/maki/projects/MCP4Antigravity/src/Containerfile)

```dockerfile
# 共通ベースイメージ
FROM node:20-alpine AS base
# ミラーサイトを日本のミラーに変更
RUN sed -i 's/dl-cdn.alpinelinux.org/mirror.kakao.com/g' /etc/apk/repositories
WORKDIR /app
RUN apk add --no-cache sqlite bash

# 開発用ベース（ビルドキャッシュ最適化用）
FROM base AS development
# 各サービスの依存関係を先にコピーしてインストールすることでキャッシュを効かせる
# (compose.yamlでビルドターゲットを分けるか、共通でインストールするか検討)
```

### 2. ビルドコンテキストの削減 (.dockerignore)

不要な `node_modules` やログファイルを除外し、ビルド時の転送負荷を軽減します。

#### [NEW] [.dockerignore](file:///home/maki/projects/MCP4Antigravity/src/.dockerignore)

```
node_modules
.DS_Store
*.log
.git
```


### 2. リソース制限の導入 (compose.yaml)

各コンテナが使用できるCPUコア数を明示的に制限し、ホストOSがハングするのを防ぎます。

#### [MODIFY] [compose.yaml](file:///home/maki/projects/MCP4Antigravity/src/compose.yaml)

```yaml
services:
  admin:
    # ... (既存設定)
    deploy:
      resources:
        limits:
          cpus: '0.8' # CPU使用率を80%に制限
          memory: 2G
```

### 3. ビルドプロセスの完全なシリアル化 (ビルドスクリプトの導入)

`podman-compose build` による並列ビルドを避け、1つずつ順番にビルドを実行するスクリプトを作成します。

#### [NEW] [build_serial.sh](file:///home/maki/projects/MCP4Antigravity/src/build_serial.sh)

```bash
#!/bin/bash
set -e

# ビルド時のリソース制限設定
BUILD_LIMITS="--cpus 1.0 --memory 2G"

echo "Step 1: Building base image..."
podman build $BUILD_LIMITS --target base -t mcp-base -f Containerfile .

echo "Step 2: Building services serially..."
services=("admin-dev" "collector-dev" "analyzer-dev" "web-dev")
for target in "${services[@]}"; do
    echo "Building $target..."
    podman build $BUILD_LIMITS --target $target -t mcp-${target%-dev} -f Containerfile .
done

echo "All builds completed successfully."
```

### 4. ビルドコマンドへの直接的なリソース制限

前回のハングはビルドプロセス自体の負荷が原因であったため、`podman build` 実行時にも `--cpus` および `--memory` フラグを明示的に付与します。これにより、OSがバックグラウンドで動作し続けるための「余白」を確保します。

## 検証計画

### 自動テスト
- なし（環境設定の変更であるため）

### 手動検証
1. `src/build_serial.sh` に実行権限を付与し、実行する。
2. `top` または `htop` で、同時に1つの `podman build` プロセスのみが動作していること、および指定したCPU制限（1.0相当）を超えていないことを確認。
3. すべてのイメージが作成されたら、`podman-compose up` で正常に起動し、各URL（localhost:3000, localhost:4321等）にアクセスできるか確認。

