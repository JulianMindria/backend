const express = require('express')
const route = express.Router()
const movies = require('./movie')
const genres = require('./genre')
const schedules = require('./schedule')
const booking = require('./booking')
const loginUser = require('./users')
const auth = require('./auth')
const upload = require('./upload')
const insertGenre = require('./insertGenre')

route.use('/upload', upload)
route.use('/movie', movies)
route.use('/genre', genres)
route.use('/schedule', schedules)
route.use('/booking', booking)
route.use('/user', loginUser)
route.use('/auth', auth)
route.use('/genres', insertGenre)


module.exports = route