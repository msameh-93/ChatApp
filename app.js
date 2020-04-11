const express= require("express");
const path= require("path");
const http= require("http");    //Core module
const socketio= require("socket.io");   //returns a function
const Filter= require("bad-words");     //returns a class - npm library to check for bad words in string

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
/******Socket IO********/
//Listens to connection event
io.on("connection", (socket) => {     //socket arg refers currently connected client on socket
    //'emits' to all connections on websocket (EXCEPT 'this')
    socket.broadcast.emit("message", "A new User has joined");
    socket.emit("message", "Welcome");  //'emit' to 'this' connection
    //io.emit("fromServer");        //All connections on websocket
    socket.on("sendMsg", (message, callback) => {
        const filter= new Filter();
        if(filter.isProfane(message))
        {
            return callback("Contained bad Language");
        }
        io.emit("message", message);
        callback("Delivered to Client");
    })
    socket.on("disconnect", ()=> {
        io.emit("message", "A user has disconnected");
    })
    socket.on("location", (location, callback) => {
        socket.emit("message", `https://google.com/maps?q=${location.latitude},${location.longtitude}`);
        callback("Location Shared");
    })
});
/**************************************************/
const PORT_NO= process.env.PORT || 8000;
server.listen(8000, () => {         //start express app servers
    console.log(`Listening on port ${PORT_NO}`)
})