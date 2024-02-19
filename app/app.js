const express = require('express');
const app = express();
const {
    getTopics,
    getEndpoints,
} = require('./controllers/topics')
const {
    getArticleById,
} = require('./controllers/articles.controller')


app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)


app.use((err, request, response, next) => {

    if (err.code === '22P02'){
        response.status(400).send({msg: 'Bad request'})
    }

    if(err.status && err.msg){
        response.status(err.status).send({msg: err.msg})
    }

    response.status(500).send({msg: 'Internal server error!' })
})

module.exports = app