import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";
import "@typespec/openapi3";
import "@typespec/compiler";

using Http;
using OpenAPI;

@service(#{title: "Demo API"})
@useAuth(CognitoAuthorizer)
namespace DemoService;

@extension("x-amazon-apigateway-authtype", "cognito_user_pools")
@extension("x-amazon-apigateway-authorizer", #{
  type: "cognito_user_pools",
  providerARNs: #["__COGNITO_USERPOOL_ARN__"],
})
model CognitoAuthorizer is ApiKeyAuth<ApiKeyLocation.header, "Authorization">;

model Message {
  content: string;
}

@error
model Error {
  code: int32;
  message: string;
}

@route("/hello")
interface Hello {
  @get
  @tag("Default")
  @extension("x-amazon-apigateway-integration", #{ 
    type: "aws_proxy",
    httpMethod: "POST",
    uri: "__LAMBDA_INTEGRATION_URI__",
    passthroughBehavior: "when_no_match",
    contentHandling: "CONVERT_TO_TEXT",
    timeoutInMillis: 29000,
  })
  get(): Message | Error;
}