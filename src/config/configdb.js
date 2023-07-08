const { Pool } = require('pg')
 
const pool = new Pool({
  user: 'backendgo',
  host: 'localhost',
  database: 'tickitz',
  password: '12345678',
})

module.exports = pool