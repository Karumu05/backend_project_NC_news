const db = require("../../db/connection");

exports.removeComment = (comment_id) => {
    const queryStr = `
    DELETE FROM
    comments
    WHERE 
    comment_id = $1`
    return db.query(queryStr, [comment_id])
}