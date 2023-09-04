const API = 'PROFILEMANAGEMENT-PROFILE-1.0.0'
const uuid = require('uuidv4')
const TRAN_ID = uuid.uuid()
const date = new Date()

const SFTPClient = require("ssh2-sftp-client") 

var logger = require("../../helpers/logger") // command logs
var model = require('../../model/profileManagement/profile')

var profileDb = model.profile // credit card table

// get all profiles
exports.get = (req, res) => {
    const ACTION = 'GET-ALL-PROFILES'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)
    profileDb.find()
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

//create new profile
exports.create = (req, res) => {
    ACTION = 'CREATE-PROFILE'
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
    //new profile
    const profile = new profileDb({
        uuid: uuid.uuid(),
        cid: req.body.cid,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        age: req.body.age,
        address: req.body.address,
        email: req.body.email,
        contactNo: req.body.contactNo,
        avatar: req.file ? req.file.path : '',
        createDate: date,
        dateUpdated: date
    })

    //save profile to db
    profile
        .save(profile)
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

//delete profile
exports.delete = (req,res) => {
    ACTION = 'DELETE-PROFILE'
    const id = req.params.id;
    profileDb.findByIdAndDelete(id)
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