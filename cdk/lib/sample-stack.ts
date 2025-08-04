import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";

export class SampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda = new NodejsFunction(this, "HelloLambda", {
      entry: path.join(import.meta.dirname, "lambda/hello.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      logRetention: logs.RetentionDays.ONE_DAY,
      loggingFormat: lambda.LoggingFormat.JSON,
      systemLogLevelV2: lambda.SystemLogLevel.DEBUG,
      applicationLogLevelV2: lambda.ApplicationLogLevel.TRACE,
      bundling: {
        format: lambda_nodejs.OutputFormat.ESM,
        target: "es2022",
        mainFields: ["module", "main"],
        sourcesContent: false,
        minify: true,
        metafile: true,
        externalModules: ["@aws-lambda-powertools/*", "@aws-sdk/*"],
        banner:
          "const require = (await import('node:module')).createRequire(import.meta.url);const __filename = (await import('node:url')).fileURLToPath(import.meta.url);const __dirname = (await import('node:path')).dirname(__filename);",
      },
    });
  }
}
