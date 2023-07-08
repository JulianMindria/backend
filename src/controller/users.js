const ctrl = {}
const response = require('../helper/respon')
const models = require('../model/users')
const hash = require('../helper/hash')

ctrl.getData = async (req, res) => {
    try {
        const result = await models.getByUser(req.query.username)
        console.log(result)
        return response(res, 200, result)
    } catch (error) {
        console.log(error)
        return response(res, 500, error.message)
    }
}

ctrl.getUser = async (req, res) => {
    try{
        const result = await models.SelectUser()
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}


ctrl.saveData = async (req, res) => {
    try{
        const hashPassword = await hash(req.body.post.password)
        const params = {
            ...req.body.post,
            password: hashPassword
        }
        const result = await models.addUser(params)
        return response(res, 200, result)
    } catch (error) {
        console.log(error)
        return response(res, 500, error.message)
}
}


ctrl.updateData = async (req, res) => {
    try{
        const {username, password, email, user_id} = req.body
        const result = await models.updateUser({username, password, email, user_id})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the database models")
    }
}

ctrl.deleteData = async (req, res) => {
    try{
        const {user_id} = req.body
        const result = await models.deleteUser({user_id})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the database models")
    }
}

module.exports = ctrl