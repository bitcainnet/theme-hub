# Frontend Development Guide
## Tailwind CSS, React & shadcn/ui for Theme Hub

This guide provides senior-level patterns and techniques for building animated, beautiful frontends integrated with the Theme Hub system.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Setup & Installation](#setup--installation)
3. [Theme Integration](#theme-integration)
4. [Component Architecture](#component-architecture)
5. [Animation Patterns](#animation-patterns)
6. [shadcn/ui Components](#shadcnui-components)
7. [Best Practices](#best-practices)
8. [Advanced Patterns](#advanced-patterns)
9. [Performance Optimization](#performance-optimization)

---

## Tech Stack Overview

### Core Technologies

- **React 18+**: Modern React with Hooks, Suspense, and Concurrent features
- **Tailwind CSS 3+**: Utility-first CSS framework with JIT compiler
- **shadcn/ui**: High-quality, accessible component library built on Radix UI
- **Vite**: Lightning-fast build tool and dev server
- **TypeScript** (recommended): Type safety and better DX

### Animation Libraries

- **Framer Motion**: Production-ready animation library for React
- **Tailwind CSS Animations**: Built-in and custom utility classes
- **React Spring**: Physics-based animations
- **GSAP** (optional): Professional-grade animation platform

---

## Setup & Installation

### 1. Initialize Project with Vite + React + TypeScript

```bash
# Create new Vite project
npm create vite@latest my-theme-app -- --template react-ts
cd my-theme-app
npm install
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Will be populated dynamically from Theme Hub
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
```

### 3. Install shadcn/ui

```bash
# Install shadcn/ui CLI
npx shadcn@latest init

# Install essential components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add tooltip
```

### 4. Install Animation Libraries

```bash
# Framer Motion (recommended)
npm install framer-motion

# Or React Spring
npm install @react-spring/web

# GSAP (optional, for complex animations)
npm install gsap
```

### 5. Install Theme Hub Client

```bash
# Install fetch client for Theme Hub API
npm install axios
# or use built-in fetch
```

---

## Theme Integration

### Create Theme Context

```typescript
// src/contexts/ThemeContext.tsx
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
  tokens: ThemeTokens;
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

  // Fetch themes from Theme Hub API
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/themes');
        const data = await response.json();
        setThemes(data.themes);

        // Load saved theme or use first theme
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
```

### Apply Theme in App

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## Component Architecture

### Design System Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── features/              # Feature-specific components
│   │   ├── ThemeSelector.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   └── shared/                # Shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── ...
├── contexts/
│   └── ThemeContext.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── useAnimation.ts
│   └── ...
├── lib/
│   └── utils.ts
└── styles/
    └── globals.css
```

### Example: Theme Selector Component

```typescript
// src/components/features/ThemeSelector.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg bg-surface text-text border border-border hover:border-accent transition-colors"
      >
        Theme: {currentTheme?.name || 'Loading...'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-80 max-h-96 overflow-y-auto bg-surface border border-border rounded-lg shadow-xl z-50"
          >
            <div className="grid grid-cols-2 gap-2 p-4">
              {themes.map((theme) => (
                <motion.div
                  key={theme.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`relative p-3 rounded-lg cursor-pointer transition-all ${
                    currentTheme?.id === theme.id
                      ? 'ring-2 ring-accent'
                      : 'hover:ring-1 hover:ring-border'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${theme.tokens.primary}, ${theme.tokens.accent})`,
                  }}
                >
                  <div className="text-white font-semibold text-sm mb-1">
                    {theme.name}
                  </div>
                  <div className="flex gap-1">
                    {Object.values(theme.tokens).slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {currentTheme?.id === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                    >
                      <Check className="w-3 h-3 text-green-600" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

---

## Animation Patterns

### 1. Page Transitions

```typescript
// src/components/shared/PageTransition.tsx
import { motion } from 'framer-motion';
import React from 'react';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};
```

### 2. Staggered List Animation

```typescript
// src/components/shared/StaggeredList.tsx
import { motion } from 'framer-motion';
import React from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface StaggeredListProps {
  items: React.ReactNode[];
}

export const StaggeredList: React.FC<StaggeredListProps> = ({ items }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### 3. Hover Card Animation

```typescript
// src/components/shared/HoverCard.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-surface border border-border rounded-lg p-6 cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};
```

### 4. Loading Skeleton

```typescript
// src/components/shared/LoadingSkeleton.tsx
import { motion } from 'framer-motion';
import React from 'react';

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`bg-surface/50 rounded ${className}`}
    />
  );
};
```

---

## shadcn/ui Components

### Example: Enhanced Button Component

```typescript
// src/components/ui/animated-button.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';

interface AnimatedButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  loading?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  icon,
  loading,
  ...props
}) => {
  return (
    <Button asChild {...props}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative overflow-hidden"
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    </Button>
  );
};
```

---

## Best Practices

### 1. Performance Optimization

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* component content */}</div>;
});

// Use useMemo for expensive calculations
const sortedData = React.useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// Use useCallback for functions passed as props
const handleClick = React.useCallback(() => {
  // handler logic
}, [dependencies]);
```

### 2. Accessibility

```typescript
// Always include ARIA labels
<button aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
  {/* navigation items */}
</nav>

// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Interactive element
</div>
```

### 3. Responsive Design

```typescript
// Use Tailwind's responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Mobile-first approach
<nav className="flex flex-col md:flex-row gap-4">
  {/* navigation items */}
</nav>
```

### 4. Error Boundaries

```typescript
// src/components/shared/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 bg-surface rounded-lg border border-border">
            <h1 className="text-2xl font-bold text-text mb-4">Something went wrong</h1>
            <p className="text-text/70 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Advanced Patterns

### 1. Custom Hooks

```typescript
// src/hooks/useAnimation.ts
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useGSAPAnimation = (animationFn: (element: HTMLElement) => void) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      animationFn(elementRef.current);
    }
  }, [animationFn]);

  return elementRef;
};

// Usage
const MyComponent = () => {
  const ref = useGSAPAnimation((el) => {
    gsap.from(el, { opacity: 0, y: 50, duration: 1 });
  });

  return <div ref={ref}>Animated content</div>;
};
```

### 2. Compound Components

```typescript
// src/components/ui/tabs-compound.tsx
import React from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{ children: React.ReactNode; defaultTab: string }> = ({
  children,
  defaultTab,
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-4">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-2 border-b border-border">{children}</div>;
};

Tabs.Trigger = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('Tabs.Trigger must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={`px-4 py-2 border-b-2 transition-colors ${
        isActive ? 'border-accent text-accent' : 'border-transparent text-text/70'
      }`}
    >
      {children}
    </button>
  );
};

Tabs.Content = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('Tabs.Content must be used within Tabs');

  if (context.activeTab !== value) return null;

  return <div className="py-4">{children}</div>;
};
```

---

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

### 2. Virtual Lists

```bash
npm install @tanstack/react-virtual
```

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualList = ({ items }: { items: any[] }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Image Optimization

```typescript
// Use modern image formats with fallbacks
<picture>
  <source srcSet="image.avif" type="image/avif" />
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// Or use a library like react-lazy-load-image-component
npm install react-lazy-load-image-component
```

---

## Integration Example: Complete Dashboard

```typescript
// src/pages/Dashboard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeSelector } from '@/components/features/ThemeSelector';
import { Card } from '@/components/ui/card';
import { StaggeredList } from '@/components/shared/StaggeredList';
import { HoverCard } from '@/components/shared/HoverCard';

export const Dashboard: React.FC = () => {
  const { currentTheme } = useTheme();

  const stats = [
    { label: 'Total Themes', value: '76' },
    { label: 'Active Theme', value: currentTheme?.name || 'Loading...' },
    { label: 'Categories', value: '15+' },
    { label: 'Platforms', value: '4' },
  ];

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Theme Hub Dashboard</h1>
          <ThemeSelector />
        </div>

        {/* Stats Grid */}
        <StaggeredList
          items={stats.map((stat) => (
            <HoverCard key={stat.label}>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-text/70">{stat.label}</div>
              </div>
            </HoverCard>
          ))}
        />

        {/* Theme Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-surface border-border">
            <h2 className="text-2xl font-bold mb-4">Current Theme Preview</h2>
            <div className="grid grid-cols-6 gap-4">
              {currentTheme &&
                Object.entries(currentTheme.tokens).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-full h-16 rounded-lg mb-2 border border-border"
                      style={{ backgroundColor: value }}
                    />
                    <div className="text-sm font-mono text-text/70">{key}</div>
                    <div className="text-xs font-mono text-text/50">{value}</div>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
```

---

## Quick Reference: Component Patterns

### Button with Loading State
```typescript
<AnimatedButton loading={isLoading}>
  Submit
</AnimatedButton>
```

### Card with Hover Effect
```typescript
<HoverCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</HoverCard>
```

### Staggered List Animation
```typescript
<StaggeredList items={data.map(item => <ItemComponent key={item.id} {...item} />)} />
```

### Theme-aware Component
```typescript
const { currentTheme } = useTheme();
<div style={{ color: currentTheme?.tokens.accent }}>
  Accent colored text
</div>
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Documentation](https://react.dev)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---

## Next Steps

1. **Install dependencies** in your project
2. **Set up ThemeContext** to connect to Theme Hub API
3. **Create base components** using shadcn/ui
4. **Add animations** using Framer Motion
5. **Build features** with theme integration
6. **Optimize performance** with code splitting and lazy loading
7. **Test accessibility** with keyboard navigation and screen readers

For questions or contributions, refer to the main repository documentation.
