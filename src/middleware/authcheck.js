const check = {}
const respon = require('../helper/respon')
const jwt = require('jsonwebtoken')

check.userCheck = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return respon (res, 401, 'You need to login first')
    }

    const token = authorization.replace('Bearer ', '')
    
    jwt.verify(token, process.env.USER_KEY, (err, decode) => {
            if (err) {
                return respon (res, 401, err)
            }
            console.log(decode)
            req.user = decode.data
            return next()
    } )
}

check.adminCheck = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return respon (res, 401, 'You need to login first')
    }

    const token = authorization.replace('Bearer ', '')
    
    jwt.verify(token, process.env.ADMIN_KEY, (err, decode) => {
            if (err) {
                return respon (res, 401, err)
            }
            console.log(decode)
            req.user = decode.data
            return next()
    } )
}

module.exports = check