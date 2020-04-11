const express= require("express");
const path= require("path");
const http= require("http");    //Core module
const socketio= require("socket.io");   //returns a function

const app= express();
//create an http express server (explicitly to use express app with websocket server)
const server= http.createServer(app);   
const io= socketio(server);   //Create instance of websocket using a raw http server
//Sets up a .js file that can be used by front end JS code
/*****Page Rendering*******/
app.set("view engine", "pug");
app.set("views", "View");
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (request, response) => {
    response.status(200).render("index");
});
/******Socket IO********/
io.on("connection", () => {     //Listens to connection event
    console.log("User connected");
});
/**************************************************/
const PORT_NO= process.env.PORT || 8000;
server.listen(8000, () => {         //start express app servers
    console.log(`Listening on port ${PORT_NO}`)
})