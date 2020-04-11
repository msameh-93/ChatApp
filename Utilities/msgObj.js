const generateMsg= (message) => {
    return {
        username: message.username,
        text: message.text,
        createdAt: new Date().getTime()
    }
}

module.exports= generateMsg;