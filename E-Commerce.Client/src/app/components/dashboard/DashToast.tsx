import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

type ToastVariant = 'success' | 'error' | 'warning';

interface ToastProps { message: string; variant: ToastVariant; onClose: () => void; }

const cfg: Record<ToastVariant, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  success: { icon: <CheckCircle size={16} />, color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.25)' },
  error:   { icon: <XCircle size={16} />,     color: '#ff00ff', bg: 'rgba(255,0,255,0.08)',   border: 'rgba(255,0,255,0.25)' },
  warning: { icon: <AlertTriangle size={16} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)' },
};

export function DashToast({ message, variant, onClose }: ToastProps) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const { icon, color, bg, border } = cfg[variant];
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded"
      style={{ background: '#050d15', border: `1px solid ${border}`, boxShadow: `0 0 20px rgba(0,0,0,0.8), 0 0 12px ${border}`, color, fontFamily: 'DM Sans, sans-serif', minWidth: 280 }}>
      {icon}
      <span className="flex-1" style={{ color: 'rgba(224,247,255,0.85)' }}>{message}</span>
      <button onClick={onClose} style={{ color: 'rgba(224,247,255,0.3)', cursor: 'pointer' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = color)}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(224,247,255,0.3)')}>
        <X size={13} />
      </button>
    </div>
  );
}

interface ToastItem { id: number; message: string; variant: ToastVariant; }
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = (message: string, variant: ToastVariant = 'success') =>
    setToasts((t) => [...t, { id: Date.now(), message, variant }]);
  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));
  return { toasts, show, remove };
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => <DashToast key={t.id} message={t.message} variant={t.variant} onClose={() => onRemove(t.id)} />)}
    </div>
  );
}
