import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { mockCart } from '../data/mockData';
import { useNavigate } from 'react-router';

type Step = 1 | 2 | 3;

export function Checkout() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const navigate = useNavigate();

  const subtotal = mockCart.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    } else {
      // Place order
      navigate('/orders');
    }
  };

  const steps = [
    { number: 1, title: 'Shipping' },
    { number: 2, title: 'Review' },
    { number: 3, title: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-[#020408]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.number
                      ? 'bg-[var(--gold)] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.number ? <Check size={20} /> : step.number}
                </div>
                <span className="text-sm mt-2">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 transition-colors ${
                    currentStep > step.number ? 'bg-[var(--gold)]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <Card>
              <h2 className="text-2xl font-display text-[var(--navy)] mb-6">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Shipping Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                </div>
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
                <Input
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <h2 className="text-2xl font-display text-[var(--navy)] mb-6">
                Review Your Order
              </h2>
              <div className="mb-6">
                <h3 className="text-lg mb-3">Shipping Address</h3>
                <div className="bg-[rgba(0,245,255,0.04)] border border-[rgba(0,245,255,0.15)] p-4 rounded-none text-sm text-muted-foreground">
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                  <p className="mt-2">{formData.address}</p>
                  <p>{formData.city}, {formData.postalCode}</p>
                  <p>{formData.country}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg mb-3">Order Items</h3>
                <div className="space-y-3">
                  {mockCart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-[rgba(0,245,255,0.04)] border border-[rgba(0,245,255,0.15)] rounded-none">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-[var(--navy)]">{item.productName}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-[var(--gold)]">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-display text-[var(--navy)] mb-2">
                Order Confirmed!
              </h2>
              <p className="text-gray-600 mb-2">
                Your order has been placed successfully
              </p>
              <p className="text-lg mb-8">
                Order Number: <span className="text-[var(--gold)]">#ORD-2024-005</span>
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={() => navigate('/orders')}>
                  View Order
                </Button>
                <Button variant="ghost" onClick={() => navigate('/products')}>
                  Continue Shopping
                </Button>
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="flex gap-4 mt-6">
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep((currentStep - 1) as Step)}
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleNextStep}
                className="ml-auto"
              >
                {currentStep === 2 ? 'Place Order' : 'Continue'}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h3 className="text-lg font-display text-[var(--navy)] mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 mb-4">
              {mockCart.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-[var(--navy)]">{item.productName}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-[var(--gold)]">
                    ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border)] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-2 flex justify-between">
                <span>Total</span>
                <span className="text-lg text-[var(--gold)]">${total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
