const users= [];    //Array of 'user' objects

const addUser= (userObj) => {
    userObj.username= userObj.username.trim().toLowerCase();
    userObj.room= userObj.room.trim().toLowerCase();
    const username= userObj.username;
    const room= userObj.room;

    if(!username || !room)
    {
        return {
            error: "Username and room are required !"
        }
    }
    //Object of user
    const existingUser= users.find((user) => {
        return user.username===username && user.room===room;
    });
    if(existingUser)
    {
        return {
            error: "User already exists in this room!"
        }
    }
    users.push(userObj);
    return { user: userObj };
}
const removeUser= (userId) => {
    let deletedUser= undefined;
    users.forEach((user, index, array) => { //forEach can track curr element, index and object
        if(user.id===userId)
        {
            deletedUser= user;
            array.splice(index, 1);
        }
    })
    return {user: deletedUser};
}
const getUser= (userId) => {
    return users.find((user)=> user.id===userId);
}
const getUsersInRoom= ((roomName)=> {
    return users.filter((user) => user.room===roomName.trim().toLowerCase());
});

module.exports= {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

