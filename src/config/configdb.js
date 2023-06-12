const { Pool } = require('pg')
 
const pool = new Pool({
  user: 'yandoko',
  host: 'localhost',
  database: 'belajarsql',
  password: '12345678',
})

module.exports = pool