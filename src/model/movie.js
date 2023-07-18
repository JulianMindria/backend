const model = {}
const db = require('../config/configdb')
const concat = require('pg-format')
const moment = require('moment')


model.selectProduct = async ({ page, limit, orderBy, search, genre}) => {
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if (search || genre) {
            filterQuery += search ? concat('AND title = %L', search) : ''
            filterQuery += genre ? concat('AND LOWER(g.genre_name) = LOWER(%L)', genre) : ''
        }

        if (orderBy) {
            orderQuery += concat('ORDER BY %s ASC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += concat('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(
        `SELECT COUNT(mv.movie_id) as "count" 
        FROM public.movies mv
        JOIN public.genreName gm ON gm.movie_id = mv.movie_id
        JOIN public.genres g ON gm.genre_id = g.genre_id
        WHERE true ${filterQuery}`)
        .then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                mv.movie_id,
                mv.synopsis,
                mv.movie_banner,
                mv.title,
                mv.casts,
                mv.director,
                string_agg(g.genre_name, ', ') AS genres,
                mv.duration,
                mv.date_released
            FROM public.movies mv
            JOIN public.genreName gm ON gm.movie_id = mv.movie_id
            JOIN public.genres g ON gm.genre_id = g.genre_id
            WHERE true ${filterQuery}
            GROUP BY mv.movie_id
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
            data.rows.map((v) => {
                const date = moment(v.date_released)
                v.date_released = date.format('DD MMMM YYYY')
            })
            return { data: data.rows, meta }
        }
    } catch (error) {
        throw error
    }
}

model.getDataID = (movie_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT 
                mv.movie_id,
                mv.synopsis,
                mv.movie_banner,
                mv.title,
                mv.casts,
                mv.director,
                string_agg(g.genre_name, ', ') AS genres,
                mv.duration,
                mv.date_released
            FROM public.movies mv
            JOIN public.genreName gm ON gm.movie_id = mv.movie_id
            JOIN public.genres g ON gm.genre_id = g.genre_id
            WHERE mv.movie_id = $1
            GROUP BY mv.movie_id`, [movie_id])
        .then((res)=>{
            res.rows.map((v) => {
                const date = moment(v.date_released)
                v.date_released = date.format('DD MMMM YYYY')})
            resolve({data: res.rows})
        })
        .catch((er)=>{
            reject(er)
        })
    })
}

model.addProduct = async ({ title, synopsis, date_released, duration, director, casts, movie_banner, genre }) => {
    const pg = await db.connect()
    try {
        await pg.query('BEGIN')

        const movie = await pg.query(
            `INSERT INTO public.movies
                (title, synopsis, date_released, duration, director, casts, movie_banner)
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING movie_id`,
            [title, synopsis, date_released, duration, director, casts, movie_banner]
        )

        if (genre && genre.length > 0) {
            genre.map(async (v) => {
                return await pg.query(
                    `
                    INSERT INTO public.genreName
                        (movie_id, genre_id)
                    VALUES($1, $2)`,
                    [movie.rows[0].movie_id, v]
                )
            })
        }

        await pg.query('COMMIT')
        return `${movie.rowCount} data movie created`
    } catch (error) {
        await pg.query('ROLLBACK')
        throw error
    }
}

// model.addProduct = async ({title, synopsis, date_released, duration, director, casts, movie_banner}) => {
//     return new Promise ((resolve, reject) => {
//         db.query(`INSERT INTO public.movies (title, synopsis, date_released, duration, director, casts, movie_banner) VALUES($1,$2,$3,$4,$5,$6,$7);`,
//             [title, synopsis, date_released, duration, director, casts, movie_banner]
//             )
//         .then((res)=>{
//             resolve("operation running succesfully")
//         })
//         .catch((er)=>{
//             console.log(er)
//             reject("unexpected output")
//         })

//     })
// }

// model.updateProduct = async ({movie_id, title, synopsis, date_released, duration, director, casts, genre_id}) => {
//     return new Promise ((resolve, reject) => {
//         db.query(`UPDATE public.movies SET date_released = $1, genre_id = $2, title = $3, synopsis = $4, duration = $5, director = $6, casts = $7 WHERE movie_id = $8; `,
//             [date_released, genre_id, title, synopsis, duration, director, casts, movie_id]
//             )
//         .then((res)=>{
//             resolve("operation running succesfully")
//         })
//         .catch((er)=>{
//             console.log("There is something wrong with your query")
//             reject("unexpected output")
//         })

//     })
// }

model.updateProduct = async ({ title, synopsis, date_released, duration, director, casts, movie_banner, movie_id, genre}) => {
    const pg = await db.connect()
    try {
        await pg.query('BEGIN')
        const movie = await pg.query(
            `UPDATE public.movies SET
                date_released = $1, movie_banner = $2, title = $3, synopsis = $4, duration = $5, director = $6, casts = $7 
            WHERE movie_id = $8`,
            [date_released, movie_banner, title, synopsis, duration, director, casts, movie_id]
        )

        if (genre && genre.length > 0) {
            genre.map(async (v) => {
                return await pg
                    .query(
                        `
                    UPDATE public.genreName SET
                        genre_id = $1
                    WHERE movie_id = $2`,
                        [v, movie_id]
                    )
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }

        await pg.query('COMMIT')
        return `${movie.rowCount} data movie updated`
    } catch (error) {
        await pg.query('ROLLBACK')
        throw error
    }
}

model.deleteProduct = async ({movie_id}) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.movies WHERE movie_id = $1;`, [movie_id])
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