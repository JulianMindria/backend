const express = require('express')
const route = express.Router()
const ctrl = require('../controller/movie')
const check = require('../middleware/authcheck')
const upload_image = require('../middleware/upload')

route.get('/', check.userCheck, ctrl.getData)
route.post('/', check.adminCheck, upload_image.single('image'), ctrl.saveData)
route.patch('/', check.adminCheck, ctrl.updateData)
route.delete('/', check.adminCheck, ctrl.deleteData)



module.exports = route