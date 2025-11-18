# Quick Start: Frontend Development with Theme Hub

This guide will get you up and running with a beautiful, animated frontend using Tailwind CSS, React, and shadcn/ui, integrated with Theme Hub in under 10 minutes.

---

## Prerequisites

- Node.js 18+ installed
- Theme Hub server running (`npm run start:server` from theme-hub root)
- Basic knowledge of React and TypeScript

---

## Option 1: Automated Setup (Recommended)

```bash
# From the theme-hub root directory
cd scripts
./setup-frontend.sh

# Follow the prompts
# Enter your project name (or press Enter for default)

# Once complete:
cd your-project-name
npm run dev
```

The script will:
- Create a new Vite + React + TypeScript project
- Install and configure Tailwind CSS
- Install Framer Motion for animations
- Set up shadcn/ui with essential components
- Create the ThemeContext for Theme Hub integration
- Configure custom animations and theme colors

---

## Option 2: Manual Setup

### Step 1: Create React Project

```bash
npm create vite@latest my-theme-app -- --template react-ts
cd my-theme-app
npm install
```

### Step 2: Install Core Dependencies

```bash
# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Animation & utilities
npm install framer-motion axios lucide-react clsx tailwind-merge

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card dialog input select tabs toast
```

### Step 3: Configure Tailwind

Update `tailwind.config.js`:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [],
}
```

### Step 4: Create Theme Context

Create `src/contexts/ThemeContext.tsx` - see the automated setup script or FRONTEND_DEVELOPMENT.md for the full code.

### Step 5: Wrap App with ThemeProvider

Update `src/main.tsx`:

```typescript
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## Your First Component

Create `src/components/ThemeSelector.tsx`:

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, setTheme } = useTheme();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-text mb-4">
        Select Theme
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {themes.map((theme) => (
          <motion.button
            key={theme.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme.id)}
            className={`p-4 rounded-lg ${
              currentTheme?.id === theme.id
                ? 'ring-2 ring-accent'
                : 'hover:ring-1 ring-border'
            }`}
            style={{
              background: `linear-gradient(135deg, ${theme.tokens.primary}, ${theme.tokens.accent})`,
            }}
          >
            <span className="text-white font-semibold">{theme.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
```

Use it in `App.tsx`:

```typescript
import { ThemeSelector } from './components/ThemeSelector';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { currentTheme, isLoading } = useTheme();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-text">Loading themes...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">
          Current Theme: {currentTheme?.name}
        </h1>
        <ThemeSelector />
      </div>
    </div>
  );
}

export default App;
```

---

## Common Components

### Animated Button

```typescript
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

<Button asChild>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Click Me
  </motion.button>
</Button>
```

### Fade In Container

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Staggered List

```typescript
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Available Themes (76 Total)

All themes are immediately available via the Theme Hub API:

### Dark Themes (6)
- Midnight, Obsidian, Charcoal, Deep Ocean, Void, Noir

### Light Themes (6)
- Daylight, Pearl, Cloud, Paper, Vanilla, Snow

### Nature-Inspired (8)
- Forest, Meadow, Sunset, Ocean Breeze, Lavender Fields, Autumn, Cherry Blossom, Desert

### Professional/Corporate (5)
- Corporate Blue, Executive, Slate Professional, Financial, Minimalist Pro

### Developer Themes (8)
- Terminal, Matrix, Dracula, Monokai, Solarized Dark/Light, Nord, One Dark

### Retro/Vintage (5)
- Retro Amber, Retro Green, Commodore 64, Vaporwave, Synthwave

And many more across 15+ categories!

---

## Animation Examples

### Page Transitions

```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Home />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}
```

### Hover Card Effect

```typescript
<motion.div
  whileHover={{
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }}
  className="bg-surface border border-border rounded-lg p-6"
>
  Card Content
</motion.div>
```

### Loading Spinner

```typescript
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full"
/>
```

---

## API Integration

### Fetching Themes

```typescript
// All themes
const response = await fetch('http://localhost:4000/api/themes');
const { themes, count } = await response.json();

// Sync theme to device
await fetch('http://localhost:4000/api/themes/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    deviceId: 'my-device',
    themeId: 'aurora'
  })
});
```

---

## Troubleshooting

### Theme Hub server not connecting

Make sure the server is running:
```bash
# In theme-hub root
npm run start:server
```

### Tailwind classes not working

Ensure your `tailwind.config.js` content paths are correct:
```javascript
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

### shadcn/ui components not styled

Check that you've imported the global CSS:
```typescript
// src/main.tsx
import './index.css'
```

---

## Next Steps

1. **Explore all 76 themes** in your application
2. **Build custom components** using shadcn/ui
3. **Add animations** with Framer Motion
4. **Optimize performance** with code splitting
5. **Deploy** your themed application

For comprehensive patterns and advanced techniques, see:
- [FRONTEND_DEVELOPMENT.md](./FRONTEND_DEVELOPMENT.md) - Complete guide
- [Theme Hub Documentation](../README.md) - Server API docs

---

## Resources

- **Theme Hub Server**: `http://localhost:4000`
- **API Documentation**: [USAGE.md](./USAGE.md)
- **Component Examples**: [FRONTEND_DEVELOPMENT.md](./FRONTEND_DEVELOPMENT.md)
- **shadcn/ui**: https://ui.shadcn.com
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com

Happy coding! 🎨
