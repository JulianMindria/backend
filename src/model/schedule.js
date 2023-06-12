const model = {}
const db = require('../config/configdb')
const concat = require('pg-format')


model.selectSchedule = async ({ page, limit, orderBy, search }) => {
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if (search) {
            filterQuery += concat('AND schedule_id = %L', search)
        }

        if (orderBy) {
            orderQuery += concat('ORDER BY %s ASC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += concat('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(schedule_id) as "count" FROM public.schedules WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
            sch.schedule_id,
            sch.studio,
            json_agg(
                JSONB_BUILD_OBJECT(
                    'movie name', mv.title,
                    'synopsis', mv.synopsis 
                )
            ) as movie,
            sch.time_start,
            sch.time_end,
            sch.available_seats
            FROM public.schedules sch
            JOIN public.movies mv ON sch.movie_id = mv.movie_id
            WHERE true ${filterQuery}
            GROUP BY sch.schedule_id
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


model.addSchedule = async ({movie_id, studio, time_start, time_end, available_seats}) => {
    return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO public.schedules (movie_id, studio, time_start, time_end, available_seats) VALUES($1, $2, $3, $4, $5);`,
            [movie_id, studio, time_start, time_end, available_seats]
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

model.updateSchedule = async ({schedule_id, studio}) => {
    return new Promise ((resolve, reject) => {
        db.query(`UPDATE public.schedules SET studio = $1 WHERE schedule_id = $2; `,
            [studio, schedule_id]
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

model.deleteSchedule = async ({schedule_id}) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.schedules WHERE schedule_id = $1;`, [schedule_id])
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