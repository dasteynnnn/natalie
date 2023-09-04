const express = require('express')
const router = express.Router()

const controller = require('../../controller/profileManagement/profile')
const upload = require('../../middleware/upload')

router.get('/', controller.get)

router.post('/create', upload.single('avatar'), controller.create)

router.delete('/delete/:id', controller.delete)

module.exports = router