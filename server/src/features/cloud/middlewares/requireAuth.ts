import { verifySessionToken } from "../../../lib/jwt.js";
import { type Request, type Response, type NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, code: "MISSING_AUTH_HEADER" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (
      scheme !== "Bearer" ||
      !token ||
      token === "undefined" ||
      token === "null"
    ) {
      return res.status(401).json({ ok: false, code: "INVALID_AUTH_HEADER" });
    }

    req.user = verifySessionToken(token);
    next();
  } catch (error) {
    console.error("requireAuth error:", error);
    return res.status(401).json({ ok: false, code: "INVALID_TOKEN" });
  }
}
