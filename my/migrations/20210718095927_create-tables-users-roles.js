
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('roles', (tbl) => {
    tbl.increments('id').primary();
    tbl.string('title', 55).notNullable();
    tbl.json('permissions').notNullable();
  })
  .createTable('users', (tbl) => {
    tbl.string('login', 100).notNullable().primary();
    tbl.string('password', 255).notNullable();
    tbl.string('name', 55).notNullable();
    tbl.string('surname', 55).notNullable();
    tbl.integer('role_id').unsigned().notNullable();
    tbl.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE').onUpdate('CASCADE');
  })
  .createTable('tests', (tbl) => {
    tbl.increments('id').primary();
    tbl.json('content').notNullable();
    tbl.timestamps(false, true);
    tbl.string('creator_login', 100).notNullable();
    tbl.foreign('creator_login').references('login').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
  });

  
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('tests')
  .dropTableIfExists('users')
  .dropTableIfExists('roles');
};
