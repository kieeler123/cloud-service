import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

export function getGoogleAuthUrl(state?: string) {
  return googleClient.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
    state,
  });
}

export async function exchangeCodeForGoogleUser(code: string) {
  const { tokens } = await googleClient.getToken(code);
  const idToken = tokens.id_token;

  if (!idToken) {
    throw new Error("Missing Google id_token");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.sub) {
    throw new Error("Invalid Google user payload");
  }

  return {
    googleSub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    emailVerified: payload.email_verified ?? false,
  };
}
