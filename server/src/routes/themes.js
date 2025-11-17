import { Router } from "express";
import { z } from "zod";
import { themes, registerDevice, determineTheme } from "../data/themes.js";

const router = Router();

const deviceSchema = z.object({
  deviceId: z.string().min(3)
});

const syncSchema = z.object({
  deviceId: z.string().min(3),
  themeId: z.string().min(1)
});

router.get("/", (req, res) => {
  res.json({ themes, count: themes.length });
});

router.post("/sync", (req, res) => {
  const payload = syncSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ errors: payload.error.flatten().fieldErrors });
  }

  const { deviceId, themeId } = payload.data;
  registerDevice(deviceId);
  const applied = determineTheme(deviceId, themeId);
  res.json({ result: "ok", applied });
});

router.get("/devices/:deviceId", (req, res) => {
  const payload = deviceSchema.safeParse({ deviceId: req.params.deviceId });
  if (!payload.success) {
    return res.status(400).json({ errors: payload.error.flatten().fieldErrors });
  }

  res.json({ deviceId: payload.data.deviceId, status: "registered" });
});

export { router as themeRouter };
