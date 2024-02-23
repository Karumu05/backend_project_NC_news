const db = require("../../db/connection");


exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return result.rows;
    });
};

exports.getArticlesWithCommentCount = (topic) => {
  const queryVals = [];
  let queryStr = ` 
SELECT
    articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
FROM
    articles
LEFT JOIN
    comments ON articles.article_id = comments.article_id`;

  if(topic){
    queryStr += ` WHERE articles.topic = $1`
    queryVals.push(topic)
  }

  queryStr += ` GROUP BY
    articles.article_id
ORDER BY
    articles.created_at DESC;`;

  return db.query(queryStr, queryVals).then((result) => {

    return result.rows;
  });
};

exports.selectCommentById = (article_id) => {
  return db.query(
      `
SELECT
 comment_id, votes, created_at, author, body, article_id
FROM 
 comments
WHERE
 article_id = $1
ORDER BY
 created_at DESC;
`,[article_id])
    .then((result) => {
  

      return result.rows;
    });
};

exports.insertCommentToArticle = (body, article_id) => {


if (!body.username || !body.body || !article_id){
  return Promise.reject({status: 400, msg: 'Bad request'})
}

  const queryVals = [article_id, body.username, body.body];

  const queryStr = `
INSERT INTO 
  comments (article_id, author, body)
VALUES
  ($1, $2, $3)
RETURNING *;`;

  return db.query(queryStr, queryVals).then((result) => {
    return result.rows;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
return db.query(
  `UPDATE articles
  SET votes = $1
  WHERE article_id = $2
  RETURNING *
  `, [inc_votes, article_id])
  .then((result) => {
    return result.rows
  })
}
