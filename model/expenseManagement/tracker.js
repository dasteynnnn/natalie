const mongoose = require('mongoose')

const schema_tracker = new mongoose.Schema({
    uuid: {
        type:String,
        required:true
    },
    cid: {
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    type: {
        type:String,
        required:true
    },
    amount: {
        type:Number,
        required:true
    },
    gid: {
        type:String,
        required:true
    },
    createDate: {
        type:String,
        required:true
    },
    dateUpdated: String
})

const schema_tracker_group = new mongoose.Schema({
    uuid: {
        type:String,
        required:true
    },
    cid: {
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    createDate: {
        type:String,
        required:true
    },
    dateUpdated: String
})

const tracker = mongoose.model('tracker', schema_tracker)
const tracker_group = mongoose.model('tracker_group', schema_tracker_group)

module.exports = { tracker, tracker_group }