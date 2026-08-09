import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

/** Campo de texto do design system. Use dentro de `Field` para rótulo/erro. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className = '', ...rest },
  ref,
) {
  const classes = ['input', invalid ? 'input--error' : '', className].filter(Boolean).join(' ');
  return <input ref={ref} className={classes} aria-invalid={invalid || undefined} {...rest} />;
});
