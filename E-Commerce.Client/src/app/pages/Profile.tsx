import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AddressManager } from '../components/profile/AddressManager';
import { AccountSidebar } from '../components/profile/AccountSidebar';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { ApiError, firstValidationMessage } from '../services/apiClient';
import { getAuthSession } from '../auth/authSession';
import { ProfileResponse } from '../types/api';
import { translateText } from '../i18n';

function splitFullName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() ?? '',
    lastName: parts.join(' '),
  };
}

export function Profile() {
  const navigate = useNavigate();
  const session = getAuthSession();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: session?.email ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    profileService.getMe()
      .then((response) => {
        const name = splitFullName(response.fullName);
        setProfile(response);
        setFormData((current) => ({
          ...current,
          firstName: name.firstName,
          lastName: name.lastName,
          phoneNumber: response.phoneNumber ?? '',
        }));
        setImagePreview(response.imageUrl ?? '');
      })
      .catch((requestError) => {
        if (requestError instanceof ApiError && requestError.status === 401) {
          navigate('/login');
          return;
        }
        setError(requestError instanceof ApiError ? requestError.message : 'Profil bilgileri alınamadı.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const selectImage = (file: File | null) => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : profile?.imageUrl ?? '');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    setFieldErrors({});

    try {
      const messages: string[] = [];
      let passwordChanged = false;
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const profileResult = await profileService.updateProfile({
        fullName,
        phoneNumber: formData.phoneNumber,
        image,
      });
      messages.push(profileResult.message);

      if (formData.email && formData.email !== session?.email) {
        const emailResult = await authService.changeEmail(formData.email);
        messages.push(emailResult.message);
      }

      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        const passwordResult = await authService.changePassword(
          formData.currentPassword,
          formData.newPassword,
          formData.confirmPassword,
        );
        messages.push(passwordResult.message);
        passwordChanged = true;
        setFormData((current) => ({ ...current, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }

      const combinedMessage = messages.filter(Boolean).join(' ');
      setMessage(combinedMessage);
      setImage(null);
      if (passwordChanged) {
        window.alert(translateText('{{message}} Yeniden giriş yapmalısınız.', { message: combinedMessage }));
        navigate('/login');
        return;
      }
      const updated = await profileService.getMe();
      setProfile(updated);
      setImagePreview(updated.imageUrl ?? '');
    } catch (requestError) {
      setFieldErrors({
        fullName: firstValidationMessage(requestError, 'FullName') ?? '',
        phoneNumber: firstValidationMessage(requestError, 'PhoneNumber') ?? '',
        email: firstValidationMessage(requestError, 'NewEmail') ?? '',
        currentPassword: firstValidationMessage(requestError, 'CurrentPassword') ?? '',
        newPassword: firstValidationMessage(requestError, 'NewPassword') ?? '',
        confirmPassword: firstValidationMessage(requestError, 'ConfirmPassword') ?? '',
      });
      setError(requestError instanceof ApiError ? requestError.message : 'Profil kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      navigate('/login');
    }
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center bg-[#020408]"><Loader2 className="animate-spin text-[#00f5ff]" size={34} /></div>;
  }

  return (
    <div className="min-h-screen bg-[#020408]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AccountSidebar
            activeSection="profile"
            fullName={`${formData.firstName} ${formData.lastName}`.trim()}
            email={session?.email}
            imageUrl={imagePreview}
            onImageChange={selectImage}
            onLogout={() => void logout()}
          />

          <main className="lg:col-span-3">
            <div className="bg-[rgba(0,245,255,0.04)] border border-[rgba(0,245,255,0.15)] shadow-[var(--shadow-card)] p-8">
              <h1 className="text-3xl font-display text-[#00f5ff] mb-2" style={{ textShadow: '0 0 16px rgba(0,245,255,.45)' }}>Profile Settings</h1>
              <p className="text-muted-foreground mb-8">Security and Profile services are connected through the API Gateway</p>

              {message && <p className="mb-5 text-sm text-[#4ade80] border border-[#4ade80]/25 bg-[#4ade80]/5 p-3">{message}</p>}
              {error && <p className="mb-5 text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="text-xl text-[#00f5ff] mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" value={formData.firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} error={fieldErrors.fullName} />
                    <Input label="Last Name" value={formData.lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} />
                    <Input label="Phone Number" type="tel" value={formData.phoneNumber} onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })} error={fieldErrors.phoneNumber} />
                    <Input label="Email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} error={fieldErrors.email} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Changing email starts the backend confirmation flow.</p>
                </div>

                <div className="pt-6 border-t border-[var(--border)]">
                  <h2 className="text-xl text-[#00f5ff] mb-4">Change Password</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><Input label="Current Password" type="password" value={formData.currentPassword} onChange={(event) => setFormData({ ...formData, currentPassword: event.target.value })} error={fieldErrors.currentPassword} /></div>
                    <Input label="New Password" type="password" value={formData.newPassword} onChange={(event) => setFormData({ ...formData, newPassword: event.target.value })} error={fieldErrors.newPassword} />
                    <Input label="Confirm New Password" type="password" value={formData.confirmPassword} onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} error={fieldErrors.confirmPassword} />
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-[var(--border)]">
                  <Button type="submit" variant="primary" disabled={saving}><span className="flex items-center gap-2">{saving && <Loader2 className="animate-spin" size={16} />}{saving ? 'Saving…' : 'Save Changes'}</span></Button>
                  <Button type="button" variant="ghost" onClick={() => window.location.reload()}>Cancel</Button>
                </div>
              </form>

              <AddressManager />

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
