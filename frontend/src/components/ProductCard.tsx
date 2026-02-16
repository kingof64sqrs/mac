import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Added to cart!');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist!');
  };

  const discountedPrice = product.compare_at_price && product.compare_at_price > product.price
    ? product.price
    : null;
  const savings = discountedPrice
    ? ((product.compare_at_price! - product.price) / product.compare_at_price! * 100).toFixed(0)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-dark-50 mb-4">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark-300 bg-dark-100">
              <span className="font-medium">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {savings && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                -{savings}%
              </span>
            )}
            {product.inventory_quantity === 0 && (
              <span className="bg-dark-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Actions Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.inventory_quantity === 0}
              className="flex-1 bg-white text-dark-900 font-medium py-2.5 rounded-xl hover:bg-violet-600 hover:text-white shadow-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inventory_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              onClick={handleWishlist}
              className="w-10 h-10 bg-white text-dark-900 rounded-xl hover:bg-red-50 hover:text-red-500 shadow-lg transition-colors flex items-center justify-center"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-heading font-semibold text-dark-900 mb-1 leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="font-bold text-dark-900">
              ₹{product.price.toFixed(2)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-dark-400 line-through decoration-dark-400/50">
                ₹{product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
