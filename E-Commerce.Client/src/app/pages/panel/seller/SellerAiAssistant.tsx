import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send } from 'lucide-react';
import { AiAttachmentPicker } from '../../../components/ai/AiAttachmentPicker';
import { AiMessageBubble } from '../../../components/ai/AiMessageBubble';
import { aiAssistantService } from '../../../services/aiAssistantService';
import { AiAttachment, AiMessage, AiMessageAttachment } from '../../../types/ai';

const SELLER_ACCENT = '#00f5ff';

function toMessageAttachments(attachments: AiAttachment[]): AiMessageAttachment[] {
  return attachments.map(({ id, name, mimeType, size, previewUrl }) => ({
    id,
    name,
    mimeType,
    size,
    previewUrl,
  }));
}

export function SellerAiAssistant() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<AiAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messageListRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages, sending]);

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();

    const trimmed = message.trim();
    if ((!trimmed && attachments.length === 0) || sending) return;

    const userMessage: AiMessage = {
      id: `${Date.now()}-seller-user`,
      role: 'user',
      content:
        trimmed ||
        'Ekli dosyayı incele.',
      createdAt: new Date(),
      attachments: toMessageAttachments(attachments),
    };

    const requestAttachments = attachments;
    setMessages((current) => [...current, userMessage]);
    setMessage('');
    setAttachments([]);
    setSending(true);

    try {
      const reply = await aiAssistantService.sendMessage({
        audience: 'seller',
        message: userMessage.content,
        attachments: requestAttachments,
      });
      setMessages((current) => [...current, reply]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-seller-error`,
          role: 'assistant',
          content:
            'Asistan servisine şu anda ulaşılamıyor. Backend AI chat bağlantısını kontrol edip yeniden deneyebilirsin.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      requestAttachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setSending(false);
    }
  };

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section
      className="overflow-hidden flex flex-col"
      style={{
        minHeight: 'calc(100vh - 120px)',
        background: 'rgba(5,13,21,.88)',
        border: '1px solid rgba(0,245,255,.18)',
        borderRadius: 14,
        boxShadow: '0 18px 55px rgba(0,0,0,.24)',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <header
        className="flex items-center justify-between gap-4 px-5 py-4 shrink-0"
        style={{
          borderBottom: '1px solid rgba(0,245,255,.12)',
          background: 'linear-gradient(90deg,rgba(0,245,255,.045),rgba(0,245,255,.02))',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,rgba(0,245,255,.22),rgba(0,245,255,.12))',
              border: '1px solid rgba(0,245,255,.3)',
              boxShadow: '0 0 24px rgba(0,245,255,.09)',
            }}
          >
            <Bot size={20} style={{ color: SELLER_ACCENT }} />
            <span
              className="absolute -right-1 -bottom-1 w-2.5 h-2.5 rounded-full"
              style={{ background: '#4ade80', border: '2px solid #050d15' }}
            />
          </div>
          <div>
            <h1 style={{ color: 'rgba(224,247,255,.9)', fontSize: 14, fontWeight: 700 }}>
              Seller Copilot
            </h1>
            <p style={{ color: 'rgba(224,247,255,.34)', fontSize: 10 }}>
              Mesajınızı yazın ve sohbeti başlatın.
            </p>
          </div>
        </div>
      </header>

      <div ref={messageListRef} className="flex-1 overflow-y-auto p-5 space-y-5" style={{ minHeight: 500 }}>
        {messages.map((item) => (
          <AiMessageBubble key={item.id} message={item} accent={SELLER_ACCENT} />
        ))}

        {sending && (
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(0,245,255,.1)',
                border: '1px solid rgba(0,245,255,.25)',
              }}
            >
              <Bot size={17} style={{ color: SELLER_ACCENT }} />
            </div>
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(5,13,21,.92)',
                border: '1px solid rgba(224,247,255,.08)',
              }}
            >
              <Loader2 size={14} className="animate-spin" style={{ color: SELLER_ACCENT }} />
              <span style={{ color: 'rgba(224,247,255,.45)', fontSize: 11 }}>
                Yanıt hazırlanıyor…
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className="px-5 pt-3 pb-4 shrink-0"
        style={{ borderTop: '1px solid rgba(0,245,255,.09)' }}
      >
        <form
          onSubmit={sendMessage}
          className="rounded-xl p-3"
          style={{
            background: 'rgba(2,4,8,.86)',
            border: '1px solid rgba(0,245,255,.23)',
            boxShadow: '0 0 24px rgba(0,245,255,.04)',
          }}
        >
          <AiAttachmentPicker
            attachments={attachments}
            onChange={setAttachments}
            accent={SELLER_ACCENT}
            compact
            maxFiles={5}
          />

          <div className="flex items-end gap-2 mt-2">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={onMessageKeyDown}
              placeholder="Mesajınızı yazın…"
              rows={2}
              className="flex-1 resize-none bg-transparent outline-none"
              style={{
                color: 'rgba(224,247,255,.84)',
                fontSize: 12,
                lineHeight: 1.55,
                minHeight: 48,
                maxHeight: 140,
              }}
            />

            <button
              type="submit"
              disabled={sending || (!message.trim() && attachments.length === 0)}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
              style={{
                background: 'rgba(0,245,255,.15)',
                border: '1px solid rgba(0,245,255,.4)',
                color: SELLER_ACCENT,
                boxShadow: '0 0 16px rgba(0,245,255,.09)',
              }}
              aria-label="Mesajı gönder"
            >
              {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            </button>
          </div>

          <p style={{ color: 'rgba(224,247,255,.2)', fontSize: 9 }}>
            Enter ile gönder • Shift + Enter ile yeni satır • PDF ve görsel: en fazla 15 MB
          </p>
        </form>
      </div>
    </section>
  );
}
