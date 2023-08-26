const API = 'BUDGETMANAGEMENT-TRACKER-1.0.0'
const uuid = require('uuidv4')
const TRAN_ID = uuid.uuid()
const date = new Date()

var logger = require("../../helpers/logger") // command logs
var model = require('../../model/expenseManagement/tracker')

const trackerDb = model.tracker
const groupDb = model.tracker_group

// get all expense
exports.get = (req, res) => {
    const ACTION = 'GET-ALL-EXPENSE'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)
    trackerDb.find()
        .then(trackers=>{
            let result = []
            for(const tracker of trackers){
                result.push({
                    id : tracker._id,
                    refId : tracker.uuid,
                    name : tracker.name,
                    type : tracker.type,
                    amount : tracker.amount
                })
            }
            const response = {
                code : 'S',
                tid : TRAN_ID,
                description : 'Sucessfuly processed transaction',
                data : result
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

// add new expense 
exports.create = (req, res) => {
    ACTION = 'NEW-EXPENSE'
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

    //validate group
    groupDb.aggregate([ { $match: { "uuid": req.body.gid } } ])
        .then(groups=>{
            if(!groups.length){
                let message = `Group doesn't exist`
                logger.error(API, TRAN_ID, ACTION, `RESPONSE`, message)
                return res
                    .status(500)
                    .send({
                        code : 'F',
                        description : 'Failed to process transaction',
                        details : message
                    })
            }

            logger.info(API, TRAN_ID, ACTION, `REQUEST`, req.body)
            //new expense
            const tracker = new trackerDb({
                uuid: uuid.uuid(),
                cid: req.body.cid,
                name: req.body.name,
                type: req.body.type,
                amount: req.body.amount,
                gid: req.body.gid,
                createDate: date,
                dateUpdated: date
            })
        
            //save expense to db
            tracker
                .save(tracker)
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
                    logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
                    return res
                        .status(500)
                        .send({
                            code : 'F',
                            description : 'Failed to process transaction',
                            details : details
                        })
                })

        })
        .catch(err=>{
            const details = err.message || 'DB Error'
            logger.info(API, TRAN_ID, ACTION, `RESPONSE`, details)
            return res
                .status(500)
                .send({
                    code : 'F',
                    description : 'Failed to process transaction',
                    details : details
                })
        })
}

// update expense
exports.update = (req,res) => {
    ACTION = 'UPDATE-EXPENSE'
    //validate request
    if(!req.body){
        const details = `Invalid Content`
        logger.info(API, TRAN_ID, ACTION, `RESPONSE`, details)
        return res
            .status(400)
            .send({
                code : 'F',
                tid : TRAN_ID,
                description : 'Failed to process transaction',
                details : details
            })
    }
    logger.info(API, TRAN_ID, ACTION, `REQUEST`, req.body)
    const id = req.params.id;
    trackerDb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
        .then(data=>{
            if(!data){
                const details = `Cannot update ${id}`
                logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
                return res
                    .status(404)
                    .send({
                        code : 'TF',
                        tid : TRAN_ID,
                        description : 'Failed to process transaction',
                        details : details
                    })
            } else {
                const response = {
                    code : 'TS',
                    tid : TRAN_ID,
                    description : 'Sucessfuly processed transaction',
                    details : `Successfuly updated ${id}`
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
                    code : 'TF',
                    tid : TRAN_ID,
                    description : 'Failed to process transaction',
                    details : details
                })
        })
}

// delete group
exports.delete = (req,res) => {
    ACTION = 'DELETE-EXPENSE'
    const id = req.params.id;
    trackerDb.findByIdAndDelete(id)
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

// get all groups
exports.groupGet = (req, res) => {
    const ACTION = 'GET-ALL-GROUP'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)
    groupDb.find()
        .then(groups=>{
            let result = []
            for(const group of groups){
                result.push({
                    id : group._id,
                    refId : group.uuid,
                    name : group.name
                })
            }
            const response = {
                code : 'S',
                tid : TRAN_ID,
                description : 'Sucessfuly processed transaction',
                data : result
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

// add new group
exports.groupCreate = (req, res) => {
    ACTION = 'CREATE-TRACKER-GROUP'
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
    //new group
    const group = new groupDb({
        uuid: uuid.uuid(),
        cid: req.body.cid,
        name: req.body.name,
        createDate: date,
        dateUpdated: date
    })

    //save group to db
    group
        .save(group)
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

// update group
exports.groupUpdate = (req,res) => {
    ACTION = 'UPDATE-TRACKER-GROUP'
    //validate request
    if(!req.body){
        const details = `Invalid Content`
        logger.info(API, TRAN_ID, ACTION, `RESPONSE`, details)
        return res
            .status(400)
            .send({
                code : 'F',
                tid : TRAN_ID,
                description : 'Failed to process transaction',
                details : details
            })
    }
    logger.info(API, TRAN_ID, ACTION, `REQUEST`, req.body)
    const id = req.params.id;
    groupDb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
        .then(data=>{
            if(!data){
                const details = `Cannot update ${id}`
                logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
                return res
                    .status(404)
                    .send({
                        code : 'TF',
                        tid : TRAN_ID,
                        description : 'Failed to process transaction',
                        details : details
                    })
            } else {
                const response = {
                    code : 'TS',
                    tid : TRAN_ID,
                    description : 'Sucessfuly processed transaction',
                    details : `Successfuly updated ${id}`
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
                    code : 'TF',
                    tid : TRAN_ID,
                    description : 'Failed to process transaction',
                    details : details
                })
        })
}

// delete group
exports.groupDelete = (req,res) => {
    ACTION = 'DELETE-TRACKER-GROUP'
    const id = req.params.id;
    groupDb.findByIdAndDelete(id)
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

// get group expenses
exports.groupExpenses = (req, res) => {
    ACTION = 'GROUP-EXPENSES'
    
    logger.info(API, TRAN_ID, ACTION, `REQUEST`, req.params.refId)
    //get group expenses
    trackerDb.aggregate([ { $match: { "gid": req.params.refId } } ])
        .then(expenses=>{
            let result = []
            for(const expense of expenses){
                result.push({
                    id : expense._id,
                    refId : expense.uuid,
                    name : expense.name,
                    type : expense.uuid,
                    amount : expense.amount
                })
            }
            const response = {
                code : 'S',
                tid : TRAN_ID,
                description : 'Sucessfuly processed transaction',
                gid : req.params.refId,
                data : result
            }
            logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)
            res.send(response)
        })
        .catch(err=>{
            const details = err.message || 'DB Error'
            logger.info(API, TRAN_ID, ACTION, `RESPONSE`, details)
            return res
                .status(500)
                .send({
                    code : 'F',
                    description : 'Failed to process transaction',
                    details : details
                })
        })

}