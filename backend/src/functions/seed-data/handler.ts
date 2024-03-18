import { Handler } from "aws-lambda";
import * as bcrypt from "bcryptjs";

import { s3 } from "@libs/s3";
import { dbClient } from "@libs/db-client";

const batchByCount = (list: Array<any>, count: number) => {
  let latestList: Array<any>;
  const batches = [];
  let counter = 0;

  do {
    latestList = list.slice(counter * count, counter * count + count);
    batches.push(latestList);
    counter += 1;
  } while (latestList.length >= count);

  return batches;
};

const batchWrite = async (list: Array<any>, tableName: string) => {
  await dbClient
    .batchWrite({
      RequestItems: {
        [tableName]: list.map((Item) => ({
          PutRequest: { Item },
        })),
      },
    })
    .promise();
};

const seedData: Handler = async () => {
  const leadsObject = await s3
    .getObject({
      Bucket: process.env.S3_SEED_DATA_BUCKET,
      Key: "leads.json",
    })
    .promise();

  const teamsObject = await s3
    .getObject({
      Bucket: process.env.S3_SEED_DATA_BUCKET,
      Key: "teams.json",
    })
    .promise();

  const leadsData: Array<any> = JSON.parse(leadsObject.Body.toString());
  const teamsData: Array<any> = await Promise.all(
    JSON.parse(teamsObject.Body.toString()).map(async (data) => ({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    }))
  );

  batchByCount(leadsData, 25).forEach((list) => {
    batchWrite(list, process.env.LEADS_TABLE);
  });

  batchByCount(teamsData, 25).forEach((list) => {
    batchWrite(list, process.env.TEAMS_TABLE);
  });
};

export const main = seedData;
