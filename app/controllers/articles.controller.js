const {
  selectArticleById,
  getArticlesWithCommentCount,
  selectCommentById,
  insertCommentToArticle,
  updateArticleVotes,
} = require("../models/articles.model");
const { checkExists } = require("../../db/seeds/utils");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((result) => {
      response.status(200).send({ article: result });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllArticles = async (request, response, next) => {
  const { topic } = request.query;

  if(topic){
    return Promise.all([checkExists("topics", "slug", topic), 
    getArticlesWithCommentCount(topic)
  ])
  .then((result) => {
    response.status(200).send({articles: result[1]})
  })
  .catch(next)
  }

 getArticlesWithCommentCount(topic)
    .then((result) => {
      response.status(200).send({ articles: result });
    })
    .catch((err) => {

      next(err);
    });
};

exports.getCommentsByArticle = (request, response, next) => {
  const { article_id } = request.params;

  return Promise.all([
    selectCommentById(article_id),
    checkExists("articles", "article_id", article_id),
  ])

    .then((result) => {
      response.status(200).send({ comments: result[0] });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCommentByArticle = (request, response, next) => {
  const { body } = request;
  const { article_id } = request.params;
  insertCommentToArticle(body, article_id)
    .then((result) => {
      response.status(201).send({ addedComment: result });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  return Promise.all([
    updateArticleVotes(article_id, inc_votes),
    checkExists("articles", "article_id", article_id),
  ])
    .then((result) => {
      response.status(201).send({ article: result[0] });
    })
    .catch((error) => {
      next(error);
    });
};
