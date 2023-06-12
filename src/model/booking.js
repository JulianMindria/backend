const model = {}
const db = require('../config/configdb')
const concat = require('pg-format')

model.selectBooking = async ({ page, limit, orderBy, search }) => {
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if (search) {
            filterQuery += concat('AND booking_id = %L', search)
        }

        if (orderBy) {
            orderQuery += concat('ORDER BY %s ASC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += concat('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(booking_id) as "count" FROM public.booking WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
            bk.booking_id,
            bk.seat_number,
            json_agg(
                JSONB_BUILD_OBJECT(
                    'username', u.username,
                    'email', u.email 
                )
            ) as user,
            json_agg(
                JSONB_BUILD_OBJECT(
                    'start', sch.time_start,
                    'end', sch.time_end,
                    'studio', sch.studio
                )
            ) as schedule
            FROM public.booking bk
            JOIN public.users u ON bk.user_id = u.user_id
            JOIN public.schedules sch ON bk.schedule_id = sch.schedule_id
            WHERE true ${filterQuery}
            GROUP BY bk.booking_id
            ${orderQuery} ${metaQuery}
        `)

        const meta = {
            next: count <= 0 ? null : page == Math.ceil(count / limit) ? null : Number(page) + 1,
            prev: page == 1 ? null : Number(page) - 1,
            total: count
        }

        if (data.rows <= 0) {
            return 'data not found'
        } else {
            return { data: data.rows, meta }
        }
    } catch (error) {
        throw error
    }
}

model.addBooking = async ({schedule_id, email, username, phone_number, seat_number}) => {
    return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO public.booking (schedule_id, email, username, phone_number, seat_number) VALUES($1, $2, $3, $4, $5);`,
            [schedule_id, email, username, phone_number, seat_number]
            )
        .then((res)=>{
            resolve("operation running succesfully")
        })
        .catch((er)=>{
            console.log("There is something wrong with your query")
            reject("unexpected output")
        })

    })
}

model.updateBooking = async ({booking_id, seat_number}) => {
    return new Promise ((resolve, reject) => {
        db.query(`UPDATE public.booking SET seat_number = $1 WHERE booking_id = $2; `,
            [seat_number, booking_id]
            )
        .then((res)=>{
            resolve("operation running succesfully")
        })
        .catch((er)=>{
            console.log("There is something wrong with your query")
            reject("unexpected output")
        })

    })
}

model.deleteBooking = async ({booking_id}) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.booking WHERE booking_id = $1;`, [booking_id])
        .then((res) => {
            resolve("operation running succesfully")
        })
        .catch((er) => {
            console.log("There is something wrong with your query")
            reject("unexpected output")
        })
    })

}



module.exports = model