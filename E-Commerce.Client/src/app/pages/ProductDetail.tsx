import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Minus, Plus, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data/mockData';

export function ProductDetail() {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Product not found</div>;
  }

  const relatedProducts = mockProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const images = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="min-h-screen bg-[#020408]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-[var(--gold)]">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.categoryId}`} className="hover:text-[var(--gold)]">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-[var(--navy)]">{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="bg-[rgba(0,245,255,0.04)] rounded-none overflow-hidden border border-[rgba(0,245,255,0.15)] shadow-[var(--shadow-card)] mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-[var(--gold)]'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={img} alt="" className="w-full aspect-square object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <Badge variant="default" className="mb-4">
            {product.categoryName}
          </Badge>
          <h1 className="text-4xl font-display text-[var(--navy)] mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <p className="text-4xl text-[var(--gold)]">
              ${product.price.toFixed(2)}
            </p>
            <Badge variant="productStatus" status={product.status}>
              {product.status}
            </Badge>
          </div>

          {/* Stock Quantity */}
          <div className="mb-6">
            {product.stockQuantity > 0 ? (
              <p className="text-sm text-green-600">
                ✓ {product.stockQuantity} items in stock
              </p>
            ) : (
              <p className="text-sm text-red-600">
                ✗ Out of Stock
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-[rgba(0,245,255,0.3)] rounded-none hover:bg-[rgba(0,245,255,0.1)] transition-colors"
              >
                <Minus size={18} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center px-4 py-2 border border-[var(--border)] rounded-lg"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-[rgba(0,245,255,0.3)] rounded-none hover:bg-[rgba(0,245,255,0.1)] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button
              variant="primary"
              fullWidth
              disabled={product.status === 'OutOfStock'}
              className="flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </Button>
            <Button variant="secondary" className="px-6">
              <Heart size={20} />
            </Button>
          </div>

          <Button variant="ghost" fullWidth>
            Save to Wishlist
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-[rgba(0,245,255,0.04)] rounded-none border border-[rgba(0,245,255,0.15)] shadow-[var(--shadow-card)] mb-16">
        <div className="border-b border-[var(--border)]">
          <div className="flex gap-8 px-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-4 text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-[#00f5ff] border-b-2 border-[#00f5ff] shadow-[0_2px_10px_rgba(0,245,255,0.4)]'
                    : 'text-muted-foreground hover:text-[#00f5ff]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-xl mb-4">Product Description</h3>
              <p className="text-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-xl mb-4">Specifications</h3>
              {product.specifications ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-4">
                      <dt className="text-muted-foreground min-w-[120px]">{key}:</dt>
                      <dd className="text-[var(--navy)]">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-xl mb-4">Customer Reviews</h3>
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-display text-[var(--navy)] mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={(id) => console.log('Add to cart:', id)}
                onToggleWishlist={(id) => console.log('Toggle wishlist:', id)}
              />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
