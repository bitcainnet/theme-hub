export const themes = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Soft gradients inspired by the northern lights.",
    version: "1.0.0",
    tokens: {
      primary: "#0f172a",
      accent: "#38bdf8",
      background: "#020617",
      surface: "#0f172a",
      text: "#e2e8f0",
      border: "#334155"
    },
    assetsUrl: "/themes/aurora"
  },
  {
    id: "canyon",
    name: "Canyon",
    description: "Earth tones for focused productivity.",
    version: "1.0.2",
    tokens: {
      primary: "#7c2d12",
      accent: "#f97316",
      background: "#111827",
      surface: "#1f2937",
      text: "#f8fafc",
      border: "#4b5563"
    },
    assetsUrl: "/themes/canyon"
  }
];

export const deviceRegistry = new Map();

export const registerDevice = (deviceId) => {
  const registered = deviceRegistry.get(deviceId) ?? { deviceId, lastSynced: null };
  registered.lastSynced = null;
  deviceRegistry.set(deviceId, registered);
  return registered;
};

export const determineTheme = (deviceId, requestedThemeId) => {
  const theme = themes.find((item) => item.id === requestedThemeId) ?? themes[0];
  return {
    ...theme,
    appliedAt: new Date().toISOString(),
    deviceId,
    syncId: `${deviceId}-${theme.id}-${Date.now()}`
  };
};
