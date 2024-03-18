import { DynamoDB } from "aws-sdk";

export const dbClient =
  process.env.IS_OFFLINE === "true" || process.env.IS_LOCAL === "true"
    ? new DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000",
      })
    : new DynamoDB.DocumentClient();
