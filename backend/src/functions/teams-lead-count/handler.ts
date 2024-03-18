import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, formatErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { TeamManager } from "@libs/managers/team-manager";

const teamsLeadCount: ValidatedEventAPIGatewayProxyEvent<{}> = async () => {
  try {
    const teams = await TeamManager.getTeamScores();

    return formatJSONResponse({ teams });
  } catch (error) {
    console.error(error);
    return formatErrorResponse(500);
  }
};

export const main = middyfy(teamsLeadCount);
