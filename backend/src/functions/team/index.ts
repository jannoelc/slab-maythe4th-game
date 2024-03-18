import { handlerPath } from "@libs/handler-resolver";
import { cors } from "@libs/cors";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "team",
        authorizer: {
          name: "authorize",
          resultTtlInSeconds: 300,
          type: "request",
        },
        cors,
      },
    },
  ],
};
