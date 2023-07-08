const express = require('express')
const route = express.Router()
const ctrl = require('../controller/users')
const bodyparser = require('body-parser')

route.get('/', ctrl.getData)
route.get('/all', ctrl.getUser)
route.post('/',bodyparser.json() ,ctrl.saveData)
route.patch('/', ctrl.updateData)
route.delete('/', ctrl.deleteData)

module.exports = route