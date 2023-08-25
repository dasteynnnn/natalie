const express = require('express')
const connectDB = require('./config/database/connection')

connectDB() //establish mongodb connection

// // Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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

const app = express()

app.use(express.json()) //middleware

const creditCardManagement = require('./routes/creditManagement/card')
const budgetManagement = require('./routes/expenseManagement/tracker')

app.use('/api/v1/credit/card', creditCardManagement) // credit card management v1
app.use('/api/v1/budget/tracker', budgetManagement) // budget tracker v1

// app.use(function(req, res, next) {

//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from

//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const PORT = process.env.port || 2113
app.listen(PORT, () => {
    console.log(`listening to port : ${PORT}`)
})