import { InputHTMLAttributes } from 'react';

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function RadioButton({ label, id, className, ...props }: RadioButtonProps) {
  const inputId = id || (label ? `radio-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <label
      htmlFor={inputId}
      className="flex items-center gap-2.5 cursor-pointer group select-none"
    >
      <div className="relative flex items-center justify-center shrink-0">
        <input
          type="radio"
          id={inputId}
          className="peer sr-only"
          {...props}
        />
        {/* Outer ring */}
        <div className="w-4 h-4 rounded-full border border-[rgba(0,245,255,0.35)] bg-[rgba(0,245,255,0.04)] transition-all duration-200 peer-checked:border-[#00f5ff] peer-checked:shadow-[0_0_8px_rgba(0,245,255,0.5)] group-hover:border-[rgba(0,245,255,0.6)]" />
        {/* Inner dot */}
        <div className="absolute w-2 h-2 rounded-full bg-[#00f5ff] scale-0 peer-checked:scale-100 transition-transform duration-150 shadow-[0_0_6px_#00f5ff] pointer-events-none" />
      </div>
      {label && (
        <span className="text-sm text-muted-foreground group-hover:text-[#00f5ff] transition-colors duration-200">
          {label}
        </span>
      )}
    </label>
  );
}
