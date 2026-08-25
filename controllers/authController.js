import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken, SESSION_SECONDS } from "../config/jwt.js";

const DUMMY_HASH =
  "$2a$12$CwTycUXWue0Thq9StjUM0uJ8w8Q6XeAlL8kZ0O8QO8QO8QO8QO8Qe";

function cookieOptions() {
  return {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "none", 
    maxAge: SESSION_SECONDS * 1000,
    path: "/",
  };
}

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({
      username: username.trim(),
    }).select("+passwordHash");

    const hashToCheck = user ? user.passwordHash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(password, hashToCheck);

    if (!user || !isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid username or password" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    res.cookie("session", token, cookieOptions());

    return res.json({
      user: { username: user.username },
      expiresInHours: SESSION_SECONDS / 3600,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("session", {
    ...cookieOptions(),
    maxAge: undefined,
  });

  return res.json({ ok: true });
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};