import express from "express";
import cors from "cors";
import { themeRouter } from "./routes/themes.js";

const app = express();

// Configure CORS - use environment variable or allow all origins
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : '*';

app.use(cors({
  origin: corsOrigins === '*' ? '*' : corsOrigins
}));
app.use(express.json({ limit: "1mb" }));

app.use("/api/themes", themeRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export { app };
