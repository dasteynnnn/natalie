const mongoose = require('mongoose')

var schema_card = new mongoose.Schema({
    uuid: {
        type:String,
        required:true
    },
    cid: {
        type:String,
        required:true
    },
    bank: {
        type:String,
        required:true
    },
    cnum: {
        type:Number,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    climit: {
        type:Number,
        required:true
    },
    mad: {
        type:Number,
        required:true
    },
    interest: {
        type:Number,
        required:true
    },
    balance: {
        type:Number,
        required:true
    },
    createDate: {
        type:String,
        required:true
    },
    dateUpdated: String

})

const card = mongoose.model('card', schema_card)

module.exports = { card }