import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { siteConfigAPI } from '../services/api';
import { SiteConfig } from '../types';

const Footer = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    loadSiteConfig();
  }, []);

  const loadSiteConfig = async () => {
    try {
      const response = await siteConfigAPI.get();
      setSiteConfig(response.data);
    } catch (error) {
      console.error('Failed to load site config:', error);
    }
  };

  return (
    <footer className="bg-dark-950 text-dark-300 border-t border-dark-800">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-heading text-white">
                {siteConfig?.company_name || 'Store'}
              </h3>
              <p className="mt-4 text-dark-400 leading-relaxed">
                {siteConfig?.tagline || 'Elevating your lifestyle with curated premium products for the modern aesthetic.'}
              </p>
            </div>

            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-dark-900 flex items-center justify-center text-dark-400 hover:bg-violet-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-heading">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', path: '/shop' },
                { label: 'New Arrivals', path: '/shop?sort=newest' },
                { label: 'Best Sellers', path: '/shop?sort=best_selling' },
                { label: 'Featured', path: '/shop?sort=featured' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-dark-400 hover:text-violet-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-700 group-hover:bg-violet-400 mr-3 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-heading">Support</h3>
            <ul className="space-y-3">
              {[
                'Shipping Policy',
                'Return Policy',
                'Privacy Policy',
                'Terms of Service',
                'FAQ'
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-6 font-heading">Stay Updated</h3>
            <p className="text-dark-400 mb-4 text-sm">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-800 rounded-lg focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 text-white placeholder-dark-500 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-8 space-y-2">
              {siteConfig?.address && (
                <p className="text-sm text-dark-500">{siteConfig.address}</p>
              )}
              {siteConfig?.contact_email && (
                <a href={`mailto:${siteConfig.contact_email}`} className="block text-sm text-dark-500 hover:text-violet-400 transition-colors">
                  {siteConfig.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-dark-500">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig?.company_name || 'Store'}. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Made with love</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
