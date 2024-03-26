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
        installment: req.body.installment,
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

// update card
exports.update = (req,res) => {
    ACTION = 'UPDATE-CARD'
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
    cardDb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
        .then(data=>{
            if(!data){
                const details = `Cannot update ${id}`
                logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
                return res
                    .status(404)
                    .send({
                        code : 'F',
                        tid : TRAN_ID,
                        description : 'Failed to process transaction',
                        details : details
                    })
            } else {
                const response = {
                    code : 'S',
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
                    code : 'F',
                    tid : TRAN_ID,
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

//calculate repayment
exports.repayment2 = async (req, res) => {
    const ACTION = 'REPAYMENTV2'
    const id = req.body.cards;
    const payment = req.body.payment;

    if(!id.length){
        const details = `Invalid Cards`
        logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
        return res
            .status(400)
            .send({
                code : 'F',
                description : 'Failed to process transaction',
                details : details
            })
    }

    if(!payment){
        const details = `Invalid Payment`
        logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
        return res
            .status(400)
            .send({
                code : 'F',
                description : 'Failed to process transaction',
                details : details
            })
    }

    let details = await helper.cardRepayment(id)
    let response = {
        code : 'S',
        description : 'Sucessfuly processed transaction',
        details : details
    }

    logger.info(API, TRAN_ID, ACTION, `RESPONSE`, response)
    res.send(response);
}

//card payment arrangement
exports.paymentArrangement = async (req, res) => {
    const ACTION = 'CARD-PAYMENT-ARRANGEMENT'

    const body = req.body;
    const cards = body.cards;

    if(cards == undefined || cards == null){
        const details = `No Card is passed`
        logger.error(API, TRAN_ID, ACTION, `RESPONSE`, details)
        return res
            .status(404)
            .send({
                code : 'F',
                description : 'Failed to process transaction',
                details : details
            })
    }

    let query = cards.length ? { uuid: { $in: cards } } : {}

    //-1 = ascending 1 = descending
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)
    cardDb.find(query).sort({installment: 1, balance : -1})
        .then(async cards=>{
            let cardsDetails = []

            let totalBalancesOriginal = 0
            let totalBalances = 0
            let balances = []
            let mads = []
            let interests = []
            let banks = []
            
            for(let card of cards){
                cardsDetails.push({
                    bank : card.bank,
                    payment: parseFloat(card.balance) * parseFloat(card.mad),
                    balance: card.balance,
                    rate: card.interest,
                    mad: card.mad
                })

                totalBalancesOriginal += parseFloat(card.balance)
                totalBalances += parseFloat(card.balance)
                balances.push(card.balance)
                mads.push(card.mad)
                interests.push(card.interest)
                banks.push(card.bank)
            }

            let _month = 0
            let _balances = []
            let _payments = []
            let objectResult = []

            //insert month 0 data
            _balances.push(balances)

            let calculate = (totalBalance, ongoingCard) => {

                let monthBalances = []
                let monthPayments = []

                let fund = parseFloat(body.fund)
                let interestsIncurred = parseFloat(0);
                let consumedFund = parseFloat(0);
                let monthOngoingCard = parseInt(ongoingCard)

                if(totalBalance <= 0){
                    return totalBalance
                }

                for(let i = 0; i < _balances[_month].length; i++){
                    monthBalances.push(0)
                    monthPayments.push(0)
                }
                // _balances.push(initialBalance)

                for(let i = _balances[_month].length; i > 0; i--){
                    let madPercentage = parseFloat(mads[i - 1])
                    let interestPercentage = parseFloat(interests[i - 1])

                    let monthBalance = parseFloat(_balances[_month][i - 1])
                    let monthInterest = parseFloat(monthBalance == 0 ? 0 : monthBalance * interestPercentage)
                    monthBalance = monthBalance <= 0 ? 0 : monthBalance + monthInterest
                    let monthMad = parseFloat(monthBalance == 0 ? 0 : monthBalance * madPercentage)
                    monthMad = monthMad < 500 ? 500 : monthMad
                    let monthPayment = parseFloat(i == monthOngoingCard ? fund : monthMad)
                    monthPayment = monthPayment > monthBalance ? monthBalance : monthPayment

                    // console.log(`monthBalance : ${monthBalance}`)
                    // console.log(`monthInterest : ${monthInterest}`)
                    // console.log('===================================')

                    // console.log(`monthBalance : ${monthBalance}`)
                    // console.log(`monthMad : ${monthMad}`)
                    // console.log(`monthPayment : ${monthPayment}`)
                    // console.log('===================================')


                    // console.log(`totalBalance : ${totalBalance}`)
                    // console.log(`i : ${i}`)
                    // console.log(`monthBalances[i - 1] : ${monthBalances[i - 1]}`)
                    // console.log(`monthOngoingCard : ${monthOngoingCard}`)
                    // console.log(`monthOngoingCard : ${monthOngoingCard}`)
                    // console.log(`fund : ${fund}`)
                    // console.log(`consumedFund : ${consumedFund}`)
                    // console.log(`interestsIncurred : ${interestsIncurred}`)
                    // console.log('===================================')

                    let newBalance = monthBalance - monthPayment

                    if(_month == 10 && i == 2){
                        console.log(`i : ${i}`)
                        console.log(`_month : ${_month}`)
                        console.log(`totalBalance : ${totalBalance}`)
                        console.log(`monthOngoingCard : ${monthOngoingCard}`)
                        console.log(`monthBalance : ${monthBalance}`)
                        console.log(`monthPayment : ${monthPayment}`)
                        console.log(`newBalance : ${newBalance}`)
                        console.log(`monthBalances[i - 1] before : ${monthBalances[i - 1]}`)
                    }
                    // console.log('===================================')
                    
                    monthBalances[i - 1] = monthBalance == 0 ? 0 : newBalance
                    monthPayments[i - 1] = monthPayment
                    fund -= monthPayment
                    consumedFund += monthPayment
                    interestsIncurred += monthInterest

                    if(_month == 10 && i == 2){
                        console.log(`monthBalances[i - 1] after : ${monthBalances[i - 1]}`)
                        console.log('===================================')
                    }

                    if(monthBalances[i - 1] == 0 && i == monthOngoingCard){
                        monthOngoingCard++
                        console.log(`increment dus`)
                    } 
                }

                _balances.push(monthBalances)
                _payments.push(monthPayments)

                // console.log(`totalBalance : ${totalBalance}`)
                // console.log(`interestsIncurred : ${interestsIncurred}`)
                // console.log(`consumedFund : ${consumedFund}`)
                // console.log(`monthOngoingCard : ${monthOngoingCard}`)
                // console.log('===================================')
                // console.log(`monthBalances : ${monthBalances}`)
                // console.log(`monthPayments : ${monthPayments}`)
                // console.log(`totalBalance : ${totalBalance}`)
                // console.log(`interestsIncurred - consumedFund : ${interestsIncurred - consumedFund}`)
                // console.log(`monthOngoingCard : ${monthOngoingCard}`)
                _month++
                calculate(totalBalance + (interestsIncurred - consumedFund), monthOngoingCard)
            }

            calculate(totalBalances, 1)

            for(let i = 0; i < _payments.length; i++){
                let obj = {
                    month : i + 1,
                    payments : []
                }
                for(let x = 0; x < _payments[i].length; x++){
                    obj.payments.push({
                        bank : banks[x],
                        balance : _balances[i][x],
                        payment : _payments[i][x]
                    })
                }
                objectResult.push(obj)
            }

            let response = {
                code : 'S',
                description : 'Sucessfuly processed transaction',
                // details : cardsPayment
                total: totalBalances,
                // madsLengh : mads.length,
                // // mads : mads,
                // paymentsLength : _payments.length,
                // payments : _payments,
                // balancesLength : _balances.length,
                // balances : _balances
                details : objectResult
            }
            // logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)
            res.send(response)

            // let calculatePayments = (card) => {
            //     let balance = card.balance
            //     let month = 1
            //     let madMinimum = 500
            //     let payments = []
            //     let payment = 0

            //     for(; balance > 0 ;){
            //         payment = parseFloat(balance) * parseFloat(card.mad)
            //         paymentAmount = payment < madMinimum ? madMinimum : payment
                    
            //         payments.push({
            //             month : month,
            //             payment : paymentAmount,
            //             balance : parseFloat(balance) - parseFloat(paymentAmount)
            //         })

            //         month++
            //         balance -= parseFloat(paymentAmount)
            //     }
            //     return payments
            // }

            // let cardsPayment = []
            // for(let card of cards){
            //     let payments = await calculatePayments(card)
            //     cardsPayment.push({
            //         card : card.bank,
            //         monthsToPay : payments.length,
            //         payments : payments
            //     })
            // }

            // let objectResult = []

            // let resultBalances = []
            // let resultPayments = []
            // let madMinimum = 500
            // let ongoingCard = 1;
            
            // resultBalances.push(balances)

            // for(let month = 1; totalBalances >= 0; month++){
            //     let fund = body.fund
            //     let monthPayment = []
            //     let monthBalance = []
            //     for(let i = 0; i < resultBalances[month - 1].length; i++){
            //         monthPayment.push([])
            //         monthBalance.push([])
            //     }
            //     for(let i = resultBalances[month - 1].length; i > 0; i--){
            //         let interest = parseFloat(interests[i - 1])
            //         let interestAmount = parseFloat(resultBalances[month - 1][i - 1] * interest)
            //         resultBalances[month - 1][i - 1] += interestAmount
            //         totalBalances += interestAmount

            //         let balance = parseFloat(resultBalances[month - 1][i - 1])
            //         let mad = parseFloat(balance * mads[i - 1])
            //         mad = mad < madMinimum && balance > madMinimum ? madMinimum : mad

            //         console.log(`i : ${i}`)
            //         console.log(`ongoingCard : ${ongoingCard}`)
            //         console.log(`interest : ${interest}`)
            //         console.log(`interestAmount : ${interestAmount}`)
            //         console.log(`balance : ${balance}`)
            //         console.log(`mad : ${mad}`)

            //         if(balance <= 0 && ongoingCard == i){
            //             ongoingCard++
            //         }

            //         let payment = ongoingCard == i ? fund : mad < balance ? mad : balance
            //         payment = payment > balance ? balance : payment

            //         monthPayment[i - 1] = (payment)
            //         monthBalance[i - 1] = (balance - payment)

            //         fund -= payment
            //         totalBalances -= payment
            //     }
            //     resultBalances.push(monthPayment)
            //     resultPayments.push(monthBalance)
            // }

            //x = month count
            // for(let x = 0; totalBalances >= 0 ; x++){

            //     let _payments = []
            //     let _balances = []
            //     let fund = parseFloat(body.fund)

            //     // if(x == 1){
            //     //     break
            //     // }

            //     for(let i = resultBalances[x].length; i > 0; i--){

            //         let balance = parseFloat(resultBalances[x][i - 1])
            //         let mad = parseFloat(balance * parseFloat(mads[i - 1]))

            //         if(balance <= 0 && i == ongoingCard && ongoingCard < resultBalances[x].length){ 
            //             ongoingCard += 1
            //         }
                    
            //         let payment = parseFloat(i == ongoingCard ? fund : mad)
            //         let paymentAmount = parseFloat(balance < payment ? balance : payment)
            //         // let paymentAmount = parseFloat(payment > balance ? balance : payment <= madMinimum && payment >= 0 ? madMinimum : payment)
            //         // let paymentAmount = parseFloat(payment > balance ? balance : payment)

            //         // let newBalance = balance - paymentAmount <= 0 ? 0 : balance - paymentAmount
            //         if(i == resultBalances[x].length){
            //             _payments.push(paymentAmount)
            //             _balances.push(balance - paymentAmount)
            //         } else {
            //             _payments.unshift(paymentAmount)
            //             _balances.unshift(balance - paymentAmount)
            //         }

            //         fund -= paymentAmount
            //         totalBalances -= paymentAmount
            //     }
            //     resultBalances.push(_balances)
            //     resultPayments.push(_payments)
            // }

            // for(let i = 0; i < resultPayments.length; i++){
            //     let obj = {
            //         month : i + 1,
            //         payments : []
            //     }
            //     for(let x = 0; x < resultPayments[i].length; x++){
            //         obj.payments.push({
            //             bank : banks[x],
            //             balance : resultBalances[i][x],
            //             payment : resultPayments[i][x]
            //         })
            //     }
            //     objectResult.push(obj)
            // }
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