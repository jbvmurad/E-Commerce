import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { mockProducts, mockCategories } from '../data/mockData';
import * as LucideIcons from 'lucide-react';

export function Home() {
  const featuredProducts = mockProducts.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-[#020408] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
        <div className="absolute w-[600px] h-[600px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '20%',
          transform: 'translate(-50%, -50%)',
          animation: 'float1 8s ease-in-out infinite'
        }}></div>
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(255,0,255,0.10) 0%, transparent 70%)',
          top: '40%',
          right: '15%',
          transform: 'translate(50%, -50%)',
          animation: 'float2 10s ease-in-out infinite'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-display mb-6" style={{
              background: 'linear-gradient(90deg, #00f5ff, #ff00ff, #00f5ff)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 4s linear infinite'
            }}>
              DISCOVER PREMIUM PRODUCTS
            </h1>
            <p className="text-xl mb-8 text-[rgba(224,247,255,0.5)]">
              Experience luxury and quality with our curated collection of the finest products
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="w-64">
                <Button variant="primary" className="text-lg px-8 py-4 flex items-center justify-center gap-2 w-full h-14">
                  Shop Now
                  <ChevronRight size={20} />
                </Button>
              </Link>
              <Link to="/products" className="w-64">
                <Button variant="ghost" className="text-lg px-8 py-4 bg-[rgba(0,245,255,0.1)] text-[#00f5ff] hover:bg-[rgba(0,245,255,0.2)] border-2 border-[rgba(0,245,255,0.3)] hover:border-[rgba(0,245,255,0.5)] w-full h-14 flex items-center justify-center">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="bg-[#020408] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display text-white mb-8">
            SHOP BY <span className="text-[#ff00ff]" style={{textShadow: '0 0 20px #ff00ff'}}>CATEGORY</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mockCategories.map((category, index) => {
              const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Tag;
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-[rgba(0,245,255,0.04)] rounded-none p-6 text-center border border-[rgba(0,245,255,0.15)] hover:shadow-[0_8px_30px_rgba(0,245,255,0.15),0_0_0_1px_rgba(0,245,255,0.2)] transition-all duration-300 hover:-translate-y-1 h-[140px] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-3 bg-transparent rounded-full flex items-center justify-center shrink-0">
                      <IconComponent className="text-[#00f5ff]" size={28} style={{filter: 'drop-shadow(0 0 8px #00f5ff)'}} />
                    </div>
                    <h3 className="text-xs uppercase tracking-wider text-[rgba(224,247,255,0.7)] line-clamp-1">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#020408] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display text-white">
              FEATURED <span className="text-[#ff00ff]" style={{textShadow: '0 0 20px #ff00ff'}}>PRODUCTS</span>
            </h2>
            <Link to="/products">
              <Button variant="ghost" className="flex items-center gap-2">
                View All
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(id) => console.log('Add to cart:', id)}
                onToggleWishlist={(id) => console.log('Toggle wishlist:', id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
