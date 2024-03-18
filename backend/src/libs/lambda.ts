import middy from "@middy/core";
import cors from "@middy/http-cors";
import errorLogger from "@middy/error-logger";
import inputOutputLogger from "@middy/input-output-logger";
import middyJsonBodyParser from "@middy/http-json-body-parser";

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(errorLogger())
    .use(inputOutputLogger())
    .use(
      cors({
        credentials: true,
        origin: "https://slab-bg.club",
        methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD",
        requestMethods: "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD",
        headers:
          "X-Requested-With, X-HTTP-Method-Override, Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Cookie, Set-Cookie, Last-Modified, Pragma, Accept, WWW-Authenticate, Server-Authorization",
        exposeHeaders:
          "X-Requested-With, X-HTTP-Method-Override, Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Cookie, Set-Cookie, Last-Modified, Pragma, Accept, WWW-Authenticate, Server-Authorization",
        requestHeaders:
          "X-Requested-With, X-HTTP-Method-Override, Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Cookie, Set-Cookie, Last-Modified, Pragma, Accept, WWW-Authenticate, Server-Authorization",
        maxAge: 86400,
      })
    );
};
