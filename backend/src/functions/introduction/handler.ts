import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, formatErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { s3 } from "@libs/s3";

const signedUrlExpireSeconds = 60 * 60 * 24;

const introduction: ValidatedEventAPIGatewayProxyEvent<{}> = async () => {
  try {
    const introObject = await s3
      .getObject({
        Bucket: process.env.S3_SEED_DATA_BUCKET,
        Key: "intro.json",
      })
      .promise();

    const introData = JSON.parse(introObject.Body.toString());

    if (introData.audio) {
      introData.audio = await s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_SEED_DATA_BUCKET,
        Key: introData.audio,
        Expires: signedUrlExpireSeconds,
      });
    }

    return formatJSONResponse(introData, {
      "Cache-Control": "public, max-age=86400",
    });
  } catch (error) {
    console.error(error);
    return formatErrorResponse(500);
  }
};

export const main = middyfy(introduction);
