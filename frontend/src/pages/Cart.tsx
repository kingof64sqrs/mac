import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-dark-50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag className="h-10 w-10 text-violet-300" />
        </div>
        <h2 className="text-3xl font-bold mb-4 font-heading text-dark-900">Your cart is empty</h2>
        <p className="text-dark-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our products to find something you like.
        </p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const total = getTotal();
  const tax = total * 0.18; // 18% GST
  const shipping = total > 500 ? 0 : 40; // Free shipping above ₹500
  const grandTotal = total + tax + shipping;

  return (
    <div className="bg-dark-50 min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 font-heading text-dark-900">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-dark-100 flex gap-4 sm:gap-6"
              >
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-dark-50 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-300 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-bold text-lg text-dark-900 hover:text-violet-600 transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-dark-500 mt-1">₹{item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-dark-50 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-md text-dark-600 shadow-sm transition-all"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-dark-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.inventory_quantity}
                        className="p-1.5 hover:bg-white rounded-md text-dark-600 shadow-sm transition-all disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-bold text-lg text-violet-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark-100 sticky top-24">
              <h2 className="font-bold text-xl mb-6 font-heading">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Tax</span>
                  <span className="font-medium text-dark-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Shipping</span>
                  <span className="font-medium text-dark-900">
                    {shipping === 0 ? 'FREE' : `$₹{shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-violet-600 bg-violet-50 p-2 rounded-lg text-center">
                    Add ${(50 - total).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-dark-100 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-dark-900">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full btn-primary flex items-center justify-center py-4 text-base">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>

              <Link
                to="/shop"
                className="block w-full text-center mt-4 text-dark-500 hover:text-violet-600 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
