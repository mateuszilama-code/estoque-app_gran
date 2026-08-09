import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CategoriaProduto } from '../enums/categoria-produto.enum';
import { CreateProdutoDto } from './create-produto.dto';

/**
 * Testes de validação do CreateProdutoDto — cobrem o cenário "dados inválidos"
 * do desafio (mensagens de erro por campo). Usa o mesmo pipeline do ValidationPipe
 * global (plainToInstance + validate).
 */
describe('CreateProdutoDto (validação)', () => {
  const payloadValido = {
    nome: 'Notebook 14"',
    codigo_barras: '7891000100001',
    descricao: 'Notebook para uso corporativo, 16GB RAM.',
    quantidade_estoque: 15,
    categoria: CategoriaProduto.ELETRONICOS,
    data_validade: '2027-01-31',
    imagem_url: 'https://cdn.exemplo.com/produtos/notebook.png',
  };

  const validar = (payload: Record<string, unknown>) =>
    validate(plainToInstance(CreateProdutoDto, payload));

  it('aceita um payload válido completo (sem erros)', async () => {
    const erros = await validar(payloadValido);
    expect(erros).toHaveLength(0);
  });

  it('aceita apenas os obrigatórios (opcionais omitidos)', async () => {
    const erros = await validar({
      nome: 'Camiseta Básica',
      descricao: 'Camiseta de algodão, unissex.',
      categoria: CategoriaProduto.VESTUARIO,
    });
    expect(erros).toHaveLength(0);
  });

  it('acumula um erro por campo quando os obrigatórios faltam', async () => {
    const erros = await validar({});
    const campos = erros.map((e) => e.property);
    expect(campos).toEqual(expect.arrayContaining(['nome', 'descricao', 'categoria']));
  });

  it('rejeita categoria fora da lista pré-definida', async () => {
    const erros = await validar({ ...payloadValido, categoria: 'Bebidas' });
    const erroCategoria = erros.find((e) => e.property === 'categoria');
    expect(erroCategoria?.constraints?.isEnum).toBe(
      'categoria deve ser uma de: Eletrônicos, Alimentos, Vestuário, Outro.',
    );
  });

  it('rejeita código de barras com formato inválido', async () => {
    const erros = await validar({ ...payloadValido, codigo_barras: '123' });
    const erroCodigo = erros.find((e) => e.property === 'codigo_barras');
    expect(erroCodigo?.constraints?.matches).toBe(
      'codigo_barras deve conter de 8 a 14 dígitos numéricos.',
    );
  });

  it('rejeita quantidade_estoque negativa', async () => {
    const erros = await validar({ ...payloadValido, quantidade_estoque: -1 });
    const erroQtd = erros.find((e) => e.property === 'quantidade_estoque');
    expect(erroQtd?.constraints?.min).toBe('quantidade_estoque não pode ser negativa.');
  });

  it('rejeita data_validade com formato inválido', async () => {
    const erros = await validar({ ...payloadValido, data_validade: '31/01/2027' });
    expect(erros.some((e) => e.property === 'data_validade')).toBe(true);
  });
});
