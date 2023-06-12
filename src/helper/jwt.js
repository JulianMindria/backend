const jwt = require('jsonwebtoken')
const pool = require('../config/configdb')


const genToken = async (username) => {
    try {
      // Mendapatkan role pengguna dari database berdasarkan username
      const query = 'SELECT roles FROM public.users WHERE username = $1';
      const values = [username];
      const result = await pool.query(query, values);
      let key = ""

      if (result.rows.length > 0) {
        const role = result.rows[0].roles;
        console.log(role)
        if (role == 'user'){
          key = process.env.USER_KEY
        }

        else if (role == 'admin'){
          key = process.env.ADMIN_KEY
        }

        console.log("roles =", role)
        console.log("username =", username)

        // Membuat payload dengan role dari database
        const payload = {
          username: username,
          role: role,
        };

        // Menghasilkan token JWT dengan payload
        const token = await jwt.sign(payload, key, { expiresIn: '1h' });
        console.log(token)
        return token
        
      }
      
      else {
        throw new Error('User not found');
        }

      
      
    } catch (error) {
      throw new Error('Failed to generate token');
    }
  };
  
  module.exports = {
    genToken,
  };