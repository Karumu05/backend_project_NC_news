const express = require('express');
const app = express();
const {
    getTopics,
    getEndpoints,
} = require('./controllers/topics')
const {
    getArticleById,
    getAllArticles,
    getCommentsByArticle,
    postCommentByArticle,
} = require('./controllers/articles.controller')

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.post('/api/articles/:article_id/comments', postCommentByArticle)


app.use((err, request, response, next) => {

    if (err.code === '23503'){
        response.status(404).send({msg: 'Not found'})
    }

    if (err.code === '22P02'){
        response.status(400).send({msg: 'Bad request'})
    }

    if(err.status && err.msg){
        response.status(err.status).send({msg: err.msg})
    }

    response.status(500).send({msg: 'Internal server error!' })
})

module.exports = app