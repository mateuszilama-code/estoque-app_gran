import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/** Área de texto multi-linha do design system. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, className = '', ...rest },
  ref,
) {
  const classes = ['textarea', invalid ? 'textarea--error' : '', className]
    .filter(Boolean)
    .join(' ');
  return <textarea ref={ref} className={classes} aria-invalid={invalid || undefined} {...rest} />;
});
