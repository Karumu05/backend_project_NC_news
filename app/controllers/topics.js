const {
    selectTopics,
} = require('../models/topics')
const endpoints = require("../../endpoints.json")

exports.getTopics = (request, response, next) => {
    selectTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}
exports.getEndpoints = (request, response, next) => {
 response.status(200).send({endpoints})
}