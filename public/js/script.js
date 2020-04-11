const socket= io();

document.querySelector("#msg-form").addEventListener("submit", (event)=> {
    event.preventDefault();
    //'this'event.target being listened to.elements inside target.name of tag.value
    const msg= event.target.elements.msg.value;

    socket.emit("msgReceived", msg);
})

document.querySelector("#loc").addEventListener("click", (event)=> {
    event.preventDefault();
    if(!navigator.geolocation)
    {
        return alert("Geolocation services is not available - Please update browser");
    }
    navigator.geolocation.getCurrentPosition((position)=> {
        console.log(position);
        socket.emit("location", {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        });
    });
});

socket.on("message", (welcome)=> {
    console.log(welcome);
})