import User from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.matchPassword(req.body.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user._id);
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ message: "Login successful" });
});

export const me = asyncHandler(async (req, res) => {
  // protect middleware sets req.user = { id }
  res.json({ id: req.user.id });
});

export const logout = asyncHandler(async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    sameSite: isProd ? "none" : "lax",
    secure: isProd
  });
  res.json({ message: "Logged out" });
});
