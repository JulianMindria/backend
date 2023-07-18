const response = require('../helper/respon')
const jwt = require('jsonwebtoken')

const authCheck = (...roles) => {
    return (req, res, next) => {
        const { authorization } = req.headers
        let isValid = false

        if (!authorization) {
            return response(res, 401, 'silahkan login terlebih dahulu')
        }

        const token = authorization.replace('Bearer ', '')
        jwt.verify(token, process.env.SECRET, (err, decode) => {
            if (err) {
                return response(res, 401, err)
            }

            roles.forEach((v) => {
                if (v == decode.role) {
                    isValid = true
                    return
                }
            })


            if (isValid) {
                req.user = decode.data
                return next()
            } else {
                return response(res, 401, 'anda tidak punya akses')
            }
        })
    }
}

module.exports = authCheck