const express = require('express')
const connectDB = require('./config/database/connection')
const { auth } = require('express-oauth2-jwt-bearer');

connectDB() //establish mongodb connection

const jwtCheck = auth({
    audience: 'https://natalie-odnu.onrender.com',
    issuerBaseURL: 'https://dev-olak38adx0yzvpf1.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

const app = express()

// enforce on all endpoints
app.use(jwtCheck);

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

app.use(express.json()) //middleware

const creditCardManagement = require('./routes/creditManagement/card')
const expenseManagement = require('./routes/expenseManagement/tracker')

app.use('/api/v1/credit/card', creditCardManagement) // credit card management v1
app.use('/api/v1/expense/tracker', expenseManagement) // budget tracker v1

const PORT = process.env.port || 2113
app.listen(PORT, () => {
    console.log(`listening to port : ${PORT}`)
})