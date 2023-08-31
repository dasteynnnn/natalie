const request = require('supertest')
const app = require("../../app");

const helper = {
    post : async (url, body) => {
        return await request(app).post(url).send(body)
    },
    get : async (url) => {
        return await request(app).get(url)
    },
    put : async (url, body) => {
        return await request(app).put(url).send(body)
    },
    delete : async (url) => {
        return await request(app).delete(url)
    }
}

module.exports = helper