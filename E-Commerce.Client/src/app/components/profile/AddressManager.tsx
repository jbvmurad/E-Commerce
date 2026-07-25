import { useEffect, useState } from 'react';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { profileService } from '../../services/profileService';
import { ApiError } from '../../services/apiClient';
import { AddressPayload, UserAddressResponse } from '../../types/api';
import { translateText } from '../../i18n';

const emptyAddress: AddressPayload = {
  title: '',
  recipientFullName: '',
  phoneNumber: '',
  countryCode: 'TR',
  city: '',
  stateOrRegion: '',
  district: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  isDefaultShipping: false,
  isDefaultBilling: false,
};

function addressToPayload(address: UserAddressResponse): AddressPayload {
  return {
    title: address.title,
    recipientFullName: address.recipientFullName,
    phoneNumber: address.phoneNumber,
    countryCode: address.countryCode,
    city: address.city,
    stateOrRegion: address.stateOrRegion ?? '',
    district: address.district ?? '',
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? '',
    postalCode: address.postalCode ?? '',
    isDefaultShipping: address.isDefaultShipping,
    isDefaultBilling: address.isDefaultBilling,
  };
}

export function AddressManager() {
  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressPayload>(emptyAddress);

  const loadAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      setAddresses(await profileService.getAddresses());
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Adresler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyAddress);
    setModalOpen(true);
    setError('');
  };

  const openEdit = (address: UserAddressResponse) => {
    setEditingId(address.id);
    setForm(addressToPayload(address));
    setModalOpen(true);
    setError('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const result = editingId
        ? await profileService.updateAddress(editingId, form)
        : await profileService.addAddress(form);
      setMessage(result.message);
      setModalOpen(false);
      await loadAddresses();
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Adres kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (address: UserAddressResponse) => {
    if (!window.confirm(translateText('“{{title}}” adresi silinsin mi?', { title: address.title }))) return;

    setError('');
    setMessage('');
    try {
      const result = await profileService.deleteAddress(address.id);
      setMessage(result.message);
      await loadAddresses();
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Adres silinemedi.');
    }
  };

  return (
    <section className="mt-8 pt-8 border-t border-[var(--border)]">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl text-[#00f5ff]" style={{ textShadow: '0 0 15px #00f5ff' }}>
            Address Book
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Shipping and billing addresses from Profile API</p>
        </div>
        <Button type="button" variant="ghost" onClick={openCreate}>
          <span className="flex items-center gap-2"><Plus size={16} /> Add Address</span>
        </Button>
      </div>

      {message && <p className="mb-4 text-sm text-[#4ade80]">{message}</p>}
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading addresses…</p>
      ) : addresses.length === 0 ? (
        <div className="border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.03)] p-6 text-center">
          <MapPin className="mx-auto mb-3 text-[#00f5ff]" size={28} />
          <p className="text-sm text-muted-foreground">No address has been added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <article key={address.id} className="p-5 border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.03)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[#00f5ff] font-medium">{address.title}</h3>
                  <p className="text-sm text-foreground mt-2">{address.recipientFullName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[address.district, address.city, address.stateOrRegion, address.postalCode, address.countryCode]
                      .filter(Boolean)
                      .join(' / ')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{address.phoneNumber}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(address)} className="p-2 border border-[rgba(0,245,255,0.2)] text-[#00f5ff]">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => void remove(address)} className="p-2 border border-red-500/30 text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {address.isDefaultShipping && <span className="text-xs px-2 py-1 border border-[#00f5ff]/30 text-[#00f5ff]">Default shipping</span>}
                {address.isDefaultBilling && <span className="text-xs px-2 py-1 border border-[#4ade80]/30 text-[#4ade80]">Default billing</span>}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Address' : 'Add Address'} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Address Title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Input label="Recipient Full Name" required value={form.recipientFullName} onChange={(event) => setForm({ ...form, recipientFullName: event.target.value })} />
            <Input label="Phone Number" required value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} />
            <Input label="Country Code" required value={form.countryCode} onChange={(event) => setForm({ ...form, countryCode: event.target.value.toUpperCase() })} />
            <Input label="City" required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            <Input label="State / Region" value={form.stateOrRegion} onChange={(event) => setForm({ ...form, stateOrRegion: event.target.value })} />
            <Input label="District" value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} />
            <Input label="Postal Code" value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} />
            <div className="md:col-span-2">
              <Input label="Address Line 1" required value={form.addressLine1} onChange={(event) => setForm({ ...form, addressLine1: event.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Input label="Address Line 2" value={form.addressLine2} onChange={(event) => setForm({ ...form, addressLine2: event.target.value })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <Checkbox label="Default shipping" checked={form.isDefaultShipping} onChange={(event) => setForm({ ...form, isDefaultShipping: event.target.checked })} />
            <Checkbox label="Default billing" checked={form.isDefaultBilling} onChange={(event) => setForm({ ...form, isDefaultBilling: event.target.checked })} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save Address'}</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
