const helper = require('./other')
const formatCurrency = helper.formatCurrency

const cardRepayment = async (body) => {

    let total = { balance : 0, payment : 0, interest : 0, monthlyPayment : 0 }
    let cards = [];

    for(let _body of body){
        let bank = _body.bank;
        let balance = parseFloat(_body.balance);
        let rate = parseFloat(_body.rate);
        let mad = parseFloat(_body.mad);
        let payment = parseFloat(_body.payment)
        
        let interest = balance * rate
        let _mad = balance * mad
        if(payment <= interest){
            cards.push({ bank : bank, error : { message : `The payment amount you entered is not large enough to cover the ${formatCurrency(interest)} in interest charges for the current period. Please increase the payment to more than ${formatCurrency(interest)} and recalculate.`}})
        } else {
            if(payment < _mad){
                cards.push({ bank : bank, error : { message : `The payment amount you entered is not large enough to cover the ${formatCurrency(_mad)} in Minimum Amount Due charges for the current period. Please increase the payment to more than ${formatCurrency(_mad)} and recalculate.`}})
            } else {
                let card = {
                    "bank" : bank,
                    "balance" : formatCurrency(balance),
                    "interest" : rate,
                    "MAD" : mad,
                    "monthlyPayment" : formatCurrency(payment),
                    "summary" : [],
                    "payments" : []
                }
        
                let result = await getResult(payment, rate, mad, balance, 0, 0, 0, [])
                if(result){
                    let months = result.months;
                    let paymentTotal = result.paymentTotal;
                    let interestTotal = result.interestTotal;
    
                    total.balance += balance;
                    total.payment += paymentTotal;
                    total.interest += interestTotal;
                    total.monthlyPayment += payment;
                    
                    card.summary.push({"months" : months, "paymentTotal" : formatCurrency(paymentTotal), "interestTotal": formatCurrency(interestTotal)})
                    result.transactions.forEach(tran => {
                        card.payments.push(tran)
                    })
                }
                cards.push(card)
            }
        }
    }
    let response = {
        "totalBalance" : formatCurrency(total.balance),
        "totalMonthlyPayment" : formatCurrency(total.monthlyPayment),
        "totalPaymentSettled" : formatCurrency(total.payment),
        "totalInterestSettled" : formatCurrency(total.interest),
        "creditCards" : cards
    }
    return response;
}

const getResult = (payment, rate, mad, balance, paymentTotal, interestTotal, months, transactions) => {
    let interest, chargedBalance, minimumAmountDue, newBalance;

    if(balance === 0){
        return { paymentTotal, interestTotal, months, transactions }
    }

    if(balance < payment){
        transactions.push({"month" : months + 1, "outstandingBalance" : formatCurrency(balance), "minimumAmountDue" : formatCurrency(balance), "payment" : formatCurrency(balance), "interest" : formatCurrency(0), newBalance : formatCurrency(0)});

        return getResult(payment, rate, mad, 0, paymentTotal + balance, interestTotal, months + 1, transactions)
    }

    interest = balance * rate;
    chargedBalance = interest + balance;
    minimumAmountDue = balance * mad;
    newBalance = chargedBalance - payment;

    transactions.push({"month" : months + 1, "outstandingBalance" : formatCurrency(balance), "minimumAmountDue" : formatCurrency(minimumAmountDue), "payment" : formatCurrency(payment), "interest" : formatCurrency(interest), newBalance : formatCurrency(newBalance)});

    return getResult(payment, rate, mad, newBalance, paymentTotal + payment, interestTotal + interest, months + 1, transactions)
}

module.exports = { cardRepayment }