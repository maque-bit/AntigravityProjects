#!/bin/bash
set -e

# ビルド時のリソース制限設定（一旦解除して速度を優先）
BUILD_LIMITS=""

echo "=== Step 1: Building base image (mcp-base) ==="
podman build $BUILD_LIMITS --target base -t mcp-base -f Containerfile .

echo ""
echo "=== Step 2: Building services serially ==="

# ビルド対象のターゲット名と、生成するイメージ名の対応
# (target:image_name)
services=(
    "admin-dev:mcp-admin"
    "collector-dev:mcp-collector"
    "analyzer-dev:mcp-analyzer"
    "web-dev:mcp-web"
)

for service in "${services[@]}"; do
    target=${service%%:*}
    image=${service#*:}
    
    echo "--- Building $target -> $image ---"
    # --timestamp は進捗確認に有用ですが、一部のPodmanバージョンで非対応な場合があるため、
    # 汎用性を考慮して通常のビルドに制限を加えて実行します。
    podman build $BUILD_LIMITS --target "$target" -t "$image" -f Containerfile .
    echo "Finished $image"
    echo ""
done

echo "=== All builds completed successfully! ==="
echo "You can now start the services using: podman-compose up"
