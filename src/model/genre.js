const model = {}
const db = require('../config/configdb')

model.selectGenre = async () => {
    return new Promise ((resolve, reject) => {
        db.query('SELECT * FROM public.genres ORDER BY genre_id ASC')
        .then((res)=>{
            resolve({data: res.rows})
        })
        .catch((er)=>{
            console.log("There is something wrong with your query")
            reject("unexpected output")
        })

    })
}

model.addGenre = async ({list_genres}) => {
    return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO public.genres (list_genres) VALUES($1);`,
            [list_genres]
            )
        .then((res)=>{
            resolve(res.rowCount)
        })
        .catch((er)=>{
            console.log("There is something wrong with your query")
            reject("unexpected output")
        })

    })
}

model.updateGenre = async ({id, list_genres}) => {
    return new Promise ((resolve, reject) => {
        db.query(`UPDATE public.genres SET list_genres = $1 WHERE id = $2; `,
            [list_genres, id]
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

model.deleteGenre = async ({id}) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.genres WHERE id = $1;`, [id])
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