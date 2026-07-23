import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { authService } from '../services/authService';
import { ApiError, firstValidationMessage } from '../services/apiClient';
import { getAuthSession } from '../auth/authSession';
import { saveGoogleRegistrationDraft } from '../auth/googleRegistration';

interface LoginLocationState {
  email?: string;
  notice?: string;
}

export function Login() {
  const location = useLocation();
  const initialState = (location.state ?? {}) as LoginLocationState;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: initialState.email ?? '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState(initialState.notice ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const navigate = useNavigate();

  const navigateAfterLogin = useCallback(() => {
    const session = getAuthSession();
    if (session?.roles.some((role) => role.toLowerCase() === 'admin')) {
      navigate('/panel/admin');
    } else if (session?.roles.some((role) => role.toLowerCase() === 'seller')) {
      navigate('/panel/seller');
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setNotice('');

    try {
      await authService.login(formData.email, formData.password);
      navigateAfterLogin();
    } catch (error) {
      setErrors({
        email: firstValidationMessage(error, 'Email') ?? '',
        password: firstValidationMessage(error, 'Password') ?? '',
        form: error instanceof ApiError ? error.message : 'Giriş yapılamadı.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setGoogleError('');
    setNotice('');

    const response = await authService.externalLogin(credential, 'Login');

    if (response.status === 'Authenticated') {
      navigateAfterLogin();
      return;
    }

    if (response.status === 'RegistrationRequired' && response.fullName && response.email) {
      const draft = { fullName: response.fullName, email: response.email };
      saveGoogleRegistrationDraft(draft);
      navigate('/register', { state: { googleRegistration: draft } });
      return;
    }

    setGoogleError('Google hesabı ile giriş tamamlanamadı.');
  }, [navigate, navigateAfterLogin]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#020408]">
      <div className="w-full max-w-md bg-[#050d15] rounded-none shadow-[var(--shadow-modal)] border border-[rgba(0,245,255,0.3)] p-8 hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-[#00f5ff] mb-2" style={{ textShadow: '0 0 20px #00f5ff' }}>WELCOME BACK</h1>
          <p className="text-muted-foreground">Sign in through the Security API</p>
        </div>

        {notice && <p className="mb-5 border border-[#00f5ff]/25 bg-[#00f5ff]/5 p-3 text-sm text-[#8dfaff]">{notice}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Email" type="email" placeholder="you@example.com" value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })} error={errors.email} required />

          <div className="relative">
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
              value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              error={errors.password} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-[#00f5ff] transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.form && <p className="text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{errors.form}</p>}

          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" checked={formData.rememberMe}
              onChange={(event) => setFormData({ ...formData, rememberMe: event.target.checked })} />
            <Link to="/forgot-password" className="text-sm text-[#00f5ff] hover:text-[#ff00ff] transition-colors">Forgot Password?</Link>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={submitting}>
            <span className="flex items-center justify-center gap-2">
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Signing In…' : 'Sign In'}
            </span>
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00f5ff] hover:text-[#ff00ff] transition-colors">Create one</Link>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#050d15] text-muted-foreground">External login</span></div>
          </div>
          <div className="mt-6">
            <GoogleAuthButton
              mode="login"
              disabled={submitting}
              onCredential={handleGoogleCredential}
              onError={setGoogleError}
            />
          </div>
          {googleError && <p className="mt-3 text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{googleError}</p>}
        </div>
      </div>
    </div>
  );
}
