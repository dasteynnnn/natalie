const mongoose = require('mongoose')

const schema_profile = new mongoose.Schema({
    uuid: {
        type:String,
        required:true
    },
    cid: {
        type:String,
        required:true
    },
    firstName: {
        type:String,
        required:true
    },
    middleName: {
        type:String
    },
    lastName: {
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    contactNo: {
        type:String,
        required:true
    },
    avatar: {
        type:String
    },
    createDate: {
        type:String,
        required:true
    },
    dateUpdated: String
})

const profile = mongoose.model('profile', schema_profile)

module.exports = { profile }