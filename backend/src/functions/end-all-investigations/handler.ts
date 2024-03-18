import { TeamManager } from "@libs/managers/team-manager";
import { Handler } from "aws-lambda";

const endAllInvestigations: Handler = async () => {
  await TeamManager.endAllInvestigations();
};

export const main = endAllInvestigations;
