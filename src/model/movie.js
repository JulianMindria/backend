const model = {}
const db = require('../config/configdb')
const concat = require('pg-format')


model.selectProduct = async ({ page, limit, orderBy, search}) => {
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if (search) {
            filterQuery += concat('AND title = %L', search)
        }

        if (orderBy) {
            orderQuery += concat('ORDER BY %s ASC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += concat('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(movie_id) as "count" FROM public.movies WHERE true ${filterQuery}`).then((v) => {
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
                mv.duration,
                mv.date_released,
                mv.genre_id
            FROM public.movies mv
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
            return { data: data.rows, meta }
        }
    } catch (error) {
        throw error
    }
}

model.getDataID = (movie_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.movies WHERE movie_id = $1', [movie_id])
        .then((res)=>{
            resolve({data: res.rows})
        })
        .catch((er)=>{
            reject(er)
        })
    })
}

model.addProduct = async ({title, synopsis, date_released, duration, director, casts, genre_id, poster}) => {
    return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO public.movies (title, synopsis, date_released, duration, director, casts, genre_id, movie_poster) VALUES($1,$2,$3,$4,$5,$6,$7,$8);`,
            [title, synopsis, date_released, duration, director, casts, genre_id, poster]
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

model.updateProduct = async ({movie_id, title, synopsis, date_released, duration, director, casts, genre_id}) => {
    return new Promise ((resolve, reject) => {
        db.query(`UPDATE public.movies SET date_released = $1, genre_id = $2, title = $3, synopsis = $4, duration = $5, director = $6, casts = $7 WHERE movie_id = $8; `,
            [date_released, genre_id, title, synopsis, duration, director, casts, movie_id]
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