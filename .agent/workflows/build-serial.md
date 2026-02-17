---
description: リソース制限付きでのシリアルビルドと環境起動
---

システムのCPU/メモリ負荷を抑えながら、各マイクロサービスを安全に順次ビルド・起動する手順です。

// turbo-all
1. ビルドスクリプトに実行権限を付与する
```bash
chmod +x src/build_serial.sh
```

2. シリアルビルドを実行する
このステップでは、各サービスが一つずつビルドされ、CPU使用率が1コア相当、メモリが2GB以内に制限されます。
```bash
./src/build_serial.sh
```

3. サービスをデタッチモードで起動する
ビルド済みのイメージを使用して、全サービスを起動します。
```bash
cd src && podman-compose up -d
```

4. サービスの起動状態を確認する
```bash
podman ps && podman-compose logs --tail 20
```

5. URLアクセスを確認する
- Admin: [http://localhost:3000](http://localhost:3000)
- Web: [http://localhost:4321](http://localhost:4321)
