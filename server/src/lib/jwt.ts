import jwt from "jsonwebtoken";

export type SessionUser = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  provider: "google";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET");
  }
  return secret;
}

export function signSessionToken(user: SessionUser) {
  return jwt.sign(user, getJwtSecret(), {
    expiresIn: "7d",
  });
}

export function verifySessionToken(token: string): SessionUser {
  return jwt.verify(token, getJwtSecret()) as SessionUser;
}
