/** Utilitários de máscara de entrada (formatam enquanto o usuário digita). */

/** Remove tudo que não é dígito. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Formata um CNPJ progressivamente: `00.000.000/0000-00`. */
export function maskCNPJ(value: string): string {
  const d = onlyDigits(value).slice(0, 14);
  let out = d.slice(0, 2);
  if (d.length >= 3) out += `.${d.slice(2, 5)}`;
  if (d.length >= 6) out += `.${d.slice(5, 8)}`;
  if (d.length >= 9) out += `/${d.slice(8, 12)}`;
  if (d.length >= 13) out += `-${d.slice(12, 14)}`;
  return out;
}

/** Formata um telefone fixo/celular: `(00) 0000-0000` ou `(00) 00000-0000`. */
export function maskTelefone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  const corte = resto.length <= 8 ? 4 : 5;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}
