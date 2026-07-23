import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { authService } from '../services/authService';
import { ApiError, firstValidationMessage } from '../services/apiClient';
import {
  clearGoogleRegistrationDraft,
  getGoogleRegistrationDraft,
  GoogleRegistrationDraft,
  saveGoogleRegistrationDraft,
} from '../auth/googleRegistration';

interface RegisterLocationState {
  googleRegistration?: GoogleRegistrationDraft;
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] ?? '', lastName: '' };

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.at(-1) ?? '',
  };
}

export function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationDraft = ((location.state ?? {}) as RegisterLocationState).googleRegistration;
  const initialDraft = useMemo(() => locationDraft ?? getGoogleRegistrationDraft(), [locationDraft]);
  const initialName = splitFullName(initialDraft?.fullName ?? '');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: initialDraft?.email ?? '',
    password: '',
    confirmPassword: '',
  });
  const [googlePrefilled, setGooglePrefilled] = useState(Boolean(initialDraft));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [notice, setNotice] = useState(initialDraft ? 'Google bilgileriniz doğrulandı. Kayıt için yalnızca yeni şifrenizi belirleyin.' : '');
  const [googleError, setGoogleError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const applyGoogleDraft = useCallback((draft: GoogleRegistrationDraft) => {
    const name = splitFullName(draft.fullName);
    saveGoogleRegistrationDraft(draft);
    setFormData({
      firstName: name.firstName,
      lastName: name.lastName,
      email: draft.email,
      password: '',
      confirmPassword: '',
    });
    setGooglePrefilled(true);
    setNotice('Google bilgileriniz doğrulandı. Kayıt için yalnızca yeni şifrenizi belirleyin.');
    setErrors({});
    setGoogleError('');
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await authService.register(
        `${formData.firstName} ${formData.lastName}`.trim(),
        formData.email,
        formData.password,
        formData.confirmPassword,
      );
      clearGoogleRegistrationDraft();
      setSuccess(response.message);
    } catch (error) {
      setErrors({
        firstName: firstValidationMessage(error, 'FullName') ?? '',
        email: firstValidationMessage(error, 'Email') ?? '',
        password: firstValidationMessage(error, 'Password') ?? '',
        confirmPassword: firstValidationMessage(error, 'ConfirmPassword') ?? '',
        form: error instanceof ApiError ? error.message : 'Kayıt oluşturulamadı.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setGoogleError('');
    const response = await authService.externalLogin(credential, 'Register');

    if (response.status === 'RegistrationRequired' && response.fullName && response.email) {
      applyGoogleDraft({ fullName: response.fullName, email: response.email });
      return;
    }

    if (response.status === 'AccountExists') {
      clearGoogleRegistrationDraft();
      navigate('/login', {
        state: {
          email: response.email ?? '',
          notice: 'Bu Google hesabı zaten kayıtlı. Google ile giriş yapabilirsiniz.',
        },
      });
      return;
    }

    if (response.status === 'Authenticated') {
      navigate('/');
      return;
    }

    setGoogleError('Google kayıt bilgileri alınamadı.');
  }, [applyGoogleDraft, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#020408]">
      <div className="w-full max-w-md bg-[#050d15] rounded-none shadow-[var(--shadow-modal)] border border-[rgba(0,245,255,0.3)] p-8 hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-[#00f5ff] mb-2" style={{ textShadow: '0 0 20px #00f5ff' }}>CREATE ACCOUNT</h1>
          <p className="text-muted-foreground">Create your account through the Security API</p>
        </div>

        {success ? (
          <div className="text-center space-y-5">
            <div className="border border-[#4ade80]/30 bg-[#4ade80]/5 p-4 text-[#4ade80] text-sm">{success}</div>
            <p className="text-sm text-muted-foreground">Confirm your email before signing in.</p>
            <Link to="/login" className="text-[#00f5ff] hover:text-[#ff00ff]">Go to Sign In</Link>
          </div>
        ) : (
          <>
            {notice && <p className="mb-5 border border-[#00f5ff]/25 bg-[#00f5ff]/5 p-3 text-sm text-[#8dfaff]">{notice}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={formData.firstName}
                  onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
                  error={errors.firstName} readOnly={googlePrefilled} className={googlePrefilled ? 'opacity-80' : ''} required />
                <Input label="Last Name" value={formData.lastName}
                  onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
                  readOnly={googlePrefilled} className={googlePrefilled ? 'opacity-80' : ''} required={!googlePrefilled} />
              </div>
              <Input label="Email" type="email" value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                error={errors.email} readOnly={googlePrefilled} className={googlePrefilled ? 'opacity-80' : ''} required />
              <div className="relative">
                <Input label={googlePrefilled ? 'New Password' : 'Password'} type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })} error={errors.password} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-muted-foreground hover:text-[#00f5ff]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <Input label={googlePrefilled ? 'Confirm New Password' : 'Confirm Password'} type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword}
                  onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} error={errors.confirmPassword} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-[38px] text-muted-foreground hover:text-[#00f5ff]">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.form && <p className="text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{errors.form}</p>}
              <Button type="submit" variant="primary" fullWidth className="mt-6" disabled={submitting}>
                <span className="flex items-center justify-center gap-2">{submitting && <Loader2 size={16} className="animate-spin" />}{submitting ? 'Creating…' : 'Create Account'}</span>
              </Button>
              <div className="text-center text-sm text-muted-foreground">Already have an account?{' '}<Link to="/login" className="text-[#00f5ff] hover:text-[#ff00ff]">Sign In</Link></div>
            </form>

            {!googlePrefilled && (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#050d15] text-muted-foreground">Google registration</span></div>
                </div>
                <div className="mt-6">
                  <GoogleAuthButton
                    mode="register"
                    disabled={submitting}
                    onCredential={handleGoogleCredential}
                    onError={setGoogleError}
                  />
                </div>
                {googleError && <p className="mt-3 text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{googleError}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
