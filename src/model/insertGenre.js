const model = {}
const db = require('../config/configdb')


model.addGenre = async ({movie_id, genre_id}) => {
    return new Promise ((resolve, reject) => {
        db.query(`INSERT INTO public.genreName VALUES($1, $2);`,
            [movie_id, genre_id]
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

model.updateGenre = async ({movie_id, genre_id}) => {
    return new Promise ((resolve, reject) => {
        db.query(`UPDATE public.genreName SET genre_id = $1 WHERE movie_id = $2; `,
            [genre_id, movie_id]
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



module.exports = model