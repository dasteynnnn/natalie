const getSafe = data => {
    if(!data){
        return ''
    }
    let type = typeof data
    return type == 'object' ? JSON.stringify(data) : data
}

const formatCurrency = val => {
    return (val).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
    })
}

module.exports = { getSafe, formatCurrency }