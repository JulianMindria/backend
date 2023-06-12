const ctrl = {}
const response = require('../helper/respon')
const models = require('../model/schedule')

ctrl.getData = async (req, res) => {
    try {
        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            orderBy: req.query.orderBy || 'schedule_id',
            search: req.query.search
        }
        const result = await models.selectSchedule(params)
        return response(res, 200, result)
    } catch (error) {
        console.log(error)
        return response(res, 500, error.message)
    }
}
ctrl.saveData = async (req, res) => {
    try{
        const {movie_id, studio, time_start, time_end, available_seats} = req.body
        const result = await models.addSchedule({movie_id, studio, time_start, time_end, available_seats})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the database models")
    }
}

ctrl.updateData = async (req, res) => {
    try{
        const {schedule_id, studio} = req.body
        const result = await models.updateSchedule({schedule_id, studio})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the database models")
    }
}

ctrl.deleteData = async (req, res) => {
    try{
        const {schedule_id} = req.body
        const result = await models.deleteSchedule({schedule_id})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the database models")
    }
}


module.exports = ctrl