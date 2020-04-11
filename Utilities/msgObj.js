const generateMsg= (message) => {
    return {
        text: message,
        createdAt: new Date().getTime()
    }
}

module.exports= generateMsg;