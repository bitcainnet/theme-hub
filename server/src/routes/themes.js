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

// Helper function to extract category from theme ID
const getThemeCategory = (themeId) => {
  const categoryMap = {
    // Dark Themes
    'midnight': 'dark',
    'obsidian': 'dark',
    'charcoal': 'dark',
    'deep-ocean': 'dark',
    'void': 'dark',
    'noir': 'dark',

    // Light Themes
    'daylight': 'light',
    'pearl': 'light',
    'cloud': 'light',
    'paper': 'light',
    'vanilla': 'light',
    'snow': 'light',

    // Space & Astronomy
    'nebula': 'space',
    'supernova': 'space',
    'galaxy': 'space',
    'mars': 'space',
    'lunar': 'space',
    'stellar': 'space',
    'cosmic-dust': 'space',
    'black-hole': 'space',
    'andromeda': 'space',
    'solar-flare': 'space',

    // Gaming & Esports
    'esports-purple': 'gaming',
    'victory-gold': 'gaming',
    'arena': 'gaming',
    'pixel-art': 'gaming',
    'power-up': 'gaming',
    'boss-battle': 'gaming',
    'speedrun': 'gaming',
    'achievement': 'gaming',

    // Food & Beverage
    'matcha': 'food',
    'espresso': 'food',
    'blueberry': 'food',
    'strawberry': 'food',
    'lime': 'food',
    'chocolate': 'food',
    'bubblegum': 'food',
    'mojito': 'food',

    // Art Movements
    'impressionist': 'art',
    'pop-art': 'art',
    'art-deco': 'art',
    'abstract': 'art',
    'renaissance': 'art',
    'minimalism': 'art',
    'cubism': 'art',
    'surrealism': 'art',

    // Cities & Destinations
    'tokyo-nights': 'cities',
    'paris-cafe': 'cities',
    'sahara-sunset': 'cities',
    'nordic-frost': 'cities',
    'bali-beach': 'cities',
    'manhattan': 'cities',
    'santorini': 'cities',
    'moroccan-spice': 'cities',
    'venice-canal': 'cities',
    'iceland': 'cities',

    // Music Genres
    'jazz-club': 'music',
    'rock-concert': 'music',
    'classical-symphony': 'music',
    'edm-rave': 'music',
    'reggae-vibes': 'music',
    'lofi-chill': 'music',
    'hip-hop': 'music',
    'blues': 'music',

    // Weather & Climate
    'thunderstorm': 'weather',
    'rainbow': 'weather',
    'foggy-morning': 'weather',
    'sunny-day': 'weather',
    'northern-lights': 'weather',
    'hurricane': 'weather',
    'drought': 'weather',
    'blizzard': 'weather',

    // Fantasy & RPG
    'dragon-fire': 'fantasy',
    'elven-forest': 'fantasy',
    'wizard-tower': 'fantasy',
    'dark-dungeon': 'fantasy',
    'holy-paladin': 'fantasy',
    'necromancer': 'fantasy',
    'enchanted-crystal': 'fantasy',
    'royal-castle': 'fantasy',
    'shadow-realm': 'fantasy',
    'mythic-gold': 'fantasy',

    // Cinematic
    'film-noir': 'cinematic',
    'sci-fi-future': 'cinematic',
    'western-sunset': 'cinematic',
    'horror': 'cinematic',
    'romantic-drama': 'cinematic',
    'action-hero': 'cinematic',
    'mystery-thriller': 'cinematic',
    'fantasy-epic': 'cinematic',

    // Holographic & Futuristic
    'hologram': 'futuristic',
    'chrome': 'futuristic',
    'neon-grid': 'futuristic',
    'quantum': 'futuristic',
    'laser-beam': 'futuristic',
    'digital-rain': 'futuristic',
    'plasma': 'futuristic',
    'ai-core': 'futuristic',

    // Wellness & Zen
    'zen-garden': 'wellness',
    'meditation': 'wellness',
    'spa-retreat': 'wellness',
    'yoga-flow': 'wellness',
    'bamboo-forest': 'wellness',
    'himalayan-salt': 'wellness',
    'aromatherapy': 'wellness',
    'mindfulness': 'wellness',

    // Industrial
    'factory': 'industrial',
    'steel-mill': 'industrial',
    'urban-decay': 'industrial',
    'construction': 'industrial',
    'machinery': 'industrial',
    'blueprint': 'industrial',

    // Neon Cities
    'neon-tokyo': 'neon',
    'neon-seoul': 'neon',
    'neon-miami': 'neon',
    'neon-shanghai': 'neon',
    'neon-vegas': 'neon',
    'neon-berlin': 'neon',

    // Abstract & Artistic
    'kaleidoscope': 'artistic',
    'watercolor': 'artistic',
    'oil-painting': 'artistic',
    'ink-wash': 'artistic',
    'graffiti': 'artistic',
    'stained-glass': 'artistic',
    'mosaic': 'artistic',
    'tie-dye': 'artistic'
  };

  return categoryMap[themeId] || 'other';
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
      (theme.description && theme.description.toLowerCase().includes(query)) ||
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
