const express = require('express')
const router = express.Router()

const controller = require('../../controller/expenseManagement/tracker')

router.get('/', controller.get)
router.post('/create', controller.create)
router.put('/update/:id', controller.update)
router.delete('/delete/:id', controller.delete)

router.get('/group', controller.groupGet)
router.post('/group/create', controller.groupCreate)
router.put('/group/update/:id', controller.groupUpdate)
router.delete('/group/delete/:id', controller.groupDelete)
router.get('/group/expenses/:refId', controller.groupExpenses)

module.exports = router