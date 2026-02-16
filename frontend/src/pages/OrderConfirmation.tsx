import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { Order } from '../types';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    try {
      const response = await ordersAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <Link to="/shop" className="text-primary-600 hover:text-primary-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase.</p>
      </div>

      {/* Order Details */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-sm text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center text-primary-600">
            <Package className="h-5 w-5 mr-2" />
            <span className="font-medium capitalize">{order.status}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{order.customer_name}</p>
            <p>{order.customer_email}</p>
            {order.customer_phone && <p>{order.customer_phone}</p>}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST</span>
              <span className="font-medium">₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {order.shipping === 0 ? 'FREE' : `₹₹{order.shipping.toFixed(2)}`}
              </span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-2">Order Notes</h3>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Confirmation Email Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          A confirmation email has been sent to <strong>{order.customer_email}</strong>
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/shop" className="flex-1 btn-primary text-center">
          Continue Shopping
        </Link>
        <Link to="/" className="flex-1 btn-outline text-center">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
