const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const routers = require('./src/router/index')
const db = require('./src/config/configdb')
require('dotenv').config()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(routers)

db.connect()
    .then(()=>{ 
        app.listen(process.env.PORT, () => {
            console.log('listening on port 8333')
        })
         
    })
    .catch((e)=>{
        console.log("can't reach port 8333")
})



