const express = require('express');
const app = express();
const {
    getTopics,
    getEndpoints,
} = require('./controllers/topics')


app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)


app.use((err, request, response, next) => {


    response.status(500).send({msg: 'Internal server error!' })
})

module.exports = app