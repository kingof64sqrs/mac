import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { productsAPI, sectionsAPI } from '../services/api';
import { Product, Section } from '../types';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, sectionsRes] = await Promise.all([
        productsAPI.getFeatured({ page_size: 8 }),
        sectionsAPI.getAll({ is_active: true, page_size: 50 }),
      ]);
      setFeaturedProducts(productsRes.data.data || []);
      setSections(sectionsRes.data.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-50">
        <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-dark-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient / Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-dark-950 to-indigo-950 z-0" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />

        {/* Animated Blobs */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"
        />

        <div className="container-custom relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-violet-200 text-sm font-medium mb-6">
              New Collection 2024
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight font-heading leading-tight">
              Redefine Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Aesthetic
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover a curated selection of premium products designed to elevate your lifestyle. Quality meets modern design.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-white text-dark-900 rounded-full font-bold hover:bg-violet-50 transition-all duration-300 hover:scale-105 shadow-lg shadow-white/10 flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/shop?sort=newest"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              >
                New Arrivals
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      {sections.length > 0 && (
        <section className="py-24 container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-2 font-heading">
                Shop by Category
              </h2>
              <p className="text-dark-500">Explore our wide range of collections</p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center text-violet-600 font-medium hover:text-violet-700 transition-colors"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sections.slice(0, 4).map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?section=${section.id}`}
                  className="group block relative overflow-hidden rounded-2xl aspect-[4/5] bg-dark-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent z-10" />
                  {/* Placeholder pattern since we might not have images for sections */}
                  <div className="absolute inset-0 bg-dark-200 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <Star className="w-16 h-16 text-dark-300 opacity-20" />
                  </div>

                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors flex items-center justify-between">
                      {section.name}
                      <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-violet-600 font-semibold tracking-wider text-sm uppercase mb-2 block">
                Editor's Pick
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4 font-heading">
                Featured Products
              </h2>
              <p className="text-dark-500">
                Handpicked items that are trending now.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-3 border border-dark-200 rounded-full text-dark-900 font-medium hover:bg-dark-900 hover:text-white transition-all duration-300"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-dark-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                desc: 'On all orders over ₹500'
              },
              {
                icon: ShieldCheck,
                title: 'Secure Payment',
                desc: '100% secure payment'
              },
              {
                icon: RefreshCw,
                title: 'Easy Returns',
                desc: '30 day return policy'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-dark-100 text-center"
              >
                <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">{feature.title}</h3>
                <p className="text-dark-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 container-custom">
        <div className="bg-violet-900 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-violet-500 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-30" />

          <div className="relative z-10 px-8 py-16 md:py-20 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
              Join Our Community
            </h2>
            <p className="text-violet-100 mb-8 text-lg">
              Subscribe to our newsletter and get 10% off your first purchase.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-violet-200 focus:outline-none focus:bg-white/20 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-white text-violet-900 font-bold rounded-xl hover:bg-violet-50 transition-colors duration-300 shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
