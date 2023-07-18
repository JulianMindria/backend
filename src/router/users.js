const express = require('express')
const route = express.Router()
const ctrl = require('../controller/users')
const bodyparser = require('body-parser')
const authCheck = require('../middleware/authcheck')

route.get('/', authCheck('user', 'admin'), ctrl.getData)
route.get('/all', ctrl.getUser)
route.post('/',bodyparser.json() ,ctrl.saveData)
route.patch('/', ctrl.updateData)
route.delete('/', ctrl.deleteData)

module.exports = route