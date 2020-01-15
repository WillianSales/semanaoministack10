const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

// app. get, post, put, delete

// Tipos de parametros: 
// Query: request.query
// Route: request.params
// Body: request.body
const app = express();

mongoose.connect('mongodb+srv://m001-student:m001-mongodb-basics@willian-m001-epyvg.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);