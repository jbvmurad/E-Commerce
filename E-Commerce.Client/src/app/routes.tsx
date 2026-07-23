import { createBrowserRouter, redirect } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ConfirmEmail } from './pages/ConfirmEmail';
import { ConfirmEmailChange } from './pages/ConfirmEmailChange';

// Panel layouts
import { AdminDashboardLayout } from './components/dashboard/AdminDashboardLayout';
import { SellerDashboardLayout } from './components/dashboard/SellerDashboardLayout';

// Admin panel pages
import { AdminDashboardHome } from './pages/panel/admin/AdminDashboardHome';
import { AdminOrders } from './pages/panel/admin/AdminOrders';
import { AdminProductsPage } from './pages/panel/admin/AdminProducts';
import { AdminCustomers } from './pages/panel/admin/AdminCustomers';
import { AdminAuthorization } from './pages/panel/admin/AdminAuthorization';
import { AdminCategories } from './pages/panel/admin/AdminCategories';
import { AdminCampaigns } from './pages/panel/admin/AdminCampaigns';
import { AdminReports } from './pages/panel/admin/AdminReports';
import { AdminLanguages } from './pages/panel/admin/AdminLanguages';

// Seller panel pages
import { SellerDashboardHome } from './pages/panel/seller/SellerDashboardHome';
import { SellerOrders } from './pages/panel/seller/SellerOrders';
import { SellerProducts } from './pages/panel/seller/SellerProducts';
import { SellerCampaigns } from './pages/panel/seller/SellerCampaigns';
import { SellerReports } from './pages/panel/seller/SellerReports';
import { SellerAiAssistant } from './pages/panel/seller/SellerAiAssistant';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'products', Component: ProductListing },
      { path: 'products/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'orders', Component: Orders },
      { path: 'orders/:id', Component: OrderDetail },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'reset-password', Component: ResetPassword },
      { path: 'confirm-email', Component: ConfirmEmail },
      { path: 'verify-email', Component: ConfirmEmail },
      { path: 'confirm-email-change', Component: ConfirmEmailChange },
      { path: 'change-email', Component: ConfirmEmailChange },
      { path: 'profile', Component: Profile },
    ],
  },
  { path: '/admin', loader: () => redirect('/panel/admin') },
  { path: '/admin/*', loader: () => redirect('/panel/admin') },
  {
    path: '/panel/admin',
    Component: AdminDashboardLayout,
    children: [
      { index: true,            Component: AdminDashboardHome },
      { path: 'orders',         Component: AdminOrders        },
      { path: 'products',       Component: AdminProductsPage  },
      { path: 'customers',      Component: AdminCustomers     },
      { path: 'authorization',  Component: AdminAuthorization },
      { path: 'categories',     Component: AdminCategories    },
      { path: 'campaigns',      Component: AdminCampaigns     },
      { path: 'reports',        Component: AdminReports       },
      { path: 'languages',      Component: AdminLanguages     },
    ],
  },
  {
    path: '/panel/seller',
    Component: SellerDashboardLayout,
    children: [
      { index: true,       Component: SellerDashboardHome },
      { path: 'orders',    Component: SellerOrders        },
      { path: 'products',  Component: SellerProducts      },
      { path: 'campaigns', Component: SellerCampaigns     },
      { path: 'reports',   Component: SellerReports       },
      { path: 'ai-assistant', Component: SellerAiAssistant },
    ],
  },
]);
