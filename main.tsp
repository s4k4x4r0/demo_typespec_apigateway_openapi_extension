import "@typespec/http";
import "@typespec/rest";

using Http;

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
  get(): Message | Error;
}