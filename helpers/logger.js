const pino = require('pino')
const pretty = require('pino-pretty')
const logger = pino(pretty())

const helper = require('./other')
const getSafe = helper.getSafe //safe values

const info = (api, action, id, body, content) => {
    logger.info(`${api} | ${action} | ${id} | ${body} : ${getSafe(content)}`)
}

const error = (api, action, id, body, content) => {
    logger.error(`${api} | ${action} | ${id} | ${body} : ${getSafe(content)}`)
}

module.exports = { info, error }