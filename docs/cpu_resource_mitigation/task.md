# CPUリソース対策の検討と提案

## タスク一覧
- [x] 現状のビルド・実行プロセスのボトルネック調査
- [x] CPUリソース節約のための具体的な対策案の策案
- [x] 対策案の提案（Implementation Plan）作成
- [x] ユーザーへの提案とレビュー依頼
- [x] CPU負荷軽減策の適用 (Containerfile, compose.yaml)
- [x] ビルドプロセスの高度な最適化適用
    - [x] .dockerignore の作成
    - [x] Containerfile のミラー設定とキャッシュ最適化
    - [x] compose.yaml のビルドターゲット調整
- [x] タイムスタンプ付きでの順次ビルドと起動検証
    - [x] シリアルビルドスクリプト (`build_serial.sh`) の作成
    - [x] ベースイメージ (base) のビルド
    - [x] 各サービスの順次ビルド (Admin, Collector, Analyzer, Web)
    - [x] 全サービスの起動確認 (podman-compose up)
