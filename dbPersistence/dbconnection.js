var mysql = require('mysql');
var util = require('util')

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'sivakumar',
    password: '',
    database: 'ExpenseAppDataBase'
})

var connectTomysql = function(){
  pool.getConnection((err, connection) => {
      if (err) {
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
              console.error('Database connection was closed.')
          }
          if (err.code === 'ER_CON_COUNT_ERROR') {
              console.error('Database has too many connections.')
          }
          if (err.code === 'ECONNREFUSED') {
              console.error('Database connection was refused.')
          }
      }
      if (connection) connection.release()
      return connection
  })
}
pool.query = util.promisify(pool.query)

module.exports =
{
  connectTomysql : connectTomysql,
  pool : pool,
}
