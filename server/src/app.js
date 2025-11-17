import express from "express";
import cors from "cors";
import { themeRouter } from "./routes/themes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/themes", themeRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export { app };
