const ctrl = {}
const response = require('../helper/respon')
const models = require('../model/booking')

ctrl.getData = async (req, res) => {
    try {
        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            orderBy: req.query.orderBy || 'booking_id',
            search: req.query.search
        }
        const result = await models.selectBooking(params)
        return response(res, 200, result)
    } catch (error) {
        console.log(error)
        return response(res, 500, error.message)
    }
}

ctrl.saveData = async (req, res) => {
    try{
        const {schedule_id, email, username, phone_number, seat_number} = req.body
        const result = await models.addBooking({schedule_id, email, username, phone_number, seat_number})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}

ctrl.updateData = async (req, res) => {
    try{
        const {booking_id, seat_number} = req.body
        const result = await models.updateBooking({booking_id, seat_number})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}

ctrl.deleteData = async (req, res) => {
    try{
        const {booking_id} = req.body
        const result = await models.deleteBooking({booking_id})
        return res.status(200).json(result)
    } catch (error) {
        console.log("communication failed, check the route")
    }
}


module.exports = ctrl