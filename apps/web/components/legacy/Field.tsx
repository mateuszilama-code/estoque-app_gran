import { ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/**
 * Wrapper de campo de formulário: rótulo (com marcador de obrigatório), o
 * controle (children) e a mensagem de erro por campo — feedback imediato,
 * alinhado às regras de validação da API.
 */
export function Field({ label, htmlFor, required, error, hint, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="field__req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
