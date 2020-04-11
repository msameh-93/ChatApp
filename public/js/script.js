const socket= io();
//Elements
const form= document.querySelector("#msg-form");
const formInput= form.querySelector("input");
const formButton= form.querySelector("button");
const loc= document.querySelector("#loc");

form.addEventListener("submit", (event)=> {
    event.preventDefault();
    //Disable the form button
    formButton.setAttribute("disabled", "disabled");
    //3rd arg is a CB function that gets called with .on
    socket.emit("message", formInput.value, (delivered)=> {  
        console.log(formInput.value);
        //re enable form button
        formButton.removeAttribute("disabled");
        formInput.value= "";
        formInput.focus();
        console.log(delivered);
    });
})

loc.addEventListener("click", (event)=> {
    event.preventDefault();
    loc.setAttribute("disabled", "disabled");

    if(!navigator.geolocation)
    {
        return alert("Geolocation services is not available - Please update browser");
    }
    navigator.geolocation.getCurrentPosition((position)=> {
        console.log(position);
        socket.emit("location", {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        }, (locMsg) => {
            console.log(locMsg);
            loc.removeAttribute("disabled");
        });
    });
});

socket.on("message", (welcome)=> {
    console.log(welcome);
})