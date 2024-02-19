const {
    selectArticleById,
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