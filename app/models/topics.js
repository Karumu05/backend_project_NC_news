const db = require('../../db/connection');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'No topics exist'})
        }
        return result.rows
    })
}