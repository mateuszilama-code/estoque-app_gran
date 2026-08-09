'use strict';

/**
 * Seeder de exemplo: 2 fornecedores e 3 produtos (categorias do PDF:
 * Eletrônicos, Alimentos, Vestuário). Não cria associações — isso é exercitado
 * pelos endpoints da Etapa 6.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('fornecedores', [
      {
        nome_empresa: 'Tech Distribuidora LTDA',
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua das Palmeiras, 100 - São Paulo/SP',
        telefone: '(11) 3333-4444',
        email: 'contato@techdistribuidora.com',
        contato_principal: 'Ana Souza',
        created_at: now,
        updated_at: now,
      },
      {
        nome_empresa: 'Alimentos Brasil S.A.',
        cnpj: '98.765.432/0001-10',
        endereco: 'Av. Central, 2500 - Campinas/SP',
        telefone: '(19) 2222-1111',
        email: 'vendas@alimentosbrasil.com',
        contato_principal: 'Carlos Lima',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('produtos', [
      {
        nome: 'Notebook 14"',
        codigo_barras: '7891000100001',
        descricao: 'Notebook para uso corporativo, 16GB RAM.',
        quantidade_estoque: 15,
        categoria: 'Eletrônicos',
        data_validade: null,
        imagem_url: null,
        created_at: now,
        updated_at: now,
      },
      {
        nome: 'Café Torrado 500g',
        codigo_barras: '7891000200002',
        descricao: 'Café torrado e moído, pacote de 500g.',
        quantidade_estoque: 120,
        categoria: 'Alimentos',
        data_validade: '2027-01-31',
        imagem_url: null,
        created_at: now,
        updated_at: now,
      },
      {
        nome: 'Camiseta Básica',
        codigo_barras: '7891000300003',
        descricao: 'Camiseta de algodão, unissex, cor branca.',
        quantidade_estoque: 60,
        categoria: 'Vestuário',
        data_validade: null,
        imagem_url: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    // Remove os dados de exemplo (ordem inversa por segurança).
    await queryInterface.bulkDelete('produtos', null, {});
    await queryInterface.bulkDelete('fornecedores', null, {});
  },
};
