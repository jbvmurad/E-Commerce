import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { AiMessageBubble } from './AiMessageBubble';
import { aiAssistantService } from '../../services/aiAssistantService';
import { AiMessage } from '../../types/ai';

const CYAN = '#00f5ff';
const quickQuestions = ['Siparişim nerede?', 'İade koşulları', 'Ürün öner', 'Ödeme sorunu'];

const initialMessage: AiMessage = {
  id: 'customer-welcome',
  role: 'assistant',
  content:
    'Merhaba! Ürün seçimi, sipariş, teslimat, ödeme ve iade konularında yardımcı olabilirim. Nasıl yardımcı olayım?',
  createdAt: new Date(),
};

export function CustomerAiChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([initialMessage]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messageListRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages, sending, open]);

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || sending) return;

    const userMessage: AiMessage = {
      id: `${Date.now()}-customer-user`,
      role: 'user',
      content: trimmed,
      createdAt: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setMessage('');
    setSending(true);

    try {
      const reply = await aiAssistantService.sendMessage({
        audience: 'customer',
        message: userMessage.content,
      });
      setMessages((current) => [...current, reply]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-customer-error`,
          role: 'assistant',
          content: 'Destek servisine şu anda ulaşılamıyor. Lütfen daha sonra yeniden dene.',
          createdAt: new Date(),
        },
      ]);
    } finally {
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
    <div
      className="fixed z-50"
      style={{ right: 22, bottom: 22, fontFamily: 'DM Sans, sans-serif' }}
    >
      {open && (
        <section
          className="mb-3 overflow-hidden flex flex-col"
          style={{
            width: 'min(390px, calc(100vw - 24px))',
            height: minimized ? 62 : 'min(620px, calc(100vh - 105px))',
            background: 'rgba(2,4,8,.96)',
            border: '1px solid rgba(0,245,255,.28)',
            borderRadius: 16,
            boxShadow: '0 24px 80px rgba(0,0,0,.62), 0 0 35px rgba(0,245,255,.09)',
            backdropFilter: 'blur(22px)',
            transition: 'height .2s ease',
          }}
          aria-label="AI müşteri destek sohbeti"
        >
          <header
            className="h-[62px] px-4 flex items-center justify-between shrink-0"
            style={{
              borderBottom: minimized ? 'none' : '1px solid rgba(0,245,255,.12)',
              background: 'linear-gradient(90deg,rgba(0,245,255,.08),rgba(255,0,255,.035))',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(0,245,255,.11)',
                  border: '1px solid rgba(0,245,255,.3)',
                }}
              >
                <Bot size={18} style={{ color: CYAN, filter: 'drop-shadow(0 0 5px #00f5ff)' }} />
                <span
                  className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: '#4ade80', border: '2px solid #020408' }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p style={{ color: 'rgba(224,247,255,.9)', fontSize: 13, fontWeight: 700 }}>
                    AI Destek
                  </p>
                  <Sparkles size={11} style={{ color: '#ff00ff' }} />
                </div>
                <p style={{ color: 'rgba(224,247,255,.34)', fontSize: 9 }}>
                  Genellikle birkaç saniyede yanıtlar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMinimized((value) => !value)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: 'rgba(224,247,255,.45)' }}
                aria-label={minimized ? 'Sohbeti büyüt' : 'Sohbeti küçült'}
              >
                <ChevronDown
                  size={17}
                  style={{ transform: minimized ? 'rotate(180deg)' : 'none' }}
                />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: 'rgba(224,247,255,.45)' }}
                aria-label="Sohbeti kapat"
              >
                <X size={17} />
              </button>
            </div>
          </header>

          {!minimized && (
            <>
              <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((item) => (
                  <AiMessageBubble key={item.id} message={item} accent={CYAN} compact />
                ))}

                {sending && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(0,245,255,.1)',
                        border: '1px solid rgba(0,245,255,.25)',
                      }}
                    >
                      <Bot size={14} style={{ color: CYAN }} />
                    </div>
                    <div
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{
                        background: 'rgba(5,13,21,.92)',
                        border: '1px solid rgba(224,247,255,.08)',
                      }}
                    >
                      <Loader2 size={13} className="animate-spin" style={{ color: CYAN }} />
                      <span style={{ color: 'rgba(224,247,255,.4)', fontSize: 10 }}>
                        Yanıt hazırlanıyor…
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-3 pb-3">
                <div className="flex gap-1.5 overflow-x-auto pb-2">
                  {quickQuestions.map((question) => (
                    <button
                      type="button"
                      key={question}
                      onClick={() => setMessage(question)}
                      className="shrink-0 px-2.5 py-1.5 rounded-full"
                      style={{
                        color: 'rgba(224,247,255,.46)',
                        border: '1px solid rgba(0,245,255,.14)',
                        background: 'rgba(0,245,255,.035)',
                        fontSize: 9,
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={sendMessage}
                  className="p-2.5 rounded-xl"
                  style={{
                    background: 'rgba(5,13,21,.86)',
                    border: '1px solid rgba(0,245,255,.2)',
                  }}
                >
                  <div className="flex items-end gap-2">
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      onKeyDown={onMessageKeyDown}
                      placeholder="Mesajını yaz…"
                      rows={1}
                      className="flex-1 resize-none bg-transparent outline-none"
                      style={{
                        minHeight: 38,
                        maxHeight: 90,
                        color: 'rgba(224,247,255,.8)',
                        fontSize: 12,
                        lineHeight: 1.55,
                        padding: '8px 2px',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={sending || !message.trim()}
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-30"
                      style={{
                        color: '#020408',
                        background: CYAN,
                        boxShadow: '0 0 15px rgba(0,245,255,.22)',
                      }}
                      aria-label="Mesajı gönder"
                    >
                      {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    </button>
                  </div>
                </form>

                <p
                  className="text-center mt-1.5"
                  style={{ color: 'rgba(224,247,255,.18)', fontSize: 8 }}
                >
                  AI yanıtları kontrol gerektirebilir • Hassas bilgi paylaşma
                </p>
              </div>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          setMinimized(false);
        }}
        className="ml-auto relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
        style={{
          background: 'linear-gradient(135deg,#00f5ff,#7a5cff)',
          color: '#020408',
          boxShadow: '0 10px 32px rgba(0,245,255,.24), 0 0 28px rgba(0,245,255,.2)',
        }}
        aria-label={open ? 'AI destek sohbetini kapat' : 'AI destek sohbetini aç'}
      >
        {open ? <X size={23} /> : <MessageCircle size={25} />}
        {!open && (
          <span
            className="absolute -right-1 -top-1 w-4 h-4 rounded-full"
            style={{
              background: '#ff00ff',
              border: '2px solid #020408',
              boxShadow: '0 0 8px #ff00ff',
            }}
          />
        )}
      </button>
    </div>
  );
}
