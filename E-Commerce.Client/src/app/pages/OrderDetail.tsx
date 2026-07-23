import { useParams, Link } from 'react-router';
import { Check } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { mockOrders } from '../data/mockData';
import type { OrderStatus } from '../data/mockData';

export function OrderDetail() {
  const { id } = useParams();
  const order = mockOrders.find((o) => o.id === Number(id));

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        Order not found
      </div>
    );
  }

  const statusSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
  const currentStatusIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#020408]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/orders" className="hover:text-[var(--gold)]">
          My Orders
        </Link>
        <span>/</span>
        <span className="text-[var(--navy)]">Order {order.orderNumber}</span>
      </div>

      {/* Status Timeline */}
      <Card className="mb-8">
        <h2 className="text-2xl font-display text-[var(--navy)] mb-6">
          Order Status
        </h2>
        <div className="flex items-center justify-between">
          {statusSteps.map((status, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div key={status} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isActive
                        ? 'bg-[var(--gold)] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isActive && <Check size={20} />}
                  </div>
                  <span className={`text-sm text-center ${
                    isCurrent ? 'text-[var(--gold)]' : isActive ? 'text-[var(--navy)]' : 'text-muted-foreground'
                  }`}>
                    {status}
                  </span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 transition-colors ${
                      index < currentStatusIndex ? 'bg-[var(--gold)]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg mb-4">Order Information</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Order Number:</dt>
              <dd className="text-[var(--navy)]">{order.orderNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Order Date:</dt>
              <dd className="text-[var(--navy)]">
                {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Status:</dt>
              <dd>
                <Badge variant="orderStatus" status={order.status}>
                  {order.status}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Payment Method:</dt>
              <dd className="text-[var(--navy)]">Credit Card</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="text-lg mb-4">Shipping Address</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {order.shippingAddress}
          </p>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <h3 className="text-lg mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[var(--border)]">
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">Product</th>
                <th className="pb-3">Unit Price</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)]">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <span className="text-sm text-[var(--navy)]">
                        {item.productName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-700">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-4 text-sm text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-sm text-[var(--gold)] text-right">
                    ${item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Total */}
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-[var(--navy)]">
                  ${order.items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-[var(--navy)]">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="text-[var(--navy)]">
                  ${(order.totalAmount * 0.08 / 1.08).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-[var(--border)]">
                <span>Total:</span>
                <span className="text-[var(--gold)]">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
