import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  Home,
  MapPin,
  Compass,
  Car,
  Layers,
  Briefcase,
  Info,
  MessageSquare,
  Tag,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import ThemeToggle from '../common/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/destinations', label: 'Destinations', icon: MapPin },
  { href: '/packages', label: 'Travel Experiences', icon: Compass },
  { href: '/car-booking', label: 'Car & Rentals', icon: Car },
  { href: '/#overview', label: 'Ecosystem', icon: Layers },
  { href: '/partner', label: 'Partner With Us', icon: Briefcase },
  { href: '/pricing', label: 'Pricing', icon: Tag },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 shadow-xs py-2.5'
            : 'bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-b border-transparent py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo Left */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <BrandLogo className="h-8 md:h-8.5 w-auto" />
          </Link>

          {/* Navigation Center: Floating Segmented Pill */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 p-1 rounded-full bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3 py-1.5 text-[13px] 2xl:text-sm font-medium tracking-tight rounded-full transition-all duration-150 whitespace-nowrap select-none ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-white dark:bg-slate-800 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <ThemeToggle />

            <a
              href="https://app.apnatrip.in/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs 2xl:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition-colors whitespace-nowrap"
            >
              Sign In
            </a>

            <a
              href="https://app.apnatrip.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs 2xl:text-sm font-semibold shadow-xs shadow-blue-600/20 active:scale-95 transition-all duration-150 whitespace-nowrap"
            >
              <span>View Site</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile / Tablet Controls (< xl) */}
          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />
            <a
              href="https://app.apnatrip.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-xs whitespace-nowrap"
            >
              <span>View Site</span>
              <ArrowRight size={13} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-slate-950/40 backdrop-blur-xs xl:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-x-0 top-16 z-50 xl:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="flex flex-col gap-1.5 max-w-lg mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-3">
                  Navigation
                </span>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-4 mt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
                  <a
                    href="https://app.apnatrip.in/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="https://app.apnatrip.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>View Site</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
