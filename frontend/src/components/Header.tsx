import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';
import { sectionsAPI, siteConfigAPI } from '../services/api';
import { Section, SiteConfig } from '../types';
import { clsx } from 'clsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    loadSections();
    loadSiteConfig();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const loadSections = async () => {
    try {
      const response = await sectionsAPI.getAll({ is_active: true, page_size: 50 });
      setSections(response.data.data || []);
    } catch (error) {
      console.error('Failed to load sections:', error);
    }
  };

  const loadSiteConfig = async () => {
    try {
      const response = await siteConfigAPI.get();
      setSiteConfig(response.data);
    } catch (error) {
      console.error('Failed to load site config:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement Banner */}
      <AnimatePresence>
        {siteConfig?.banner_enabled && siteConfig?.banner_text && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              backgroundColor: siteConfig.banner_color || '#7c3aed',
              color: 'white'
            }}
            className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
          >
            <div className="container-custom">
              <div className="flex items-center justify-center py-2.5 px-4">
                {siteConfig.banner_link ? (
                  <Link
                    to={siteConfig.banner_link}
                    className="text-sm font-medium hover:underline underline-offset-2 transition-all text-center"
                  >
                    {siteConfig.banner_text}
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-center">
                    {siteConfig.banner_text}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={clsx(
          "fixed left-0 right-0 z-50 transition-all duration-300 border-b",
          siteConfig?.banner_enabled && siteConfig?.banner_text ? "top-[42px]" : "top-0",
          scrolled
            ? "glass-panel border-white/20 py-3"
            : "bg-white/50 backdrop-blur-sm border-transparent py-5"
        )}
      >
        <div className="container-custom">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="relative z-50 flex items-center gap-2 group">
              {siteConfig?.logo_url ? (
                <img
                  src={siteConfig.logo_url}
                  alt={siteConfig.company_name}
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {(siteConfig?.company_name || 'S').charAt(0)}
                  </div>
                  <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-dark-900 to-dark-600">
                    {siteConfig?.company_name || 'Store'}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm font-medium text-dark-600 hover:text-violet-600 transition-colors relative group py-2"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-300 group-hover:w-full opacity-50" />
              </Link>
              <Link
                to="/shop"
                className="text-sm font-medium text-dark-600 hover:text-violet-600 transition-colors relative group py-2"
              >
                Shop
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-300 group-hover:w-full opacity-50" />
              </Link>
              {sections.slice(0, 4).map((section) => (
                <Link
                  key={section.id}
                  to={`/shop?section=${section.id}`}
                  className="text-sm font-medium text-dark-600 hover:text-violet-600 transition-colors relative group py-2"
                >
                  {section.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-300 group-hover:w-full opacity-50" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 relative z-50">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full text-dark-600 hover:bg-dark-100/50 hover:text-violet-600 transition-all duration-300"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link to="/wishlist" className="hidden md:flex p-2.5 rounded-full text-dark-600 hover:bg-dark-100/50 hover:text-red-500 transition-all duration-300">
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-dark-600 hover:bg-dark-100/50 hover:text-violet-600 transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 bg-violet-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button className="hidden md:flex p-2.5 rounded-full text-dark-600 hover:bg-dark-100/50 hover:text-violet-600 transition-all duration-300">
                <User className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 rounded-full text-dark-600 hover:bg-dark-100/50 hover:text-violet-600 transition-all duration-300"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-dark-100 bg-white/95 backdrop-blur-md"
            >
              <div className="container-custom py-4">
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-dark-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-dark-400" />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-2.5 p-1 text-dark-400 hover:text-dark-600 rounded-md hover:bg-dark-100"
                  >
                    <span className="text-xs font-medium px-1">ESC</span>
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-dark-100 shadow-xl md:hidden max-h-[80vh] overflow-y-auto"
            >
              <nav className="p-4 space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-3 rounded-lg text-dark-600 hover:bg-violet-50 hover:text-violet-600 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="block px-4 py-3 rounded-lg text-dark-600 hover:bg-violet-50 hover:text-violet-600 font-medium transition-colors"
                >
                  Shop
                </Link>
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    to={`/shop?section=${section.id}`}
                    className="block px-4 py-3 rounded-lg text-dark-600 hover:bg-violet-50 hover:text-violet-600 font-medium transition-colors"
                  >
                    {section.name}
                  </Link>
                ))}
                <div className="border-t border-dark-100 my-2 pt-2">
                  <Link
                    to="/wishlist"
                    className="flex items-center px-4 py-3 rounded-lg text-dark-600 hover:bg-violet-50 hover:text-violet-600 font-medium transition-colors"
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    Wishlist
                  </Link>
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-3 rounded-lg text-dark-600 hover:bg-violet-50 hover:text-violet-600 font-medium transition-colors"
                  >
                    <User className="h-5 w-5 mr-3" />
                    My Account
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className={clsx(
        siteConfig?.banner_enabled && siteConfig?.banner_text ? "h-[138px]" : "h-24"
      )} />
    </>
  );
};

export default Header;
