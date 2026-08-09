import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

/** Select do design system, alimentado por uma lista de `options`. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid = false, options, placeholder, className = '', ...rest },
  ref,
) {
  const classes = ['select', invalid ? 'select--error' : '', className].filter(Boolean).join(' ');
  return (
    <select ref={ref} className={classes} aria-invalid={invalid || undefined} {...rest}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});
