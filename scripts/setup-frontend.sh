#!/bin/bash

# Theme Hub Frontend Setup Script
# Automates setup of a new frontend project with Tailwind CSS, React, and shadcn/ui

set -e

echo "🎨 Theme Hub Frontend Setup"
echo "============================"
echo ""

# Get project name
read -p "Enter project name (default: theme-app): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-theme-app}

echo ""
echo "📦 Creating Vite + React + TypeScript project..."
npm create vite@latest "$PROJECT_NAME" -- --template react-ts

cd "$PROJECT_NAME"

echo ""
echo "📥 Installing dependencies..."
npm install

echo ""
echo "🎨 Installing Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo ""
echo "✨ Installing Framer Motion..."
npm install framer-motion

echo ""
echo "🔧 Installing additional utilities..."
npm install axios lucide-react clsx tailwind-merge

echo ""
echo "🎭 Installing shadcn/ui..."
npx shadcn@latest init -y

echo ""
echo "📦 Installing essential shadcn components..."
npx shadcn@latest add button -y
npx shadcn@latest add card -y
npx shadcn@latest add dialog -y
npx shadcn@latest add dropdown-menu -y
npx shadcn@latest add input -y
npx shadcn@latest add label -y
npx shadcn@latest add select -y
npx shadcn@latest add switch -y
npx shadcn@latest add tabs -y
npx shadcn@latest add toast -y
npx shadcn@latest add tooltip -y

echo ""
echo "📝 Creating ThemeContext..."
mkdir -p src/contexts
cat > src/contexts/ThemeContext.tsx << 'EOF'
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeTokens {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  version: string;
  tokens: ThemeTokens;
  assetsUrl: string;
}

interface ThemeContextType {
  currentTheme: Theme | null;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/themes');
        const data = await response.json();
        setThemes(data.themes);

        const savedThemeId = localStorage.getItem('selectedTheme');
        const initialTheme = savedThemeId
          ? data.themes.find((t: Theme) => t.id === savedThemeId) || data.themes[0]
          : data.themes[0];

        setCurrentTheme(initialTheme);
        applyTheme(initialTheme);
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme.tokens).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('selectedTheme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
EOF

echo ""
echo "🎯 Updating tailwind.config.js..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. cd $PROJECT_NAME"
echo "   2. Make sure Theme Hub server is running (npm run start:server from theme-hub root)"
echo "   3. npm run dev"
echo ""
echo "📚 Check out docs/FRONTEND_DEVELOPMENT.md for comprehensive guides and examples"
echo ""
