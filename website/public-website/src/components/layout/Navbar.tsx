import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ExternalLink } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import ThemeToggle from '../common/ThemeToggle';

const navLinks = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/packages', label: 'Tour Packages' },
  { href: '/car-booking', label: 'Car & Rentals' },
  { href: '/#overview', label: 'Ecosystem' },
  { href: '/partner', label: 'Partner With Us' },
  { href: '/about', label: 'About Us' },
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container flex items-center justify-between">
          {/* Logo Left */}
          <Link to="/" className="flex items-center gap-2 group">
            <BrandLogo className="h-8 md:h-9 w-auto" />
          </Link>

          {/* Navigation Center */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            <a
              href="https://app.apnatrip.in/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition-colors"
            >
              Sign In
            </a>

            <a
              href="https://app.apnatrip.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-4.5 rounded-lg"
            >
              <span>Open App</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 shadow-xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-base font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <a
                  href="https://app.apnatrip.in/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign In
                </a>
                <a
                  href="https://app.apnatrip.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center py-2.5 text-sm rounded-lg"
                >
                  <span>Open App</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
