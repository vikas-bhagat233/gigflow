import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { initSocket } from "./config/socket.js";

import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser requests (no Origin)
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      return allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("CORS blocked"));
    },
    credentials: true
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorHandler);

const server = http.createServer(app);
await initSocket(server);

server.listen(process.env.PORT, () =>
  console.log(`🚀 Backend running on port ${process.env.PORT}`)
);
