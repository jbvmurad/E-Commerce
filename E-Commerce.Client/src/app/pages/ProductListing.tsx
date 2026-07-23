import { useState } from 'react';
import { ChevronDown, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { mockProducts, mockCategories } from '../data/mockData';
import { Checkbox } from '../components/Checkbox';
import { RadioButton } from '../components/RadioButton';

export function ProductListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');

  const itemsPerPage = 9;
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = mockProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#020408]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-[var(--gold)]">Home</a>
        <span>/</span>
        <span className="text-[var(--navy)]">Products</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-[rgba(0,245,255,0.04)] rounded-none p-6 border border-[rgba(0,245,255,0.15)] shadow-[var(--shadow-card)] sticky top-20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-[var(--gold)]" />
                <h3 className="text-lg text-[var(--navy)]">Filters</h3>
              </div>
              <button className="text-xs text-[var(--gold)] hover:underline">
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6 pb-6 border-b border-[var(--border)]">
              <h4 className="mb-4 text-[var(--navy)]">Category</h4>
              <div className="space-y-3">
                {mockCategories.map((category) => (
                  <Checkbox
                    key={category.id}
                    label={category.name}
                    checked={selectedCategory === category.id}
                    onChange={() =>
                      setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-[var(--border)]">
              <h4 className="mb-4 text-[var(--navy)]">Price Range</h4>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                  />
                </div>
                <span className="text-gray-400">—</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="mb-4 text-[var(--navy)]">Status</h4>
              <div className="space-y-3">
                <RadioButton label="All" name="status" defaultChecked />
                <RadioButton label="Active" name="status" />
                <RadioButton label="Inactive" name="status" />
                <RadioButton label="Out of Stock" name="status" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, mockProducts.length)}</span> of{' '}
              <span className="font-medium">{mockProducts.length}</span> products
            </p>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-1 bg-[rgba(0,245,255,0.08)] p-1 rounded-none border border-[rgba(0,245,255,0.15)]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-none transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-gradient-to-r from-[#00f5ff] to-[#00b4c8] text-[#020408] shadow-[0_0_15px_rgba(0,245,255,0.4)]' : 'text-muted-foreground hover:bg-[rgba(0,245,255,0.1)]'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-none transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-gradient-to-r from-[#00f5ff] to-[#00b4c8] text-[#020408] shadow-[0_0_15px_rgba(0,245,255,0.4)]' : 'text-muted-foreground hover:bg-[rgba(0,245,255,0.1)]'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 mb-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(id) => console.log('Add to cart:', id)}
                onToggleWishlist={(id) => console.log('Toggle wishlist:', id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
      </div>
    </div>
  );
}
