const express = require('express')
const route = express.Router()
const ctrl = require('../controller/movie')
const check = require('../middleware/authcheck')
const upload = require('../middleware/upload')

route.get('/', ctrl.getData)
route.get('/:movie_id', ctrl.getID)
route.post('/', upload.single("movie_banner"), ctrl.saveData)
route.patch('/', upload.single("movie_banner"), ctrl.updateData)
route.delete('/', ctrl.deleteData)



module.exports = route