/**
 * Theme Hub Component Library Examples
 *
 * This file contains reusable, animated components ready to copy into your project.
 * All components are integrated with Theme Hub and use Framer Motion for animations.
 *
 * Prerequisites:
 * - Framer Motion: npm install framer-motion
 * - Lucide React (icons): npm install lucide-react
 * - Theme Context set up (see docs/QUICK_START_FRONTEND.md)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Loader2, ChevronDown } from 'lucide-react';

// ============================================================================
// THEME SELECTOR COMPONENT
// ============================================================================

interface Theme {
  id: string;
  name: string;
  description: string;
  tokens: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
}

interface ThemeSelectorProps {
  themes: Theme[];
  currentTheme: Theme | null;
  onThemeChange: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-surface text-text border border-border rounded-lg hover:border-accent transition-colors"
      >
        <span className="font-medium">{currentTheme?.name || 'Select Theme'}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute mt-2 w-96 max-h-[500px] bg-surface border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              {/* Search */}
              <div className="p-4 border-b border-border">
                <input
                  type="text"
                  placeholder="Search themes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-background text-text border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 max-h-96 overflow-y-auto">
                {filteredThemes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onThemeChange(theme.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`relative p-4 rounded-lg cursor-pointer transition-all ${
                      currentTheme?.id === theme.id
                        ? 'ring-2 ring-accent'
                        : 'hover:ring-1 hover:ring-border'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.tokens.primary}, ${theme.tokens.accent})`,
                    }}
                  >
                    <div className="text-white font-semibold text-sm mb-2">
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
                  </motion.button>
                ))}
              </div>

              {filteredThemes.length === 0 && (
                <div className="p-8 text-center text-text/50">
                  No themes found matching "{searchTerm}"
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// ANIMATED CARD COMPONENT
// ============================================================================

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}
      className={`bg-surface border border-border rounded-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// STAGGERED LIST COMPONENT
// ============================================================================

interface StaggeredListProps {
  items: React.ReactNode[];
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({ items, className = '' }) => {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// ANIMATED BUTTON COMPONENT
// ============================================================================

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-surface text-text border border-border hover:border-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-text hover:bg-surface',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      disabled={disabled || loading}
      className={`
        relative px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {icon && <span>{icon}</span>}
        {children}
      </span>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </motion.button>
  );
};

// ============================================================================
// TOAST NOTIFICATION COMPONENT
// ============================================================================

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <X className="w-5 h-5 text-red-600" />,
    info: <AlertCircle className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        ${colors[type]}
      `}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ============================================================================
// TOAST CONTAINER (Usage Example)
// ============================================================================

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastProps['type'] }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// LOADING SKELETON COMPONENT
// ============================================================================

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = 'h-4 w-full',
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
          className={`bg-surface/50 rounded ${className}`}
        />
      ))}
    </>
  );
};

// ============================================================================
// MODAL COMPONENT
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-border rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-text">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-text/70 hover:text-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="p-6 border-t border-border bg-background/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

export const ExampleUsage: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [toasts, setToasts] = React.useState<Array<{ id: string; message: string; type: ToastProps['type'] }>>([]);

  const addToast = (message: string, type: ToastProps['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const cardData = [
    { title: 'Card 1', content: 'This is animated card content' },
    { title: 'Card 2', content: 'Another animated card' },
    { title: 'Card 3', content: 'One more animated card' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Buttons */}
        <div className="flex gap-4">
          <AnimatedButton variant="primary" onClick={() => addToast('Success!', 'success')}>
            Primary Button
          </AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => setShowModal(true)}>
            Open Modal
          </AnimatedButton>
          <AnimatedButton variant="danger" onClick={() => addToast('Error!', 'error')}>
            Danger Button
          </AnimatedButton>
          <AnimatedButton loading>Loading...</AnimatedButton>
        </div>

        {/* Staggered Cards */}
        <StaggeredList
          items={cardData.map((card, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <h3 className="text-xl font-bold text-text mb-2">{card.title}</h3>
              <p className="text-text/70">{card.content}</p>
            </AnimatedCard>
          ))}
        />

        {/* Loading Skeletons */}
        <div className="space-y-2">
          <LoadingSkeleton count={3} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        footer={
          <div className="flex justify-end gap-2">
            <AnimatedButton variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </AnimatedButton>
            <AnimatedButton variant="primary" onClick={() => setShowModal(false)}>
              Confirm
            </AnimatedButton>
          </div>
        }
      >
        <p className="text-text">
          This is an example modal with animations. You can put any content here!
        </p>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
