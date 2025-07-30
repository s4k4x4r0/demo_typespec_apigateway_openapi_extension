# 設計書

このドキュメントは `requirements.md` に基づく設計を記述します。

## 1. 基本的なTypeSpecファイルの作成

`main.tsp` に、基本的なAPIとモデルを定義します。

- **APIエンドポイント:**
  - `GET /hello`: 簡単な挨拶を返すAPI。
- **モデル:**
  - `Message`: APIが返すメッセージのモデル。
    - `content: string`

## 2. AWS固有の拡張を追加

API Gatewayとの統合のため、`@amazon-apigateway/openapi-ext` ライブラリを使用し、AWS固有の拡張情報を付与します。

- **統合リソース:**
  - `x-amazon-apigateway-integration` を使用して、バックエンドのLambda関数と統合します。
    - LambdaのARNはCDKの実行時までわからないので、`${lambda-hello}`のようなプレースホルダーにしておく。
  - `type` は `aws_proxy` とし、HTTPメソッドは `POST` を指定します。
- **認証:**
  - `x-amazon-apigateway-authtype` を `cognito_user_pools` に設定します。
  - `x-amazon-apigateway-authorizer` で、使用するCognito User Poolオーソライザーを指定します。
    - CognitoユーザプールのARNはCDKの実行までわからないので、`${cognito_user_pool_arn}`のようなプレースホルダーにしておく。

## 3. OpenAPI生成

TypeSpec CLIを使用して、定義ファイルからOpenAPI 3.0仕様を生成します。
npmのコマンドで実行できるように、`package.json`にコマンドを登録しておきます。

- **TypeSpecの事前設定:**
  - 予めtspのコンパイラをインストールする
    - `npm install @typespec/compiler`
  - 設定を`tspconfig.yaml`に記載
    - OpenAPI 3.1.0を出力する設定のみ
- **コマンド:**
  ```bash
  npm run tsp
  ```
- **出力:**
  - `tsp-output/openapi.yaml` が生成されます。
- **検証:**
  - 生成されたYAMLファイルに、`x-amazon-apigateway-integration` と `x-amazon-apigateway-authtype` などの拡張属性が含まれていることを確認します。

## 4. 実際のAPI Gatewayデプロイ

AWS CDK (TypeScript) を使用して、生成されたOpenAPI仕様からAPI Gatewayをデプロイします。

- **CDK事前設定:**
  - CDK CLIのインストールは[Dev Containers Features](./.devcontainer/devcontainer.json)で設定。
  - `cdk init`コマンドでTypeScriptのプロジェクトを作成する。
- **AWSのプロファイル:**
  - このレポジトリを`git clone`した開発者が個別に設定する。
    - `postCreateCommand.local.sh`で設定するのを推奨。
      ```
      export AWS_ACCESS_KEY_ID="<secret>"
      export AWS_SECRET_ACCESS_KEY="<secret>"
      export AWS_SESSION_TOKEN="<secret>"
      export AWS_REGION="<region>"
      ```
    - `postCreateCommand.local.sh`は.gitignoreしておき、Gitにプッシュしないようにする。
- **CDKスタック:**
  - 前提のAWSリソースを構築します。
    - Lambda: `GET /hello`エンドポイントの統合先のLambdaを作成するために、`aws-cdk-lib/aws_lambda_nodejs`を使用します。
      - API Gatewayから呼び出し可能なように、Lambda Permissionを設定します。
    - Cognitoユーザプール: API Gatewayの認証に使えるように、Cognitoユーザプールを作成するために、`aws-cdk-lib/aws_cognito`を使用します。
  - API Gatewayのリソースを構築します。
    - `aws-cdk-lib/aws_apigateway` の `SpecRestApi` を使用します。
      - `apiDefinition` プロパティ
      - `tsp-output/openapi.yaml` を読み込み、その内容を文字列として取得します。
      - 取得した文字列内のプレースホルダー (`{{lambda_integration_uri}}`, `{{cognito_authorizer_id}}` など) を、CDKで作成したLambda関数やCognito Authorizerの実際のARN/IDに置換します。
      - 置換後のOpenAPI仕様の文字列を `apiDefinition` プロパティの設定値とします。
- **デプロイ手順:**
  - `cdk deploy` を実行してデプロイします。

## 5. Codespaces対応

開発環境をコンテナ化し、`devcontainer.json` で定義します。

- **Dockerfile:**
  - Node.js (LTS) をベースイメージとします。
- **devcontainer.json:**
  - `postCreateCommand`
    - `npm install`を予め実行しておく。
    - `git clone`した各開発者が個別に設定を反映させられるように`postCreateCommand.local.sh`（`.gitignore`する）を読み込む

## 6. 動作確認

CDKによってデプロイされたAPI Gatewayが、想定通りに動作することを確認します。

- **確認方法:**
  - デプロイされたAPI Gatewayのエンドポイントに対して、`curl`コマンドやPostmanなどのツールを利用してリクエストを送信します。
- **確認内容:**
  - `GET /hello`エンドポイントにリクエストを送信し、バックエンドのLambdaから期待通りのレスポンス（例: `{"message": "Hello, world!"}`）が返ることを確認します。
  - 認証が有効になっていることを確認するため、Cognitoで認証トークンを取得し、そのトークンをリクエストヘッダーに含めてAPIを呼び出し、正常にレスポンスが返ることを確認します。
  - 認証トークンなしでAPIを呼び出し、認証エラーが返ることを確認します。
