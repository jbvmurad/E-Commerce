import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowRight, CircleCheckBig, CircleX, Loader2, MailCheck, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { ApiError } from '../services/apiClient';

export function ConfirmEmailChange() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') ?? '';
  const code = searchParams.get('code') ?? '';
  const requested = useRef(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    if (!userId || !code) {
      setError('Email change confirmation information is missing.');
      return;
    }

    authService.confirmEmailChange(userId, code)
      .then((response) => setMessage(response.message))
      .catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : 'Email değişikliği doğrulanamadı.'));
  }, [code, userId]);

  const pending = !message && !error;

  return (
    <section className="relative min-h-[72vh] overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ff00ff]/10 blur-[110px]" />
      <div className="relative mx-auto w-full max-w-2xl border border-[rgba(0,245,255,0.28)] bg-[rgba(5,13,21,0.94)] p-7 shadow-[0_0_55px_rgba(0,245,255,0.14)] sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#00f5ff]/35 bg-[#00f5ff]/10 shadow-[0_0_30px_rgba(0,245,255,0.25)]">
          {pending && <Loader2 size={34} className="animate-spin text-[#00f5ff]" />}
          {message && <CircleCheckBig size={36} className="text-[#4ade80]" />}
          {error && <CircleX size={36} className="text-red-400" />}
        </div>

        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#7cecf2]">
            <ShieldCheck size={15} /> Secure email update
          </div>
          <h1 className="font-display text-3xl text-[#00f5ff] sm:text-4xl" style={{ textShadow: '0 0 22px rgba(0,245,255,0.72)' }}>
            {pending ? 'CONFIRMING NEW EMAIL' : message ? 'EMAIL UPDATED' : 'UPDATE FAILED'}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
            {pending && 'Your secure email-change link is being checked.'}
            {message && message}
            {error && error}
          </p>
        </div>

        <div className="mt-8 border border-[#00f5ff]/12 bg-[#02070c] p-4 text-sm text-[#8db8c2]">
          <div className="flex items-start gap-3">
            <MailCheck size={20} className="mt-0.5 shrink-0 text-[#00f5ff]" />
            <p>When the change succeeds, use your new email address the next time you sign in.</p>
          </div>
        </div>

        {!pending && (
          <div className="mt-8 flex justify-center">
            <Link to="/profile" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00f5ff] to-[#00b4c8] px-6 py-3 font-bold text-[#020408] shadow-[0_0_24px_rgba(0,245,255,0.34)] transition-transform hover:scale-[1.03]">
              Go to Profile <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
