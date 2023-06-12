const ctrl = {}
const userModel = require('../model/users')
const response = require('../helper/respon')
const bcrypt = require("bcryptjs/dist/bcrypt")
const jwt = require('../helper/jwt')

ctrl.Login = async (req, res) => {
    try {
        const passDb = await userModel.getByUser(req.body.username)

        if (passDb.length <= 0) {
            return response(res, 401, 'username tidak terdaftar')
        }

        const passUser = req.body.password
        const check = await bcrypt.compare(passUser, passDb[0].password)

        if (check) {
            const token = jwt.genToken(req.body.username)
            return response(res, 200, {
                message: 'token created',
                token
            })
        } else {
            return response(res, 401, 'password salah')
        }
    } catch (error) {
        console.log(error)
        return response(res, 500, error.message)
    }
}


module.exports = ctrl