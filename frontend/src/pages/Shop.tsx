import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI, categoriesAPI, sectionsAPI } from '../services/api';
import { Product, Category, Section } from '../types';
import ProductCard from '../components/ProductCard';
import { clsx } from 'clsx';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const selectedSection = searchParams.get('section');
  const selectedCategory = searchParams.get('category');
  const sortOption = searchParams.get('sort') || 'default';

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      loadCategoriesBySection(selectedSection);
    } else {
      loadCategories();
    }
  }, [selectedSection]);

  useEffect(() => {
    loadProducts();
  }, [selectedSection, selectedCategory, page, sortOption]);

  const loadSections = async () => {
    try {
      const response = await sectionsAPI.getAll({ is_active: true, page_size: 50 });
      setSections(response.data.data || []);
    } catch (error) {
      console.error('Failed to load sections:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ is_active: true, page_size: 100 });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadCategoriesBySection = async (sectionId: string) => {
    try {
      const response = await categoriesAPI.getBySection(sectionId, {
        is_active: true,
        page_size: 100,
      });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Logic for fetching based heavily on your backend API structure
      // For this UI demo, we'll assume the API calls work as before
      let response;
      const params = {
        is_active: true,
        page,
        page_size: 12,
        // sort: sortOption // If API supports sorting
      };

      if (selectedCategory) {
        response = await productsAPI.getByCategory(selectedCategory, params);
      } else if (selectedSection) {
        response = await productsAPI.getBySection(selectedSection, params);
      } else {
        response = await productsAPI.getAll(params);
      }
      setProducts(response.data.data || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    const newParams = new URLSearchParams();
    if (sectionId) {
      newParams.set('section', sectionId);
    }
    setSearchParams(newParams);
    setPage(1);
    setShowFilters(false);
  };

  const handleCategoryChange = (categoryId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    setPage(1);
    setShowFilters(false);
  };

  return (
    <div className="bg-dark-50 min-h-screen pt-8 pb-20">
      <div className="container-custom">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-dark-900">
              {selectedSection
                ? sections.find(s => s.id === selectedSection)?.name || 'Collection'
                : 'All Products'}
            </h1>
            <p className="text-dark-500 mt-1">
              Showing {products.length} results
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <div className="relative group">
              {/* Sort dropdown could go here */}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-bold text-dark-900 mb-4">Sections</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleSectionChange('')}
                  className={clsx(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    !selectedSection
                      ? "bg-violet-50 text-violet-700 font-medium"
                      : "text-dark-600 hover:bg-dark-100"
                  )}
                >
                  All Sections
                </button>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedSection === section.id
                        ? "bg-violet-50 text-violet-700 font-medium"
                        : "text-dark-600 hover:bg-dark-100"
                    )}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </div>

            {categories.length > 0 && (
              <div>
                <h3 className="font-bold text-dark-900 mb-4">Categories</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group",
                      !selectedCategory
                        ? "text-violet-700 font-medium"
                        : "text-dark-600 hover:text-dark-900"
                    )}
                  >
                    All Categories
                    {!selectedCategory && <Check className="h-4 w-4" />}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group",
                        selectedCategory === category.id
                          ? "text-violet-700 font-medium"
                          : "text-dark-600 hover:text-dark-900"
                      )}
                    >
                      {category.name}
                      {selectedCategory === category.id && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-black/50 z-[60] md:hidden"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 z-[70] w-80 bg-white shadow-2xl p-6 md:hidden overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-dark-100 rounded-full">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Copy of filters logic for mobile */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-dark-900 mb-4">Sections</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 p-2 rounded-lg active:bg-dark-50">
                          <input
                            type="radio"
                            checked={!selectedSection}
                            onChange={() => handleSectionChange('')}
                            className="text-violet-600 focus:ring-violet-500"
                          />
                          <span>All Sections</span>
                        </label>
                        {sections.map((section) => (
                          <label key={section.id} className="flex items-center space-x-3 p-2 rounded-lg active:bg-dark-50">
                            <input
                              type="radio"
                              checked={selectedSection === section.id}
                              onChange={() => handleSectionChange(section.id)}
                              className="text-violet-600 focus:ring-violet-500"
                            />
                            <span>{section.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Categories mobile... */}
                    {categories.length > 0 && (
                      <div>
                        <h3 className="font-bold text-dark-900 mb-4">Categories</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3 p-2 rounded-lg active:bg-dark-50">
                            <input
                              type="radio"
                              checked={!selectedCategory}
                              onChange={() => handleCategoryChange('')}
                              className="text-violet-600 focus:ring-violet-500"
                            />
                            <span>All Categories</span>
                          </label>
                          {categories.map((category) => (
                            <label key={category.id} className="flex items-center space-x-3 p-2 rounded-lg active:bg-dark-50">
                              <input
                                type="radio"
                                checked={selectedCategory === category.id}
                                onChange={() => handleCategoryChange(category.id)}
                                className="text-violet-600 focus:ring-violet-500"
                              />
                              <span>{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-dark-200 rounded-2xl mb-4" />
                    <div className="h-4 bg-dark-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-dark-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-dark-200">
                <div className="w-16 h-16 bg-dark-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-dark-300" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">No products found</h3>
                <p className="text-dark-500">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={() => {
                    handleSectionChange('');
                    handleCategoryChange('');
                  }}
                  className="mt-6 btn-outline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-16 space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border border-dark-200 rounded-lg hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-1 px-4">
                      <span className="text-dark-600">Page</span>
                      <span className="font-bold text-dark-900">{page}</span>
                      <span className="text-dark-600">of</span>
                      <span className="font-medium text-dark-900">{totalPages}</span>
                    </div>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-dark-200 rounded-lg hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
