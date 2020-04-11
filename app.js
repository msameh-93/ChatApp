const express= require("express");
const path= require("path");
const http= require("http");    //Core module
const socketio= require("socket.io");   //returns a function
const Filter= require("bad-words");     //returns a class - npm library to check for bad words in string

const generateMsg= require(path.join(__dirname,"/Utilities/msgObj"));
const { addUser, removeUser, getUser, getUsersInRoom }= require(path.join(__dirname,"/Utilities/users"));

const app= express();
//create an http express server (explicitly to use express app with websocket server)
const server= http.createServer(app);   
const io= socketio(server);   //Create instance of websocket using a raw http server
//Sets up a client side library .js file that can be used by front end JS code
/*****Page Rendering*******/
app.set("view engine", "pug");
app.set("views", "View");
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (request, response) => {
    response.status(200).render("index");
});
app.get("/chat", (request, response) => {
    response.status(200).render("ChatRoom");
});
/******Socket IO********/
//Listens to connection event
io.on("connection", (socket) => {     //socket arg refers currently connected client on socket
    //socket.broadcast.emit("message", "A new User has joined");
    socket.on("join", (joinObj, callback) => {
        //socket.id= uinque identifier for tht particular (client/connection)
        //Store for global access
        const {error, user}= addUser({id: socket.id, username: joinObj.username, room: joinObj.room});
        if(error)
        {
            return callback(error);
        }
        socket.join(user.room,);   //Groups clients on websocket server in one group to send events
        //'emits' to all connections on websocket (EXCEPT 'this')
        socket.emit("message", generateMsg({
            username: "Server Room",
            text: `Welcome ${user.username}!`
        }));  
        //io.to.emit  send event to a specific body in a room
        //socket.broadcast.to.emit  
        socket.broadcast.to(user.room).emit("message", generateMsg({
            username: "Server Room",
            text: `${user.username} has Joined the room!`
        }));
        io.emit(user.room).emit("roomData", {
            users: getUsersInRoom(user.room),
            room: user.room
        });
        callback(); //no args == no error
    });
    socket.on("sendMsg", (message, callback) => {
        const filter= new Filter();
        if(filter.isProfane(message))
        {
            return callback("Contained bad Language");
        }
        io.to(getUser(socket.id).room).emit("message", generateMsg({
            username: getUser(socket.id).username,
            text: message
        }));
        callback();
    })
    socket.on("sendLocation", (location, callback) => {
        io.to(getUser(socket.id).room).emit("location", generateMsg({
            username: getUser(socket.id).username,
            text: location
        }));
        callback();
    })
    socket.on("disconnect", ()=> {
        const delUser= removeUser(socket.id);
        if(delUser.user)
        {
            io.to(delUser.user.room).emit("message", generateMsg({
                username: "Server Room",
                text: `${delUser.user.username} has left the room!`
            }));
            io.emit(delUser.user.room).emit("roomData", {
                users: getUsersInRoom(delUser.user.room),
                room: delUser.user.room
            });
        }
    })
});
/**************************************************/
const PORT_NO= process.env.PORT || 8000;
server.listen(8000, () => {         //start express app servers
    console.log(`Listening on port ${PORT_NO}`)
})