import { useState } from 'react';
import { Link } from 'react-router';
import { Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { authService } from '../services/authService';
import { ApiError, firstValidationMessage } from '../services/apiClient';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setFieldError('');
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      setSubmitted(true);
    } catch (requestError) {
      setFieldError(firstValidationMessage(requestError, 'Email') ?? '');
      setError(requestError instanceof ApiError ? requestError.message : 'Şifre sıfırlama isteği gönderilemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#020408]">
      <div className="w-full max-w-md bg-[#050d15] rounded-none shadow-[var(--shadow-modal)] border border-[rgba(0,245,255,0.3)] p-8 hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all duration-300">
        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.3)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#00f5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-display text-[#00f5ff]" style={{ textShadow: '0 0 20px #00f5ff' }}>CHECK YOUR EMAIL</h1>
            <p className="text-muted-foreground text-sm">{message || `A password reset link was requested for ${email}.`}</p>
            <Link to="/login" className="block mt-6 text-sm text-[#00f5ff] hover:text-[#ff00ff]">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8"><h1 className="text-3xl font-display text-[#00f5ff] mb-2" style={{ textShadow: '0 0 20px #00f5ff' }}>RESET PASSWORD</h1>
              <p className="text-muted-foreground text-sm">Enter your email and the Security API will send a reset link</p></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} error={fieldError} required />
              {error && <p className="text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{error}</p>}
              <Button type="submit" variant="primary" fullWidth disabled={submitting}>
                <span className="flex items-center justify-center gap-2">{submitting && <Loader2 size={16} className="animate-spin" />}{submitting ? 'Sending…' : 'Send Reset Link'}</span>
              </Button>
              <div className="text-center text-sm text-muted-foreground">Remember your password?{' '}<Link to="/login" className="text-[#00f5ff] hover:text-[#ff00ff]">Sign In</Link></div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
