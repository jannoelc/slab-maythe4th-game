import * as cookie from "cookie";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

export const generateCookie = () => {
  return cookie.serialize("token", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: process.env.IS_OFFLINE ? "strict" : "none",
    secure: process.env.IS_OFFLINE ? false : true,
  });
};

const logout: ValidatedEventAPIGatewayProxyEvent<{}> = async () => {
  return formatJSONResponse({}, { "Set-Cookie": generateCookie() });
};

export const main = middyfy(logout);
