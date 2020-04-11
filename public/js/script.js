const socket= io();

document.querySelector("#msg-form").addEventListener("submit", (event)=> {
    event.preventDefault();
    const msg= document.querySelector("input").value;
    socket.emit("msgReceived", msg);
})