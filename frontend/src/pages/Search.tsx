import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await productsAPI.search(searchQuery);
      setProducts(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  return (
    <div className="bg-dark-50 min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 font-heading text-dark-900">Search Products</h1>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-12 max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-dark-200 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-lg shadow-sm transition-all"
            />
            <SearchIcon className="absolute left-5 top-5 h-6 w-6 text-dark-400" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-2.5 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
            </button>
          </div>
        </form>

        {/* Search Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          </div>
        ) : searched ? (
          <>
            <div className="mb-8 text-center">
              <p className="text-dark-600 text-lg">
                {products.length > 0
                  ? `Found ${products.length} result${products.length !== 1 ? 's' : ''} for "${searchParams.get('q')}"`
                  : `No results found for "${searchParams.get('q')}"`}
              </p>
            </div>

            {products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="h-10 w-10 text-dark-400" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">No matching products</h3>
                <p className="text-dark-500">Try checking your spelling or use different keywords.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="h-10 w-10 text-violet-300" />
            </div>
            <h2 className="text-2xl font-bold text-dark-900 mb-2">What are you looking for?</h2>
            <p className="text-dark-500 max-w-md mx-auto">
              Search for products, categories, or brands to find exactly what you need.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
