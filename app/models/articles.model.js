const db = require("../../db/connection");
const { format } = require("pg-format");

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

exports.getArticlesWithCommentCount = (author, topic) => {
  const queryVals = [];
  let queryStr = ` 
SELECT
    articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
FROM
    articles
LEFT JOIN
    comments ON articles.article_id = comments.article_id`;

  if (author || topic) {
    queryStr += ` WHERE`;
    conditions = [];
    if (author) {
      conditions.push(`articles.author = $1`);
      queryVals.push(author);
    }

    if (topic) {
      conditions.push(` articles.topic=$2`);
      queryVals.push(topic);
    }

    queryStr += conditions.join(` AND `);
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
  return db
    .query(
      `
SELECT
 comment_id, votes, created_at, author, body, article_id
FROM 
 comments
WHERE
 article_id = $1
ORDER BY
 created_at DESC;
`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comments does not exist" });
      }
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
