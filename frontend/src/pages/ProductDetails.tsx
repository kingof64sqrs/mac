import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      const response = await productsAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.inventory_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-50">
        <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4 font-heading text-dark-900">Product Not Found</h2>
        <Link to="/shop" className="btn-primary">
          Return to Shop
        </Link>
      </div>
    );
  }

  const savings = product.compare_at_price && product.compare_at_price > product.price
    ? ((product.compare_at_price - product.price) / product.compare_at_price * 100).toFixed(0)
    : null;

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="container-custom py-8">
        <Link
          to="/shop"
          className="inline-flex items-center text-dark-500 hover:text-violet-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[4/5] bg-dark-50 rounded-3xl overflow-hidden relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-300">
                  No Image Available
                </div>
              )}

              {savings && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-xl">
                  Save {savings}%
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold font-heading text-dark-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-4 mb-6">
                <span className="text-4xl font-bold text-violet-600">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-xl text-dark-400 line-through mb-1">
                    ₹{product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>

              {product.inventory_quantity > 0 ? (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit text-sm font-medium mb-8">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  In Stock ({product.inventory_quantity} available)
                </div>
              ) : (
                <div className="flex items-center text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit text-sm font-medium mb-8">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  Out of Stock
                </div>
              )}

              {product.description && (
                <div className="prose prose-lg text-dark-600 mb-8 max-w-none">
                  <p>{product.description}</p>
                </div>
              )}

              <div className="border-t border-b border-dark-100 py-8 space-y-6">
                {/* Quantity Selector */}
                {product.inventory_quantity > 0 && (
                  <div>
                    <label className="block font-bold text-dark-900 mb-3">Quantity</label>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center border border-dark-200 rounded-xl p-1">
                        <button
                          onClick={decrementQuantity}
                          className="p-3 hover:bg-dark-50 rounded-lg text-dark-500 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-bold w-12 text-center text-dark-900">{quantity}</span>
                        <button
                          onClick={incrementQuantity}
                          className="p-3 hover:bg-dark-50 rounded-lg text-dark-500 transition-colors"
                          disabled={quantity >= product.inventory_quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inventory_quantity === 0}
                  className="flex-1 btn-primary py-4 text-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inventory_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => toast.success('Added to wishlist!')}
                  className="p-4 rounded-xl border border-dark-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                >
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center text-sm text-dark-500 bg-dark-50 p-4 rounded-xl">
                  <Truck className="h-5 w-5 mr-3 text-violet-600" />
                  Free shipping over ₹500
                </div>
                <div className="flex items-center text-sm text-dark-500 bg-dark-50 p-4 rounded-xl">
                  <ShieldCheck className="h-5 w-5 mr-3 text-violet-600" />
                  2-year warranty
                </div>
              </div>

              {/* Attributes */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="mt-8 pt-8 border-t border-dark-100">
                  <h3 className="font-bold text-lg mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="bg-white border border-dark-100 p-4 rounded-lg">
                        <dt className="text-dark-500 text-sm capitalize mb-1">{key}</dt>
                        <dd className="font-semibold text-dark-900">{String(value)}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
