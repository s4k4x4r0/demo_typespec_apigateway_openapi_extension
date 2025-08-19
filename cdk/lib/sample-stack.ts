import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

export class SampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda = new NodejsFunction(this, "HelloLambda", {
      entry: path.join(import.meta.dirname, "lambda/hello.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      logGroup: new logs.LogGroup(this, "HelloLambdaLogGroup", {
        retention: logs.RetentionDays.ONE_DAY,
      }),
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

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "SampleUserPool",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient("UserPoolClient", {
      userPoolClientName: "SampleUserPoolClient",
      authFlows: {
        userSrp: true,
        adminUserPassword: true,
      },
    });

    const openapiString = fs
      .readFileSync(
        path.resolve(
          import.meta.dirname,
          "../../tsp-output/schema/openapi.yaml"
        ),
        "utf-8"
      )
      .replace(
        /__LAMBDA_INTEGRATION_URI__/g,
        `arn:${this.partition}:apigateway:${this.region}:lambda:path/2015-03-31/functions/${helloLambda.functionArn}/invocations`
      )
      .replace(/__COGNITO_USERPOOL_ARN__/g, userPool.userPoolArn);

    const openapi = yaml.load(openapiString) as any;

    const api = new apigateway.SpecRestApi(this, "SpecRestApi", {
      apiDefinition: apigateway.ApiDefinition.fromInline(openapi),
      deployOptions: {
        stageName: "v1",
      },
    });

    helloLambda.addPermission("ApiGatewayInvokePermission", {
      action: "lambda:InvokeFunction",
      principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      sourceArn: api.arnForExecuteApi(),
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.url,
    });
  }
}
