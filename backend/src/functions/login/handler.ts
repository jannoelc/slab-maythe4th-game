import * as jwt from "jsonwebtoken";
import * as cookie from "cookie";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, formatErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { TeamManager } from "@libs/managers/team-manager";

const DAYS = 24 * 60 * 60;

export const generateCookie = (id: string, expireTimeInDays: number) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expireTimeInDays + "d",
  });

  return cookie.serialize("token", token, {
    maxAge: expireTimeInDays * DAYS,
    httpOnly: true,
    sameSite: process.env.IS_OFFLINE ? "strict" : "none",
    secure: process.env.IS_OFFLINE ? false : true,
  });
};

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { id, password } = event.body;

  if (id && password) {
    try {
      const team = await TeamManager.login(id, password);

      return formatJSONResponse(team as any, {
        "Set-Cookie": generateCookie(team.id, 1),
      });
    } catch (error) {
      console.error(error);
      return formatErrorResponse(401, "INVALID_CREDENTIALS");
    }
  }

  return formatErrorResponse(400, "BAD_REQUEST");
};

export const main = middyfy(login);
