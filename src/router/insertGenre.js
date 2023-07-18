const express = require('express')
const route = express.Router()
const ctrl = require('../controller/insertGenre')

route.post('/', ctrl.saveData)
route.patch('/', ctrl.updateData)

module.exports = route