const db = require("../../db/connection");


exports.selectArticleById = (article_id) => {

  const queryStr = `SELECT
  articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
  CAST(COUNT(comments.article_id) AS INT) AS comment_count
FROM
  articles
LEFT JOIN
  comments ON articles.article_id = comments.article_id
WHERE
  articles.article_id = $1
GROUP BY
  articles.article_id;`

  return db
    .query(queryStr, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return result.rows;
    });
};

exports.getArticlesWithCommentCount = (topic, sort_by = 'created_at', order = 'desc') => {

  const acceptedQueries = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'comment_count']

  if(!acceptedQueries.includes(sort_by)){
    return Promise.reject({status: 400, msg: 'Bad request'})
  }

  if(!['asc', 'desc'].includes(order)){
    return Promise.reject({status: 400, msg: 'Bad request'})
  }

  let queryStr = ` 
SELECT
    articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
FROM
    articles
LEFT JOIN
    comments ON articles.article_id = comments.article_id `

  if(topic){
    queryStr += 
    `WHERE articles.topic = $1
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order}`

    return db.query(queryStr, [topic])
      .then(({rows, rowCount}) => {
        if(rowCount === 0){
          return Promise.reject({status: 200, msg: 'No articles with this topic'})
        }
        return rows
      })
  } else {
    queryStr +=
    `GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`

    return db.query(queryStr)
    
    .then(({rows}) => {
      return rows
    })
  }
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
