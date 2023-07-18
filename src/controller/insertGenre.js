const ctrl = {}

const models = require('../model/insertGenre')


ctrl.saveData = async (req, res) => {
    try{
        const {movie_id, genre_id} = req.body
        const result = await models.addGenre({movie_id, genre_id})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}

ctrl.updateData = async (req, res) => {
    try{
        const {movie_id, genre_id} = req.body
        const result = await models.updateGenre({movie_id, genre_id})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}



module.exports = ctrl