import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Badge } from '../components/Badge';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';
import { AccountSidebar } from '../components/profile/AccountSidebar';
import { mockOrders, mockUsers } from '../data/mockData';
import { useAuthSession } from '../auth/authSession';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { ApiError } from '../services/apiClient';
import { ProfileResponse } from '../types/api';

export function Orders() {
  const navigate = useNavigate();
  const session = useAuthSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  // Orders are still the original demo data because this backend does not expose
  // a customer order endpoint in the current project. Only the account card uses
  // the authenticated user's real profile information.
  const demoOrderUser = mockUsers[0];
  const userOrders = mockOrders.filter((order) => order.userId === demoOrderUser.id);

  useEffect(() => {
    let cancelled = false;

    profileService.getMe()
      .then((response) => {
        if (!cancelled) setProfile(response);
      })
      .catch((requestError) => {
        if (requestError instanceof ApiError && (requestError.status === 401 || requestError.status === 403)) {
          navigate('/login');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(userOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = userOrders.slice(startIndex, startIndex + itemsPerPage);

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      navigate('/login');
    }
  };

  const accountName = profile?.fullName ?? session?.fullName ?? '';

  return (
    <div className="min-h-screen bg-[#020408]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <AccountSidebar
            activeSection="orders"
            fullName={accountName}
            email={session?.email}
            imageUrl={profile?.imageUrl}
            onLogout={() => void logout()}
          />

          <main className="lg:col-span-3">
            <h1 className="text-3xl font-display text-[var(--navy)] mb-8">
              My Orders
            </h1>

            <div className="space-y-4">
              {currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[rgba(0,245,255,0.04)] rounded-none p-6 border border-[rgba(0,245,255,0.15)] shadow-[var(--shadow-card)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg text-[var(--navy)] mb-1">
                        Order {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge variant="orderStatus" status={order.status}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex gap-3 mb-4 overflow-x-auto">
                    {order.items.slice(0, 4).map((item) => (
                      <img
                        key={item.id}
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 rounded-none bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.3)] flex items-center justify-center text-sm text-[#00f5ff]">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-xl text-[var(--gold)]">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="ghost">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
