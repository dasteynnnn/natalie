require('dotenv').config()

const express = require('express')

const app = express()

require('./config/database/connection')() //establish mongodb connection

// // Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://finesse-test.onrender.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

app.use(express.json())

const creditCardManagement = require('./routes/creditManagement/card')
const expenseManagement = require('./routes/expenseManagement/tracker')
const profileManagement = require('./routes/profileManagement/profile')

app.use('/api/v1/credit/card', creditCardManagement) // credit card management v1
app.use('/api/v1/expense/tracker', expenseManagement) // budget tracker v1
app.use('/api/v1/profile', profileManagement) // profile management v1

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening to ports : ${PORT}`)
})

module.exports = app;