import { failedResponse, successfullResponse } from "@libs/websocket";
import { Handler } from "aws-lambda";

const connect: Handler = async (_, __, callback) => {
  try {
    callback(null, successfullResponse);
  } catch (error) {
    console.error(error);
    failedResponse(500, JSON.stringify(error));
  }
};

export const main = connect;
