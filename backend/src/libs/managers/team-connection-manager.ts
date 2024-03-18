import { dbClient } from "@libs/db-client";

import { TeamConnection } from "@libs/models/team-connection";

export class TeamConnectionManager {
  static tableName = process.env.TEAM_CONNECTION_TABLE;

  static async getAllConnections(teamId: string) {
    const params = {
      ExpressionAttributeNames: {
        "#hash_key": "teamId",
        "#sort_key": "connectionId",
      },
      ExpressionAttributeValues: {
        ":hash_key": teamId,
        ":sort_key": "#",
      },
      KeyConditionExpression:
        "#hash_key = :hash_key AND begins_with(#sort_key, :sort_key)",
      TableName: this.tableName,
    };

    const { Items } = await dbClient.query(params).promise();

    return this._parseToModel(Items);
  }

  static async addConnection(teamId: string, connectionId: string) {
    const params = {
      TransactItems: [
        {
          Put: {
            Item: {
              teamId: teamId,
              connectionId: `#${connectionId}`,
              connectionDate: Date.now(),
            },
            TableName: this.tableName,
          },
        },
      ],
    };

    try {
      const output = await dbClient.transactWrite(params).promise();
      return output.$response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async cleanupConnection(
    teamId: string,
    connectionId: string,
    connectionDate: number
  ) {
    // 5 minutes
    if (Date.now() - connectionDate > 300000) {
      return this.deleteConnection(connectionId);
    }
  }

  static async deleteConnection(connectionId: string) {
    try {
      const r = await dbClient
        .query({
          KeyConditionExpression: "#hash_key = :hash_key",
          ExpressionAttributeNames: {
            "#hash_key": "connectionId",
          },
          ExpressionAttributeValues: {
            ":hash_key": `#${connectionId}`,
          },
          TableName: this.tableName,
          IndexName: "ConnectionIdIndex",
        })
        .promise();

      const output = await dbClient
        .transactWrite({
          TransactItems: r.Items.map((gg) => ({
            Delete: {
              ConditionExpression:
                "#hash_key = :hash_key AND begins_with(#sort_key, :sort_key)",
              ExpressionAttributeNames: {
                "#hash_key": "teamId",
                "#sort_key": "connectionId",
              },
              ExpressionAttributeValues: {
                ":hash_key": gg.teamId,
                ":sort_key": `#${connectionId}`,
              },
              Key: {
                teamId: gg.teamId,
                connectionId: `#${connectionId}`,
              },
              TableName: this.tableName,
            },
          })),
        })
        .promise();
      return output.$response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private static _parseToModel(items: Array<any>): TeamConnection {
    return items.reduce(
      (acc, value) => ({
        teamId: value.teamId,
        connectionIds: [
          ...acc.connectionIds,
          {
            id: value.connectionId.replace(/#/g, ""),
            connectionDate: value.connectionDate,
          },
        ],
      }),
      {
        teamId: "",
        connectionIds: [],
      }
    );
  }
}
