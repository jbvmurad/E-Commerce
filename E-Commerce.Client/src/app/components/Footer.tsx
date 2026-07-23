import { Link } from 'react-router';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Terms', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
  ];

  const categoryLinks = [
    { name: 'Electronics', path: '/products?category=1' },
    { name: 'Fashion', path: '/products?category=2' },
    { name: 'Home & Living', path: '/products?category=3' },
    { name: 'Sports', path: '/products?category=4' },
  ];

  const trustSignals = [
    { icon: Truck, text: 'Free Shipping' },
    { icon: Shield, text: 'Secure Payment' },
    { icon: RotateCcw, text: 'Easy Returns' },
    { icon: Headphones, text: '24/7 Support' },
  ];

  return (
    <footer className="bg-[#020408] border-t border-border mt-16">
      {/* Trust Signals */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustSignals.map((signal, index) => {
              const Icon = signal.icon;
              return (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-2 bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.3)] rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,245,255,0.6)] transition-all duration-300">
                    <Icon size={20} className="text-[#00f5ff]" style={{filter: 'drop-shadow(0 0 8px #00f5ff)'}} />
                  </div>
                  <span className="text-sm text-foreground">{signal.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display text-[#00f5ff] mb-4" style={{textShadow: '0 0 15px #00f5ff'}}>
              E-COMMERCE
            </h3>
            <p className="text-muted-foreground text-sm">
              Your destination for premium products and exceptional shopping experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-[#00f5ff] text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4">Categories</h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-[#00f5ff] text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Luxury Ave</li>
              <li>New York, NY 10001</li>
              <li>contact@ecommerce.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
