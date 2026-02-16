import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, ShieldCheck, Truck, CheckCircle } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { ordersAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    billingAddress: '',
    notes: '',
  });

  const total = getTotal();
  const tax = total * 0.18; // 18% GST
  const shipping = total > 500 ? 0 : 40; // Free shipping above ₹500
  const grandTotal = total + tax + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        shipping_address: formData.shippingAddress,
        billing_address: formData.billingAddress || formData.shippingAddress,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: total,
        tax,
        shipping,
        total: grandTotal,
        status: 'pending',
        notes: formData.notes,
      };

      const response = await ordersAPI.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-dark-50 min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 font-heading text-dark-900">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Customer Info Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">1</div>
                  <h2 className="font-bold text-xl font-heading">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-dark-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-dark-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5 text-dark-700">Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">2</div>
                  <h2 className="font-bold text-xl font-heading">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Street address, City, State, ZIP"
                    className="input-field resize-none"
                  />
                </div>
              </div>

              {/* Billing - Optional separation */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">3</div>
                  <h2 className="font-bold text-xl font-heading">Billing Address</h2>
                </div>
                <textarea
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Same as shipping address"
                  className="input-field resize-none"
                />
              </div>

              {/* Order Notes */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark-100">
                <h2 className="font-bold text-lg font-heading mb-4">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any special instructions for delivery?"
                  className="input-field resize-none"
                />
              </div>

              {/* Payment Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">4</div>
                  <h2 className="font-bold text-xl font-heading">Payment</h2>
                </div>

                <div className="bg-gradient-to-br from-dark-50 to-white border border-dark-200 rounded-xl p-6">
                  <div className="flex items-center text-dark-600 mb-4">
                    <Lock className="h-5 w-5 mr-3 text-green-600" />
                    <span className="font-medium">Secure SSL Encrypted Transaction</span>
                  </div>
                  <div className="flex gap-3 mb-6">
                    {/* Fake payment methods */}
                    <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
                    <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">MC</div>
                    <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">AMEX</div>
                  </div>
                  <p className="text-sm text-dark-500">
                    This is a demo store. No actual payment will be processed.
                  </p>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg shadow-xl shadow-violet-500/20">
                {loading ? 'Processing Order...' : `Pay $₹{grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark-100 sticky top-24">
              <h2 className="font-bold text-lg mb-4 font-heading">Order Summary</h2>

              <div className="mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 mb-4 last:mb-0">
                    <div className="w-16 h-16 bg-dark-50 rounded-lg overflow-hidden flex-shrink-0 border border-dark-100">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-dark-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-dark-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-violet-600 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-100 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-600">Subtotal</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-600">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$₹{shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-dark-100 pt-4">
                <div className="flex justify-between text-xl font-bold text-dark-900">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <Truck className="h-4 w-4 text-violet-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Satisfaction Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
