'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produtos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      codigo_barras: {
        type: Sequelize.STRING,
        allowNull: true, // opcional
        unique: true, // único quando informado (SQLite permite múltiplos NULL)
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      quantidade_estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      categoria: {
        type: Sequelize.STRING,
        allowNull: false, // Eletrônicos | Alimentos | Vestuário | Outro
      },
      data_validade: {
        type: Sequelize.DATEONLY,
        allowNull: true, // "se aplicável"
      },
      imagem_url: {
        type: Sequelize.STRING,
        allowNull: true, // "se aplicável"
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('produtos');
  },
};
