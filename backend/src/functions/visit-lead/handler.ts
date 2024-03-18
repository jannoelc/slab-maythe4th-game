import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, formatErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { LeadManager } from "@libs/managers/lead-manager";
import { TeamManager } from "@libs/managers/team-manager";

const visitLead: ValidatedEventAPIGatewayProxyEvent<{}> = async (event) => {
  const teamId = event.requestContext.authorizer.principalId;
  const { id: leadId } = event.pathParameters;

  try {
    const lead = await LeadManager.getLeadById(leadId);
    const team = await TeamManager.markLeadAsVisited(teamId, lead);

    return formatJSONResponse({ lead, team });
  } catch (error) {
    console.error(error);
    if (error.message === "ACTION_NOT_ALLOWED") {
      return formatErrorResponse(405, "ACTION_NOT_ALLOWED");
    }

    return formatErrorResponse(500);
  }
};

export const main = middyfy(visitLead);
