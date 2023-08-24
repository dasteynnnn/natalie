const API = 'CREDITMANAGEMENT-CARD-1.0.0'
const uuid = require('uuidv4')
const TRAN_ID = uuid.uuid()
const date = new Date()

var logger = require("../../helpers/logger") // command logs
var model = require('../../model/creditManagement/card')

const helper = require('../../helpers/card') // card helper

var cardDb = model.card // credit card table

// get all cards
exports.get = (req, res) => {
    const ACTION = 'GET-ALL-CARD'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)
    cardDb.find()
        .then(cards=>{
            const response = {
                code : 'S',
                tid : TRAN_ID,
                description : 'Sucessfuly processed transaction',
                data : cards
            }
            logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)
            res.send(response)
        })
        .catch(err=>{
            const details = err.message || 'DB Error'
            logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
            return res
                .status(500)
                .send({
                    code : 'F',
                    tid : TRAN_ID,
                    description : 'Failed to process transaction',
                    details : details
                })
        })
}

//create new card
exports.create = (req, res) => {
    ACTION = 'CREATE-CARD'
    //validate request
    if(!req.body){
        const details = `Invalid Content`
        logger.info(API, TRAN_ID, ACTION, `RESPONSE`, details)
        return res
            .status(400)
            .send({
                code : 'F',
                description : 'Failed to process transaction',
                details : details
            })
    }

    logger.info(API, TRAN_ID, ACTION, `REQUEST`, req.body)
    //new card
    const card = new cardDb({
        uuid: uuid.uuid(),
        cid: req.body.cid,
        bank: req.body.bank,
        cnum: req.body.cnum,
        name: req.body.name,
        climit: req.body.climit,
        mad: req.body.mad,
        interest: req.body.interest,
        balance: req.body.balance,
        createDate: date,
        dateUpdated: date
    })

    //save card to db
    card
        .save(card)
        .then(data => {
            const response = {
                code : 'S',
                description : 'Sucessfuly processed transaction'
            }
            logger.info(API, TRAN_ID, ACTION, `RESPONSE`, response)
            res.send(response);
        })
        .catch(err => {
            const details = err.message || 'DB Error'
            logger.error(API, TRAN_ID, ACTION, `RESPONSE`, response)
            return res
                .status(500)
                .send({
                    code : 'F',
                    description : 'Failed to process transaction',
                    details : details
                })
        })
}

//delete card
exports.delete = (req,res) => {
    ACTION = 'DELETE-CARD'
    const id = req.params.id;
    cardDb.findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                const details = `Cannot delete ${id}`
                logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
                return res
                    .status(404)
                    .send({
                        code : 'F',
                        description : 'Failed to process transaction',
                        details : details
                    })
            } else {
                const response = {
                    code : 'S',
                    description : 'Sucessfuly processed transaction',
                    details : `Successfuly deleted ${id}`
                }
                logger.info(API, TRAN_ID, ACTION, `RESPONSE`, response)
                res.send(response);
            }
        })
        .catch(err=>{
            const details = err.message || 'DB Error'
            logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
            return res
                .status(500)
                .send({
                    code : 'F',
                    description : 'Failed to process transaction',
                    details : details
                })
        })
}

//calculate repayment
exports.repayment = async (req, res) => {
    const ACTION = 'REPAYMENT'
    const id = req.params.id;
    const payment = req.query.p;

    if(!payment){
        const details = `Invalid Content`
        logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
        return res
            .status(400)
            .send({
                code : 'F',
                description : 'Failed to process transaction',
                details : details
            })
    }

    //validate card
    cardDb.aggregate([ { $match: { "uuid": id } } ])
        .then(async cards=>{
            if(!cards.length){
                let message = `Card doesn't exist`
                logger.error(API, TRAN_ID, ACTION, `RESPONSE`, message)
                return res
                    .status(500)
                    .send({
                        code : 'F',
                        description : 'Failed to process transaction',
                        details : message
                    })
            }
            
            const card = cards[0]
            const body = [{
                "bank" : card.bank,
                "balance" : card.balance,
                "rate" : card.interest,
                "mad" : card.mad,
                "payment" : payment
            }]

            let details = await helper.cardRepayment(body)
            let response = {
                code : 'S',
                description : 'Sucessfuly processed transaction',
                details : details
            }

            logger.info(API, TRAN_ID, ACTION, `RESPONSE`, response)
            res.send(response);

        })
        .catch(err=>{
            const details = err.message || 'DB Error'
            logger.info(API, TRAN_ID, ACTION, `RESPONSE`, response)
            return res
                .status(500)
                .send({
                    code : 'F',
                    description : 'Failed to process transaction',
                    details : details
                })
        })


}