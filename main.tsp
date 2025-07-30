import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";
import "@typespec/openapi3";

using Http;
using OpenAPI;

@service
namespace DemoService;

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
    uri: "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:my-lambda-function/invocations",
    passthroughBehavior: "when_no_match",
    contentHandling: "CONVERT_TO_TEXT",
    timeoutInMillis: 29000,
  })
  @extension("x-amazon-apigateway-authtype", "cognito_user_pools")
  @extension("x-amazon-apigateway-authorizer", #{ 
    type: "cognito_user_pools",
    authorizerId: "abcdef123",
    identitySource: "method.request.header.Authorization",
  })
  get(): Message | Error;
}