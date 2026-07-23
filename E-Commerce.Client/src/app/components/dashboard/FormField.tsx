import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface FormFieldProps { label: string; error?: string; required?: boolean; children: ReactNode; }
export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(224,247,255,0.55)', letterSpacing: '0.07em' }}>
        {label}{required && <span style={{ color: '#ff00ff', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <p className="text-xs" style={{ color: '#ff5555' }}>{error}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 36, padding: '0 12px', fontSize: 13, width: '100%',
  background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)',
  borderRadius: 4, color: 'rgba(224,247,255,0.85)', fontFamily: 'DM Sans, sans-serif', outline: 'none',
};

interface DashInputProps extends InputHTMLAttributes<HTMLInputElement> {}
export function DashInput({ className = '', style: s = {}, ...props }: DashInputProps) {
  return (
    <input
      className={className}
      style={{ ...inputStyle, ...s }}
      onFocus={(e) => { e.target.style.border = '1px solid rgba(0,245,255,0.45)'; e.target.style.boxShadow = '0 0 0 2px rgba(0,245,255,0.08)'; }}
      onBlur={(e) => { e.target.style.border = '1px solid rgba(0,245,255,0.15)'; e.target.style.boxShadow = 'none'; }}
      {...props}
    />
  );
}

interface DashTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function DashTextarea({ className = '', style: s = {}, ...props }: DashTextareaProps) {
  return (
    <textarea
      className={className}
      rows={4}
      style={{ ...inputStyle, height: 'auto', padding: '8px 12px', resize: 'none', ...s }}
      onFocus={(e) => { e.target.style.border = '1px solid rgba(0,245,255,0.45)'; e.target.style.boxShadow = '0 0 0 2px rgba(0,245,255,0.08)'; }}
      onBlur={(e) => { e.target.style.border = '1px solid rgba(0,245,255,0.15)'; e.target.style.boxShadow = 'none'; }}
      {...props}
    />
  );
}

interface DashSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { options: { value: string; label: string }[]; }
export function DashSelect({ options, style: s = {}, ...props }: DashSelectProps) {
  return (
    <select
      style={{ ...inputStyle, ...s }}
      onFocus={(e) => { e.target.style.border = '1px solid rgba(0,245,255,0.45)'; }}
      onBlur={(e) => { e.target.style.border = '1px solid rgba(0,245,255,0.15)'; }}
      {...props}
    >
      {options.map((o) => <option key={o.value} value={o.value} style={{ background: '#050d15', color: 'rgba(224,247,255,0.85)' }}>{o.label}</option>)}
    </select>
  );
}
