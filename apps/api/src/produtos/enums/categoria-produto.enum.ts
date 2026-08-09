/**
 * Categorias de produto previstas no desafio (lista pré-definida do PDF).
 * Usada como enum de validação no DTO e como tipo do campo `categoria` na entity.
 */
export enum CategoriaProduto {
  ELETRONICOS = 'Eletrônicos',
  ALIMENTOS = 'Alimentos',
  VESTUARIO = 'Vestuário',
  OUTRO = 'Outro',
}
