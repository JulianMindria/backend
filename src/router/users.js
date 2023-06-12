const express = require('express')
const route = express.Router()
const ctrl = require('../controller/users')

route.get('/', ctrl.getData)
route.post('/', ctrl.saveData)
route.patch('/', ctrl.updateData)
route.delete('/', ctrl.deleteData)

module.exports = route