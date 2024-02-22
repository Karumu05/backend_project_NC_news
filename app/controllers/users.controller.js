const db = require('../../db/connection')
const { checkExists } = require("../../db/seeds/utils");
const {
    selectAllUsers,
} = require('../models/users.model')

exports.getAllUsers = (request, response, next) => {
    db.query(`SELECT username FROM users`).then((result)=> {
        const user = result.rows[0]['username']
       return Promise.all([checkExists("users", "username", user),
        selectAllUsers()
    ])
    .then((result) => {
        response.status(200).send({users: result[1]})
    })

}).catch((error) => {
    next(error)
})
}