const express = require('express')
const connectDB = require('./config/database/connection')

connectDB() //establish mongodb connection

const app = express()

app.use(express.json()) //middleware

const creditCardManagement = require('./routes/creditManagement/card')
const budgetManagement = require('./routes/expenseManagement/tracker')

app.use('/api/v1/credit/card', creditCardManagement) // credit card management v1
app.use('/api/v1/budget/tracker', budgetManagement) // budget tracker v1

const PORT = process.env.port || 2113
app.listen(PORT, () => {
    console.log(`listening to port : ${PORT}`)
})