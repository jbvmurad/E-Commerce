import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={inputId}
      className="flex items-center gap-2.5 cursor-pointer group select-none"
    >
      <div className="relative flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          id={inputId}
          className="peer sr-only"
          {...props}
        />
        <div className="w-4 h-4 border border-[rgba(0,245,255,0.35)] bg-[rgba(0,245,255,0.04)] transition-all duration-200 peer-checked:bg-[rgba(0,245,255,0.15)] peer-checked:border-[#00f5ff] peer-checked:shadow-[0_0_8px_rgba(0,245,255,0.5)] group-hover:border-[rgba(0,245,255,0.6)]" />
        <svg
          className="absolute w-2.5 h-2.5 text-[#00f5ff] opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1.5 5l2.5 2.5 4.5-4.5" />
        </svg>
      </div>
      {label && (
        <span className="text-sm text-muted-foreground group-hover:text-[#00f5ff] transition-colors duration-200">
          {label}
        </span>
      )}
    </label>
  );
}
