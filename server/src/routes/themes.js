import { Router } from "express";
import { z } from "zod";
import { themes, themeCategories, registerDevice, determineTheme } from "../data/themes.js";

const router = Router();

const deviceSchema = z.object({
  deviceId: z.string().min(3)
});

const syncSchema = z.object({
  deviceId: z.string().min(3),
  themeId: z.string().min(1)
});

// Helper function to extract category from theme ID
const getThemeCategory = (themeId) => {
  return themeCategories[themeId] || 'other';
};

// Get all themes with optional filtering
router.get("/", (req, res) => {
  const { category, search } = req.query;
  let filteredThemes = themes;

  // Filter by category
  if (category) {
    filteredThemes = filteredThemes.filter(theme =>
      getThemeCategory(theme.id) === category.toLowerCase()
    );
  }

  // Filter by search query
  if (search) {
    const query = search.toLowerCase();
    filteredThemes = filteredThemes.filter(theme =>
      theme.name.toLowerCase().includes(query) ||
      theme.description.toLowerCase().includes(query) ||
      theme.id.toLowerCase().includes(query)
    );
  }

  res.json({
    themes: filteredThemes,
    count: filteredThemes.length,
    total: themes.length
  });
});

// Get all available categories
router.get("/categories", (req, res) => {
  const categories = {};

  themes.forEach(theme => {
    const category = getThemeCategory(theme.id);
    if (!categories[category]) {
      categories[category] = {
        name: category,
        themes: [],
        count: 0
      };
    }
    categories[category].themes.push({
      id: theme.id,
      name: theme.name,
      description: theme.description
    });
    categories[category].count++;
  });

  const categoryList = Object.values(categories).sort((a, b) =>
    b.count - a.count
  );

  res.json({
    categories: categoryList,
    count: categoryList.length
  });
});

// Get themes by specific category
router.get("/categories/:category", (req, res) => {
  const { category } = req.params;
  const categoryThemes = themes.filter(theme =>
    getThemeCategory(theme.id) === category.toLowerCase()
  );

  if (categoryThemes.length === 0) {
    return res.status(404).json({
      error: "Category not found",
      message: `No themes found for category: ${category}`
    });
  }

  res.json({
    category: category.toLowerCase(),
    themes: categoryThemes,
    count: categoryThemes.length
  });
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
