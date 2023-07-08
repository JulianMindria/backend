const express = require('express')
const route = express.Router()
const ctrl = require('../controller/movie')
const check = require('../middleware/authcheck')
const upload_image = require('../middleware/upload')

route.get('/', ctrl.getData)
route.get('/:movie_id', ctrl.getID)
route.post('/', check.adminCheck, upload_image.single('image'), ctrl.saveData)
route.patch('/', ctrl.updateData)
route.delete('/', ctrl.deleteData)



module.exports = route