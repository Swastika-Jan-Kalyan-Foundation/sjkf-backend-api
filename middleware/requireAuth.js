import { verifyToken } from "../config/jwt.js";
import User from "../models/User.js";

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.session;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
     
      res.clearCookie("session", cookieClearOptions());
      return res.status(401).json({ error: "Session expired, please log in again" });
    }

    const user = await User.findById(payload.sub);
    if (!user || user.tokenVersion !== payload.tv) {
     
      res.clearCookie("session", cookieClearOptions());
      return res.status(401).json({ error: "Session no longer valid" });
    }

    req.user = { id: user._id.toString(), username: user.username };
    next();
  } catch (err) {
    next(err);
  }
}

function cookieClearOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };
}

export default requireAuth;
