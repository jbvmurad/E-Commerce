import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePages = pages.filter((page) => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-none border transition-colors',
          currentPage === 1
            ? 'text-muted-foreground opacity-50 cursor-not-allowed'
            : 'text-[#00f5ff] hover:bg-[rgba(0,245,255,0.1)] hover:border-[rgba(0,245,255,0.3)]'
        )}
      >
        <ChevronLeft size={20} />
      </button>

      {visiblePages.map((page, index) => {
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-muted-foreground opacity-50">...</span>}
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                'min-w-[40px] h-10 rounded-none transition-all duration-300 border',
                page === currentPage
                  ? 'bg-gradient-to-r from-[#00f5ff] to-[#00b4c8] text-[#020408] border-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.4)]'
                  : 'text-muted-foreground border-transparent hover:bg-[rgba(0,245,255,0.1)] hover:border-[rgba(0,245,255,0.3)]'
              )}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-none border transition-colors',
          currentPage === totalPages
            ? 'text-muted-foreground opacity-50 cursor-not-allowed'
            : 'text-[#00f5ff] hover:bg-[rgba(0,245,255,0.1)] hover:border-[rgba(0,245,255,0.3)]'
        )}
      >
        <ChevronRight size={20} />
      </button>

      <span className="ml-4 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
