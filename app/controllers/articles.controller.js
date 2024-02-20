const {
    selectArticleById,
    getArticlesWithCommentCount,
    selectCommentById,
} = require('../models/articles.model')

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
    selectArticleById(article_id).then((result) => {
        response.status(200).send({article: result})
    })
    .catch((error) => {
        next(error)
    })
}

exports.getAllArticles = (request, response, next) => {
    const {author, topic} = request.query
    getArticlesWithCommentCount(author, topic).then((result) => {
        response.status(200).send({articles: result})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCommentsByArticle = (request, response, next) => {
    const {article_id} = request.params
    selectCommentById(article_id).then((result) => {
        response.status(200).send({comments: result})
    })
    .catch((error) => {
        next(error)
    })
}