import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  accent?: string;
}

export function DashPagination({ currentPage, totalItems, itemsPerPage, onPageChange, accent = '#00f5ff' }: DashPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);

  const btnBase: React.CSSProperties = {
    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 4, fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
    border: `1px solid rgba(0,245,255,0.15)`, background: 'transparent',
    color: 'rgba(224,247,255,0.55)', cursor: 'pointer', transition: 'all 0.15s',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
        {start}–{end} / {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}
          style={{ ...btnBase, opacity: currentPage === 1 ? 0.3 : 1 }}>
          <ChevronLeft size={15} />
        </button>
        {pages.map((page, i) => {
          const prev = pages[i - 1];
          return (
            <div key={page} className="flex items-center gap-1">
              {prev && page - prev > 1 && <span style={{ color: 'rgba(224,247,255,0.3)', fontSize: 13 }}>…</span>}
              <button onClick={() => onPageChange(page)}
                style={page === currentPage ? {
                  ...btnBase,
                  background: `${accent}15`,
                  border: `1px solid ${accent}50`,
                  color: accent,
                  boxShadow: `0 0 10px ${accent}20`,
                } : btnBase}>
                {page}
              </button>
            </div>
          );
        })}
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}
          style={{ ...btnBase, opacity: currentPage === totalPages ? 0.3 : 1 }}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
