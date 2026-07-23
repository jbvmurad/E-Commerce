import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  ArrowRight,
  CircleCheckBig,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { authService } from '../services/authService';
import { ApiError, firstValidationMessage } from '../services/apiClient';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setFieldErrors({});

    try {
      const response = await authService.resetPassword(code, newPassword, confirmPassword);
      setSuccess(response.message);
    } catch (requestError) {
      setFieldErrors({
        newPassword: firstValidationMessage(requestError, 'NewPassword') ?? '',
        confirmPassword: firstValidationMessage(requestError, 'ConfirmPassword') ?? '',
      });
      setError(requestError instanceof ApiError ? requestError.message : 'Şifre sıfırlanamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[72vh] overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#00f5ff]/10 blur-[110px]" />
      <div className="relative mx-auto w-full max-w-xl border border-[rgba(0,245,255,0.28)] bg-[rgba(5,13,21,0.94)] p-7 shadow-[0_0_55px_rgba(0,245,255,0.14)] sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#00f5ff]/35 bg-[#00f5ff]/10 shadow-[0_0_30px_rgba(0,245,255,0.25)]">
          {success ? (
            <CircleCheckBig size={36} className="text-[#4ade80]" />
          ) : (
            <KeyRound size={34} className="text-[#00f5ff]" />
          )}
        </div>

        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#7cecf2]">
            <ShieldCheck size={15} /> Secure password recovery
          </div>
          <h1
            className="font-display text-3xl text-[#00f5ff] sm:text-4xl"
            style={{ textShadow: '0 0 22px rgba(0,245,255,0.72)' }}
          >
            {success ? 'PASSWORD UPDATED' : 'CREATE NEW PASSWORD'}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            {success
              ? success
              : 'Choose a strong new password for your E-Commerce account.'}
          </p>
        </div>

        {!code ? (
          <div className="mt-8 border border-red-500/25 bg-red-500/5 p-5 text-center">
            <p className="text-sm text-red-300">Reset code is missing.</p>
            <Link
              to="/forgot-password"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00f5ff] hover:text-[#ff00ff]"
            >
              Request a new link <ArrowRight size={16} />
            </Link>
          </div>
        ) : success ? (
          <div className="mt-8 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00f5ff] to-[#00b4c8] px-6 py-3 font-bold text-[#020408] shadow-[0_0_24px_rgba(0,245,255,0.34)] transition-transform hover:scale-[1.03]"
            >
              Go to Sign In <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                error={fieldErrors.newPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-[38px] text-muted-foreground transition-colors hover:text-[#00f5ff]"
                aria-label={showPassword ? 'Hide new password' : 'Show new password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                error={fieldErrors.confirmPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-[38px] text-muted-foreground transition-colors hover:text-[#00f5ff]"
                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="border border-red-500/25 bg-red-500/5 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth disabled={submitting}>
              <span className="flex items-center justify-center gap-2">
                {submitting && <Loader2 className="animate-spin" size={16} />}
                {submitting ? 'Saving…' : 'Save Password'}
              </span>
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
