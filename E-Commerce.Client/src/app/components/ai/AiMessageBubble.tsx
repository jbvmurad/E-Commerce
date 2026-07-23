import { Bot, Download, FileImage, FileText, User } from 'lucide-react';
import { AiMessage } from '../../types/ai';

interface AiMessageBubbleProps {
  message: AiMessage;
  accent?: string;
  compact?: boolean;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

export function AiMessageBubble({ message, accent = '#ff00ff', compact = false }: AiMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div
          className={`${compact ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}
          style={{ background: `${accent}12`, border: `1px solid ${accent}35`, boxShadow: `0 0 14px ${accent}12` }}
        >
          <Bot size={compact ? 14 : 17} style={{ color: accent }} />
        </div>
      )}

      <div style={{ maxWidth: compact ? '84%' : '78%' }}>
        <div
          className="rounded-xl"
          style={{
            padding: compact ? '9px 11px' : '12px 14px',
            background: isUser ? `${accent}16` : 'rgba(5,13,21,.92)',
            border: `1px solid ${isUser ? `${accent}38` : 'rgba(224,247,255,.09)'}`,
            borderRadius: isUser ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
          }}
        >
          <p style={{ color: 'rgba(224,247,255,.82)', fontSize: compact ? 12 : 13, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
            {message.content}
          </p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(2,4,8,.5)', border: '1px solid rgba(224,247,255,.08)' }}>
                  {attachment.mimeType === 'application/pdf'
                    ? <FileText size={14} style={{ color: accent }} />
                    : <FileImage size={14} style={{ color: accent }} />}
                  <span className="truncate" style={{ color: 'rgba(224,247,255,.58)', fontSize: 10 }}>{attachment.name}</span>
                </div>
              ))}
            </div>
          )}

          {message.generatedImageUrl && (
            <div className="mt-3 overflow-hidden rounded-lg" style={{ border: `1px solid ${accent}30`, background: '#020408' }}>
              <img src={message.generatedImageUrl} alt="AI tarafından oluşturulan ürün görseli" className="w-full max-h-[420px] object-cover" />
              <a
                href={message.generatedImageUrl}
                download="ai-generated-image"
                className="flex items-center justify-center gap-2 py-2.5"
                style={{ color: accent, background: `${accent}0b`, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}
              >
                <Download size={13} /> Görseli indir
              </a>
            </div>
          )}
        </div>
        <p className={`mt-1 ${isUser ? 'text-right' : 'text-left'}`} style={{ color: 'rgba(224,247,255,.25)', fontSize: 9 }}>
          {formatTime(message.createdAt)}
        </p>
      </div>

      {isUser && !compact && (
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}>
          <User size={16} style={{ color: accent }} />
        </div>
      )}
    </div>
  );
}
