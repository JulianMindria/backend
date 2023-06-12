const model = {}
const db = require('../config/configdb')

model.SelectUser = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((error) => {
                throw(error)
            })
    })
}

model.getByUser = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users WHERE username = $1', [username])
            .then((res) => {
                console.log(res.rows)
                resolve(res.rows)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.addUser = ({ username, password, email, roles }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO public.users (username, "password", email, roles) VALUES($1, $2, $3, $4);`,
            [username, password, email, roles]
        )
            .then((res) => {
                resolve(`${res.rowCount} user created`)
            })
            .catch((error) => {
                throw(error)
            })
    })
}

model.updateUser = async ({username, password, email, user_id}) => {
    return new Promise ((resolve, reject) => {
        db.query(`UPDATE public.users SET
                username = COALESCE(NULLIF($1, ''), username),
                password = COALESCE(NULLIF($2, ''), password),
                email = COALESCE(NULLIF($3, ''), email),
                updated_at = now()
                WHERE user_id = $4           
`,
            [username, password, email, user_id]
            )
        .then((res)=>{
            resolve(res.rows)
        })
        .catch((er)=>{
            console.log("There is something wrong with your query")
            reject("unexpected output")
        })

    })
}

model.deleteUser = async ({user_id}) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.schedules WHERE schedule_id = $1;`, [user_id])
        .then((res) => {
            resolve(res.rows)
        })
        .catch((er) => {
            console.log("There is something wrong with your query")
            reject("unexpected output")
        })
    })

}



module.exports = model