# Gemini Code Assistant ワークスペースコンテキスト

このドキュメントは、Gemini Code Assistantがプロジェクトの構造、目的、および主要なファイルを理解するためのコンテキストを提供します。

## プロジェクト概要

このプロジェクト `demo_typespec_apigateway_openapi_extension` は、TypeSpecを使用してAPI Gatewayの独自拡張（x-amazon-apigateway-integration等）を含むOpenAPI仕様を生成する方法について調査し、実装方法をまとめるためのデモプロジェクトです。TypeSpecの拡張機能やデコレータを使用して、AWS固有の設定をOpenAPIに含める手法を検討します。

## 主要技術

- **TypeSpec**: APIを記述するための言語です。
- **CDK**: OpenAPIファイルを使って、API Gatewayをデプロイで切るか確認するために、デモに必要な全てのAWSリソースを管理します。
- **Node.js**: TypeSpecコンパイラとCDKの実行環境です。
- **OpenAPI**: API定義のターゲット仕様フォーマットです。

## コマンド

このプロジェクトの主要なコマンドは、TypeSpecコードをコンパイルしてOpenAPI仕様を生成することです。

- **`npm install`**: 必要な依存関係をインストールします。
- **`npm run tsp`**: `main.tsp`ファイルをコンパイルし、`tsp-output/schema`ディレクトリにOpenAPI仕様を生成します。**TypeSpecファイルを変更した後は、必ずこのコマンドを実行してコンパイルが成功することを確認してください。**

## プロジェクト構造

- `requirements.md`: このプロジェクトの要件を記載しています。
- `design.md`: 要件に基づいた、このプロジェクトの設計を記載しています。
- `progress.md`: 作業の進捗状況を管理する。
- `package.json`: プロジェクトの依存関係とスクリプトを定義します。
- `GEMINI.md`: このファイル。Gemini Code Assistantにコンテキストを提供します。
