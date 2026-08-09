import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFornecedorDto } from './create-fornecedor.dto';

/**
 * Testes de validação do CreateFornecedorDto — cobrem o cenário "dados inválidos"
 * do desafio (mensagens de erro por campo). Usa o mesmo pipeline do ValidationPipe
 * global (plainToInstance + validate).
 */
describe('CreateFornecedorDto (validação)', () => {
  const payloadValido = {
    nome_empresa: 'Tech Distribuidora LTDA',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Palmeiras, 100 - São Paulo/SP',
    telefone: '(11) 3333-4444',
    email: 'contato@techdistribuidora.com',
    contato_principal: 'Ana Souza',
  };

  const validar = (payload: Record<string, unknown>) =>
    validate(plainToInstance(CreateFornecedorDto, payload));

  it('aceita um payload válido (sem erros)', async () => {
    const erros = await validar(payloadValido);
    expect(erros).toHaveLength(0);
  });

  it('aceita telefone de celular no formato (00) 00000-0000', async () => {
    const erros = await validar({ ...payloadValido, telefone: '(11) 98888-7777' });
    expect(erros).toHaveLength(0);
  });

  it('acumula um erro por campo quando todos os obrigatórios faltam', async () => {
    const erros = await validar({});
    const campos = erros.map((e) => e.property);
    expect(campos).toEqual(
      expect.arrayContaining([
        'nome_empresa',
        'cnpj',
        'endereco',
        'telefone',
        'email',
        'contato_principal',
      ]),
    );
  });

  it('rejeita CNPJ com formato inválido', async () => {
    const erros = await validar({ ...payloadValido, cnpj: '12345678000190' });
    const erroCnpj = erros.find((e) => e.property === 'cnpj');
    expect(erroCnpj?.constraints?.matches).toBe('cnpj deve estar no formato 00.000.000/0000-00.');
  });

  it('rejeita e-mail inválido', async () => {
    const erros = await validar({ ...payloadValido, email: 'nao-e-email' });
    const erroEmail = erros.find((e) => e.property === 'email');
    expect(erroEmail?.constraints?.isEmail).toBe('email deve ser um endereço de e-mail válido.');
  });

  it('rejeita telefone com formato inválido', async () => {
    const erros = await validar({ ...payloadValido, telefone: '11 3333 4444' });
    expect(erros.some((e) => e.property === 'telefone')).toBe(true);
  });
});
