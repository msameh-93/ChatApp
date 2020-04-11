const socket= io();

//Elements
const form= document.querySelector("#msg-form");
const formInput= form.querySelector("input");
const formButton= form.querySelector("button");
const loc= document.querySelector("#loc");
const msg_container= document.querySelector("#msg_container");
//innerHTML access to nested HTML elemnts
const msg_template= document.querySelector("#msg_template").innerHTML;  
const loc_template= document.querySelector("#loc_template").innerHTML;

socket.on("message", (msgObj)=> {  //Render messages
    console.log(msgObj);
    const htmlResponse= Mustache.render(msg_template, {
        msg: msgObj.text,
        timestamp: moment(msgObj.createdAt).format("hh:mm A")  //in index.pug script tag
    });
    msg_container.insertAdjacentHTML("beforeend", htmlResponse);
})
socket.on("location", (msgObj) => {
    const htmlResponse= Mustache.render(loc_template, {
        msg: msgObj.text,
        timestamp: moment(msgObj.createdAt).format("h:mm A")
    })
    msg_container.insertAdjacentHTML("beforeend", htmlResponse);
})
form.addEventListener("submit", (event)=> {
    event.preventDefault();
    //Disable the form button
    formButton.setAttribute("disabled", "disabled");
    //3rd arg is a CB function that gets called with .on
    socket.emit("sendMsg", formInput.value, (callbackArg)=> {  
        //re enable form button
        formButton.removeAttribute("disabled");
        formInput.value= "";
        formInput.focus();
        console.log(callbackArg);
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
        const url= `https://google.com/maps?q=${position.coords.latitude},${position.coords.longtitude}`;
        console.log(position);
        socket.emit("sendLocation", url, (locMsg) => {
                console.log(locMsg);
                loc.removeAttribute("disabled");
            });
    });
});
