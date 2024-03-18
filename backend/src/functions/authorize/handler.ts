import { Handler } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import * as cookie from "cookie";

function generateAuthResponse(principalId, effect, methodArn) {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument,
  };
}

function generatePolicyDocument(effect, methodArn) {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: methodArn,
      },
    ],
  };

  return policyDocument;
}

const authorize: Handler = async (event, _, callback) => {
  const { methodArn, headers } = event;
  const { token } = cookie.parse(headers.Cookie);

  if (!token || !methodArn) {
    return callback(null, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

  if (decoded && decoded.id) {
    return callback(null, generateAuthResponse(decoded.id, "Allow", methodArn));
  } else {
    return callback(null, generateAuthResponse(decoded.id, "Deny", methodArn));
  }
};

export const main = authorize;
