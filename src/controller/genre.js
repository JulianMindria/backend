const ctrl = {}

const models = require('../model/genre')

ctrl.getData = async (req, res) => {
    try{
        const result = await models.selectGenre()
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}

ctrl.saveData = async (req, res) => {
    try{
        const {list_genres} = req.body
        const result = await models.addGenre({list_genres})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}

ctrl.updateData = async (req, res) => {
    try{
        const {id, list_genres} = req.body
        const result = await models.updateGenre({id, list_genres})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}

ctrl.deleteData = async (req, res) => {
    try{
        const {id} = req.body
        const result = await models.deleteGenre({id})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}


module.exports = ctrl