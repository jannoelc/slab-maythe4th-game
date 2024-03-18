import * as AWS from "aws-sdk";

export const s3 =
  process.env.IS_LOCAL === "true"
    ? new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
        endpoint: new AWS.Endpoint("http://localhost:4569"),
      })
    : new AWS.S3();
