import { TeamConnectionManager } from "@libs/managers/team-connection-manager";
import { TeamManager } from "@libs/managers/team-manager";
import { failedResponse, send } from "@libs/websocket";
import { DynamoDBStreamHandler } from "aws-lambda";

const broadcast: DynamoDBStreamHandler = async (event, _, callback) => {
  try {
    const updatedTeams = event.Records?.map((record) =>
      TeamManager.parseRecord(record)
    );
    await Promise.all(
      updatedTeams
        .filter((team) => !!team)
        .map(async (team) => {
          try {
            const teamConnection =
              await TeamConnectionManager.getAllConnections(team.id);
            await Promise.all(
              teamConnection.connectionIds.map(async (connectionId) => {
                await send(JSON.stringify(team), connectionId.id)
                  .catch(() =>
                    TeamConnectionManager.cleanupConnection(
                      team.id,
                      connectionId.id,
                      connectionId.connectionDate
                    )
                  )
                  .catch((error) => {
                    console.error(
                      team.id,
                      connectionId.id,
                      connectionId.connectionDate,
                      error
                    );
                  });
              })
            );
          } catch (error) {
            console.log(error);
          }
        })
    );

    callback(null);
  } catch (error) {
    console.log(error);
    failedResponse(500, JSON.stringify(error));
  }
};

export const main = broadcast;
