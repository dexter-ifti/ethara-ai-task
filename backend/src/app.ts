import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { notFoundHandler } from "./middleware/notFoundHandler.ts";
import { authRoutes } from "./routes/auth.routes.ts";
import { commentRoutes } from "./routes/comment.routes.ts";
import { dashboardRoutes } from "./routes/dashboard.routes.ts";
import { projectRoutes } from "./routes/project.routes.ts";
import { taskRoutes } from "./routes/task.routes.ts";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
