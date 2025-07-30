# TODO

## 1. 基本的なTypeSpecファイルの作成

- [x] `main.tsp` に、基本的なAPIとモデルを定義する。

## 2. AWS固有の拡張を追加

- [ ] `@amazon-apigateway/openapi-ext` ライブラリを使用し、AWS固有の拡張情報を付与する。
- [ ] `x-amazon-apigateway-integration` を使用して、バックエンドのLambda関数と統合する。
- [ ] `x-amazon-apigateway-authtype` を `cognito_user_pools` に設定する。
- [ ] `x-amazon-apigateway-authorizer` で、使用するCognito User Poolオーソライザーを指定する。

## 3. OpenAPI生成

- [x] TypeSpec CLIを使用して、定義ファイルからOpenAPI 3.0仕様を生成する。
- [x] `package.json`に`tsp`コマンドを登録する。
- [ ] 生成されたYAMLファイルに、拡張属性が含まれていることを確認する。

## 4. 実際のAPI Gatewayデプロイ

- [ ] `cdk init` コマンドでTypeScriptのプロジェクトを作成する。
- [ ] AWSプロファイルを設定する（`postCreateCommand.local.sh` を使用）。
- [ ] AWS CDK (TypeScript) を使用して、生成されたOpenAPI仕様からAPI Gatewayをデプロイする。
- [ ] CDKで前提となるAWSリソース（Lambda, Cognito）を構築する。
- [ ] `SpecRestApi` を使用してAPI Gatewayを構築する。
- [ ] `cdk deploy` を実行してデプロイする。

## 5. Codespaces対応

- [x] `devcontainer.json` と `Dockerfile` を作成する。
- [x] `postCreateCommand` で `npm install` を実行する。

## 6. 動作確認

- [ ] デプロイされたAPI Gatewayのエンドポイントにリクエストを送信し、正常なレスポンスを確認する。
- [ ] 認証トークンあり/なしでリクエストを送信し、認証が機能していることを確認する。
