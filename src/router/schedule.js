const express = require('express')
const route = express.Router()
const ctrl = require('../controller/schedule')
const check = require('../middleware/authcheck')

route.get('/', check.userCheck, ctrl.getData)
route.post('/', ctrl.saveData)
route.patch('/', ctrl.updateData)
route.delete('/', ctrl.deleteData)

module.exports = route