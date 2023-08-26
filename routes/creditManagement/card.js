const express = require('express')
const router = express.Router()

const controller = require('../../controller/creditManagement/card')

//management
router.get('/', controller.get) // get all card
router.post('/create', controller.create) // create new card
router.put('/update/:id', controller.update) // update card
router.delete('/delete/:id', controller.delete) // delete card

//calculate
router.get('/calculate/repayment/:id', controller.repayment)

module.exports = router