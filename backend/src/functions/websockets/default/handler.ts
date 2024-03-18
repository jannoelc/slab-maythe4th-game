import { TeamConnectionManager } from "@libs/managers/team-connection-manager";
import { failedResponse, successfullResponse } from "@libs/websocket";
import { Handler } from "aws-lambda";

const default_: Handler = async (event, __, callback) => {
  const eventBody = JSON.parse(event.body);

  if (eventBody.type === "SUBSCRIBE") {
    try {
      await TeamConnectionManager.addConnection(
        eventBody.teamId,
        event.requestContext.connectionId
      );

      callback(null, successfullResponse);
    } catch (error) {
      console.error(error);
      failedResponse(500, JSON.stringify(error));
    }
  }
};

export const main = default_;
