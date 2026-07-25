import { useState } from 'react';
import { Activity, BadgeDollarSign, SlidersHorizontal, Tags } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { mockProducts, mockCategories } from '../data/mockData';
import { Checkbox } from '../components/Checkbox';
import { RadioButton } from '../components/RadioButton';

export function ProductListing() {
  const [currentPage, setCurrentPage] = useState(1);
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
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-8 items-start">
          <aside className="catalog-filter-sidebar mb-6 lg:mb-0 lg:col-start-1 lg:row-start-1 lg:self-start">
            <div className="filter-station">
              <div className="filter-station__edge" aria-hidden="true" />

              <header className="filter-station__header">
                <span className="filter-station__main-icon">
                  <SlidersHorizontal size={20} />
                </span>
                <h3>Filters</h3>
                <button type="button" className="filter-station__clear">
                  Clear All
                </button>
              </header>

              <div className="filter-station__body">
                <section className="filter-station__section">
                  <div className="filter-station__section-heading">
                    <span className="filter-station__section-icon"><Tags size={16} /></span>
                    <h4>Category</h4>
                  </div>
                  <div className="filter-station__options">
                    {mockCategories.map((category) => (
                      <Checkbox
                        key={category.id}
                        label={category.name}
                        checked={selectedCategory === category.id}
                        onChange={() =>
                          setSelectedCategory(
                            selectedCategory === category.id ? null : category.id,
                          )
                        }
                      />
                    ))}
                  </div>
                </section>

                <section className="filter-station__section">
                  <div className="filter-station__section-heading">
                    <span className="filter-station__section-icon"><BadgeDollarSign size={16} /></span>
                    <h4>Price Range</h4>
                  </div>
                  <div className="filter-station__price-row">
                    <div className="filter-station__input-wrap">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(event) => setPriceRange([Number(event.target.value), priceRange[1]])}
                      />
                    </div>
                    <span className="filter-station__price-separator">—</span>
                    <div className="filter-station__input-wrap">
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])}
                      />
                    </div>
                  </div>
                </section>

                <section className="filter-station__section">
                  <div className="filter-station__section-heading">
                    <span className="filter-station__section-icon"><Activity size={16} /></span>
                    <h4>Status</h4>
                  </div>
                  <div className="filter-station__options">
                    <RadioButton label="All" name="status" defaultChecked />
                    <RadioButton label="Active" name="status" />
                    <RadioButton label="Inactive" name="status" />
                    <RadioButton label="Out of Stock" name="status" />
                  </div>
                </section>
              </div>
            </div>
          </aside>

          <main className="lg:col-start-2 lg:row-start-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <a href="/" className="hover:text-[var(--gold)]">Home</a>
              <span>/</span>
              <span className="text-[var(--navy)]">Products</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, mockProducts.length)}</span> of{' '}
                <span className="font-medium">{mockProducts.length}</span> products
              </p>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="product-sort-select min-w-[235px] px-4 py-2 border border-[var(--border)] rounded-lg bg-[#020408] text-[#e0f7ff] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(id) => console.log('Add to cart:', id)}
                  onToggleWishlist={(id) => console.log('Toggle wishlist:', id)}
                />
              ))}
            </div>

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
