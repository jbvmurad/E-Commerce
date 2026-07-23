import { useState } from 'react';
import { Link } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { mockCart } from '../data/mockData';
import type { CartItem } from '../data/mockData';

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCart);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: newQuantity, totalPrice: item.unitPrice * newQuantity }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-display text-[var(--navy)] mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products yet
          </p>
          <Link to="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display text-[var(--navy)] mb-2">
        Your Cart
      </h1>
      <p className="text-gray-600 mb-8">
        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="text-base text-[var(--navy)] mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">{item.categoryName}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 border border-[rgba(0,245,255,0.3)] rounded-none hover:bg-[rgba(0,245,255,0.1)] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 border border-[rgba(0,245,255,0.3)] rounded-none hover:bg-[rgba(0,245,255,0.1)] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        ${item.unitPrice.toFixed(2)} each
                      </p>
                      <p className="text-lg text-[var(--gold)]">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-display text-[var(--navy)] mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3 flex justify-between text-lg">
                <span>Total</span>
                <span className="text-[var(--gold)]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button variant="primary" fullWidth className="mb-3">
                Proceed to Checkout
              </Button>
            </Link>

            <Link to="/products">
              <Button variant="ghost" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
