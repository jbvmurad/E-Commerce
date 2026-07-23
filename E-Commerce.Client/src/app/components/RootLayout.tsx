import { Outlet } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CyberBackground } from './CyberBackground';
import { CustomerAiChatWidget } from './ai/CustomerAiChatWidget';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
      <CyberBackground />
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CustomerAiChatWidget />
    </div>
  );
}
