# 要件

これは動作確認のためのデモプロジェクトです。

## 実装すべきデモ内容

1. **基本的なTypeSpecファイルの作成**

   - シンプルなAPI定義
   - モデル定義

2. **AWS固有の拡張を追加**

   - 統合リソースの定義
   - `x-amazon-apigateway-integration`
   - 認証の定義
   - `x-amazon-apigateway-authtype`
   - `x-amazon-apigateway-authorizer`

3. **OpenAPI生成**

   - TypeSpecからOpenAPIへの変換
   - 生成されたOpenAPIの検証

4. **実際のAPI Gatewayデプロイ**

   - 生成されたOpenAPIでのCDKを使ったAPI Gateway作成

5. **Codespaces対応**

   - 必要なツール（Node.js, npm, AWS CDK, TypeSpec CLI）がプリインストールされ、すぐに利用できること

6. **動作確認**

   - CDK構築後、APIが正常に動作することを確認する。
