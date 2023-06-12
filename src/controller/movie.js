const ctrl = {}
const response = require('../helper/respon')
const models = require('../model/movie')

ctrl.getData = async (req, res) => {
    try {
        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            orderBy: req.query.orderBy || 'date_released',
            search: req.query.search
        }
        const result = await models.selectProduct(params)
        return response(res, 200, result)
    } catch (error) {
        console.log(error)
        return response(res, 500, error.message)
    }
}

ctrl.saveData = async (req, res) => {
    try{
        if (req.file !== undefined){
            req.body.poster = req.file.path
        }
        const {title, synopsis, date_released, duration, director, casts, genre_id, poster} = req.body
        const result = await models.addProduct({title, synopsis, date_released, duration, director, casts, genre_id, poster})
        return res.status(200).json(result)
    } catch (error) {
        return response(res, 401, error.message)
    }
}

ctrl.updateData = async (req, res) => {
    try{
        const {movie_id, date_released, genre_id} = req.body
        const result = await models.updateProduct({movie_id, date_released, genre_id})
        return res.status(200).json(result)
    } catch (error) {
        return response(res, 401, error.message)
    }
}

ctrl.deleteData = async (req, res) => {
    try{
        const {movie_id} = req.body
        const result = await models.deleteProduct({movie_id})
        return res.status(200).json(result)
    } catch (error) {
        return response(res, 401, error.message)
    }
}

module.exports = ctrl