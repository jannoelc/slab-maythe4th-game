import { TeamConnectionManager } from "@libs/managers/team-connection-manager";
import { failedResponse, successfullResponse } from "@libs/websocket";
import { Handler } from "aws-lambda";

const disconnect: Handler = async (event, _, callback) => {
  console.info("disconnect", event);
  try {
    await TeamConnectionManager.deleteConnection(
      event.requestContext.connectionId
    );
    callback(null, successfullResponse);
  } catch (error) {
    failedResponse(500, JSON.stringify(error));
  }
};

export const main = disconnect;
