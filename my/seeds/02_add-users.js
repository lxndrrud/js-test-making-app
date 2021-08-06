const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex.insert([
      {
        login: 'admin',
        password: bcrypt.hashSync('12345', 7),
        name: 'Alexander',
        surname: 'Rud',
        role_title: 'Administrator'
      },
      {
        login: 'user',
        password: bcrypt.hashSync('12345', 7),
        name: 'Alexander',
        surname: 'Rud',
        role_title: 'Operator'
      }
      ]).into('users');
    });
};
