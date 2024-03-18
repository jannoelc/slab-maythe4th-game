import { dbClient } from "@libs/db-client";

import { Lead } from "@libs/models/lead";

export class LeadManager {
  static tableName = process.env.LEADS_TABLE;

  static async getLeadById(id: string) {
    const params = {
      ExpressionAttributeNames: {
        "#hash_key": "id",
        "#sort_key": "area_address",
      },
      ExpressionAttributeValues: {
        ":hash_key": id,
        ":sort_key": "#",
      },
      KeyConditionExpression:
        "#hash_key = :hash_key AND begins_with(#sort_key, :sort_key)",
      TableName: this.tableName,
    };

    const { Items } = await dbClient.query(params).promise();

    const [result] = Items;

    if (!result) {
      throw new Error("ITEM_NOT_FOUND");
    }

    return this._parseToModel(result);
  }

  private static _parseToModel(item: any): Lead {
    const { id, area_address, content } = item;
    const [_, area, address] = area_address.split("#");

    return { id, area, address, content };
  }
}
