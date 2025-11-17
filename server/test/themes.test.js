import assert from "node:assert";
import { themes, determineTheme } from "../src/data/themes.js";

assert.ok(Array.isArray(themes), "Themes should be an array");
assert.ok(themes.length >= 1, "Expect at least one catalog theme");

const applied = determineTheme("demo-device", "aurora");
assert.strictEqual(applied.deviceId, "demo-device", "Device id should propagate");
assert.strictEqual(applied.id, "aurora", "Should match requested theme when available");
assert.ok(applied.syncId.includes("demo-device"), "Sync ID should include device info");

console.log("[PASS] server/test/themes.test.js");
