# TypeSpec API Gateway OpenAPI Extension Demo

## 概要

このプロジェクトは、[TypeSpec](https://typespec.io/) を使用して、AWS API Gatewayの独自拡張（`x-amazon-apigateway-integration`など）を含むOpenAPI仕様を生成する方法をデモンストレーションするためのリポジトリです。TypeSpecの拡張機能やデコレータを活用し、AWS固有の設定をOpenAPIに組み込む手法を検証します。

## 前提

- GitHub Codespaces またはその他のDev Container互換環境で実行することを想定しています。
- 有効なAWSアカウントを持っており、環境変数を通じて認証情報が設定済みであること。

## 留意点

`cdk deploy` を実行すると、AWSリソースが作成され、課金が発生する可能性があります。デプロイされるリソース内容を十分に確認した上で、自己責任で実行してください。

## 手順

1. **AWS認証情報の設定**
   CDKがAWSリソースを操作できるように、シェル環境にAWSの認証情報を設定します。

2. **依存関係のインストール**

   ```bash
   npm install
   ```

3. **TypeSpecのコンパイル**
   TypeSpecの定義ファイル（`main.tsp`）をコンパイルし、OpenAPI仕様を生成します。

   ```bash
   npm run tsp
   ```

4. **CDKテンプレートの合成**
   CDKアプリケーションを合成し、CloudFormationテンプレートにエラーがないか確認します。

   ```bash
   cdk synth
   ```

5. **AWSリソースのデプロイ**
   CDKを使用して、API GatewayやLambdaなどのAWSリソースをデプロイします。
   ```bash
   cdk deploy
   ```

## 動作確認

デプロイが完了したら、以下のコマンドを実行してAPIの動作を確認します。
シェル環境にAWSの認証情報が設定されている必要があります。

### Cognito認証トークンの取得と利用手順

1.  **環境変数の設定:**
    CDKのデプロイ完了時に出力されるAWSリソースのリソースIDなどと、ユーザ情報を変数に設定します。

    ```bash
    STACK_NAME=$(cdk list --notices false)
    USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" --output text)
    USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" --output text)
    EMAIL=$(< /dev/urandom tr -dc A-Za-z0-9 | head -c10; echo "@example.com")
    PASSWORD=$(< /dev/urandom tr -dc 'a-zA-Z0-9^$*.[]()?!@#%&/\\,><:;|_~`+=-' | head -c128)
    API_ENDPOINT=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" --output text)
    ```

2.  **テストユーザーの作成:**
    AWS CLIを使用してCognitoにテストユーザーを作成します。

    ```bash
    aws cognito-idp sign-up \
      --client-id $USER_POOL_CLIENT_ID \
      --username $EMAIL \
      --password $PASSWORD \
      --user-attributes Name="email",Value="$EMAIL"
    ```

3.  **ユーザーの有効化:**
    作成したユーザーを有効化します。

    ```bash
    aws cognito-idp admin-confirm-sign-up \
      --user-pool-id $USER_POOL_ID \
      --username $EMAIL
    ```

4.  **認証トークンの取得:**
    ユーザー名とパスワードで認証し、IDトークンを取得します。

    ```bash
    ID_TOKEN=$(aws cognito-idp admin-initiate-auth \
      --auth-flow ADMIN_USER_PASSWORD_AUTH \
      --user-pool-id $USER_POOL_ID \
      --client-id $USER_POOL_CLIENT_ID \
      --auth-parameters "{\"USERNAME\":\"$EMAIL\",\"PASSWORD\":\"$PASSWORD\"}" \
      --query 'AuthenticationResult.IdToken' \
      --output text)
    ```

5.  **トークンを利用したAPIリクエスト:**
    取得したIDトークンを`Authorization`ヘッダーに含めてAPIを呼び出します。

    ```bash
    curl -H "Authorization: $ID_TOKEN" ${API_ENDPOINT}/hello
    ```
