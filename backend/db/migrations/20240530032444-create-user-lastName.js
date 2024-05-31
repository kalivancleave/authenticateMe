'use strict';

let options = {};
options.tableName = "Users";

if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, 'lastName');
  }
};
