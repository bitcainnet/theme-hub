import fetch from "node-fetch";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("baseUrl", {
    type: "string",
    description: "URL of the Theme Hub API",
    default: process.env.THEME_HUB_URL ?? "http://localhost:4000"
  })
  .option("deviceId", {
    type: "string",
    description: "Device ID that will receive the theme",
    demandOption: true
  })
  .option("theme", {
    type: "string",
    description: "Theme ID to sync",
    demandOption: false
  })
  .option("list", {
    type: "boolean",
    description: "Show catalog before syncing",
    default: true
  })
  .help()
  .parseSync();

const apiUrl = argv.baseUrl.replace(/\/$/, "") + "/api/themes";

const log = (message) => console.log(`[theme-hub-cli] ${message}`);

const listThemes = async () => {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error("Unable to fetch theme catalog");
  const payload = await response.json();
  log(`Found ${payload.count ?? payload.themes?.length ?? 0} themes`);
  payload.themes?.forEach((item) => {
    log(`- ${item.id}: ${item.name} (${item.version})`);
  });
  return payload.themes ?? [];
};

const applyTheme = async (themeId) => {
  const response = await fetch(`${apiUrl}/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId: argv.deviceId, themeId })
  });
  if (!response.ok) {
    const errPayload = await response.json().catch(() => ({}));
    throw new Error(errPayload?.errors ? JSON.stringify(errPayload.errors) : "Sync request failed");
  }
  const payload = await response.json();
  log(`Theme ${payload.applied?.name ?? themeId} synced to ${argv.deviceId}`);
  return payload;
};

const main = async () => {
  try {
    const catalog = argv.list ? await listThemes() : [];
    const targetTheme = argv.theme ?? catalog?.[0]?.id;
    if (!targetTheme) {
      log("No theme selected and catalog is empty");
      return;
    }
    await applyTheme(targetTheme);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};

main();
