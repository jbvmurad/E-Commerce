import { Inbox } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title = 'Veri bulunamadı', description = 'Henüz kayıt eklenmemiş.', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.15)' }}>
        <Inbox size={22} style={{ color: 'rgba(0,245,255,0.4)' }} />
      </div>
      <p className="text-sm font-medium" style={{ color: 'rgba(224,247,255,0.7)' }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: 'rgba(224,247,255,0.35)' }}>{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
