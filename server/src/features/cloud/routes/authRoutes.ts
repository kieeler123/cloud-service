import { Router } from "express";
import {
  getGoogleAuthUrl,
  exchangeCodeForGoogleUser,
} from "../../../lib/googleOAuth.js";
import { signSessionToken, type SessionUser } from "../../../lib/jwt.js";
import { requireAuth } from "../middlewares/requireAuth.js";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

const authRoutes = Router();

authRoutes.get("/google/start", (req, res) => {
  try {
    const redirectUrl = getGoogleAuthUrl();
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      code: "GOOGLE_START_FAILED",
      message: "Failed to start Google login",
    });
  }
});

authRoutes.get("/google/callback", async (req, res) => {
  try {
    const code = typeof req.query.code === "string" ? req.query.code : "";

    if (!code) {
      return res.redirect(
        `${process.env.CLIENT_APP_URL}/login?error=missing_code`,
      );
    }

    const googleUser = await exchangeCodeForGoogleUser(code);

    const token = signSessionToken({
      uid: googleUser.googleSub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      provider: "google",
    });

    return res.redirect(
      `${process.env.CLIENT_APP_URL}/auth/callback#token=${encodeURIComponent(token)}`,
    );
  } catch (error) {
    console.error(error);
    return res.redirect(
      `${process.env.CLIENT_APP_URL}/login?error=google_login_failed`,
    );
  }
});

authRoutes.get("/me", requireAuth, (req, res) => {
  return res.json({
    ok: true,
    user: req.user,
  });
});

authRoutes.post("/logout", (_req, res) => {
  return res.json({
    ok: true,
  });
});

export default authRoutes;
