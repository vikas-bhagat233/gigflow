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
  res.cookie("token", token, { httpOnly: true });
  res.json({ message: "Login successful" });
});

export const me = asyncHandler(async (req, res) => {
  // protect middleware sets req.user = { id }
  res.json({ id: req.user.id });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});
