'use strict';

const {User} = require('../models');
const bcrypt = require("bcryptjs");
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const users = [
  {
    email: 'demo@user.io',
    firstName: 'Demo',
    lastName: 'Lition',
    username: 'Demo-lition',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'user1@user.io',
    firstName: 'Fake',
    lastName: 'UserA',
    username: 'FakeUserA',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    email: 'user2@user.io',
    firstName: 'Fake',
    lastName: "UserB",
    username: 'FakeUserB',
    hashedPassword: bcrypt.hashSync('password3')
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    options.validate = true;
    await User.bulkCreate(users, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2']
      }
    }, {});
  }
};
