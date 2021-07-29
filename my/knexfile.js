/*const knex = require('knex');
const config = {
    client: 'mysql2',
    connection: {
      host : 'db-basic',
      user : 'dbbasic',
      password : 'mysql_pass',
      port: 3306,
      database : 'mydb'
    }
};
const db = knex(config);

function dbInit(){
  knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('login');
    table.string('password');
  }).then(() => {console.log('table created!')})
  .catch((err) => { console.log(err); throw err });
}
*/

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host : 'db-basic',
      user : 'dbbasic',
      password : 'mysql_pass',
      port: 3306,
      database : 'mydb'
    },
    useNullAsDefault: true
  }
}


