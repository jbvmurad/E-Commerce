import { Heart, ShoppingCart } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import type { Product } from '../data/mockData';
import { Link } from 'react-router';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  return (
    <div className="bg-[rgba(0,245,255,0.04)] rounded-none overflow-hidden border border-[rgba(0,245,255,0.15)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,245,255,0.2),0_0_40px_rgba(0,245,255,0.08)] hover:border-[rgba(0,245,255,0.3)] transition-all duration-400 group hover:-translate-y-2">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#0a1520] to-[#0d1f30]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="bg-[rgba(0,245,255,0.9)] backdrop-blur-sm text-[#020408]">
              {product.categoryName}
            </Badge>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist?.(product.id);
            }}
            className="absolute top-3 right-3 p-2 bg-[rgba(0,245,255,0.9)] backdrop-blur-sm rounded-full hover:bg-[#00f5ff] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,245,255,0.6)] border border-[rgba(0,245,255,0.3)]"
          >
            <Heart size={18} className="text-[#020408]" />
          </button>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[2px] text-[rgba(0,245,255,0.5)] mb-2 font-semibold">
          {product.categoryName}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-[15px] mb-4 text-[rgba(224,247,255,0.9)] hover:text-[#00f5ff] transition-colors line-clamp-2 leading-relaxed">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg text-[#00f5ff] font-bold" style={{textShadow: '0 0 15px rgba(0,245,255,0.4)'}}>
            ${product.price.toFixed(2)}
          </p>
          <Badge variant="productStatus" status={product.status}>
            {product.status}
          </Badge>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={() => onAddToCart?.(product.id)}
          disabled={product.status === 'OutOfStock'}
          className="flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
