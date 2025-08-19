# TODO

## 1. 基本的な TypeSpec ファイルの作成

- [x] `main.tsp` に、基本的な API とモデルを定義する。

## 2. AWS 固有の拡張を追加

- [x] TypeSpec の`@extension`デコレータを使用し、AWS 固有の拡張情報を付与する。
- [x] `x-amazon-apigateway-integration` を使用して、バックエンドの Lambda 関数と統合する。
- [x] `x-amazon-apigateway-authtype` を `cognito_user_pools` に設定する。
- [x] `x-amazon-apigateway-authorizer` で、使用する Cognito User Pool オーソライザーを指定する。

## 3. OpenAPI 生成

- [x] TypeSpec CLI を使用して、定義ファイルから OpenAPI 3.0 仕様を生成する。
- [x] `package.json`に`tsp`コマンドを登録する。
- [x] 生成された YAML ファイルに、拡張属性が含まれていることを確認する。

## 4. 実際の API Gateway デプロイ

- [x] スクラッチの状態で`cdk synth`できるようにする
- [x] 前提となる AWS リソース（Lambda, Cognito）のCDKコードを記述する。
  - [x] Lambda
  - [x] Cognito
- [x] CDKを実行して、前提となる AWS リソース（Lambda, Cognito）を構築する。
  - [x] Lambda
  - [x] Cognito
- [x] `SpecRestApi` を使用して API GatewayのCDKコードを記述する。（OpenAPIファイルのプレースホルダー部分を置き換えるような処理を入れる）
- [x] AWS プロファイルを設定する（`postCreateCommand.local.sh` を使用）。
- [x] `cdk deploy` を実行してデプロイする。

## 5. Codespaces 対応

- [x] `devcontainer.json` と `Dockerfile` を作成する。
- [x] `postCreateCommand` で `npm install` を実行する。

## 6. 動作確認

- [x] デプロイされた API Gateway のエンドポイントにリクエストを送信し、正常なレスポンスを確認する。
- [x] 認証トークンあり/なしでリクエストを送信し、認証が機能していることを確認する。
