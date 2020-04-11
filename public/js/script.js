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

//from HTML script tag
const {username, room }= Qs.parse(location.search, { ignoreQueryPrefix: true /*ignores ?*/});      

socket.on("message", (msgObj)=> {  //Render messages
    const htmlResponse= Mustache.render(msg_template, {
        username: msgObj.username,
        msg: msgObj.text,
        timestamp: moment(msgObj.createdAt).format("hh:mm A")  //from HTML script tag
    });
    msg_container.insertAdjacentHTML("beforeend", htmlResponse);
})
socket.on("location", (msgObj) => {
    const htmlResponse= Mustache.render(loc_template, {
        username: msgObj.username,
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
    socket.emit("sendMsg", formInput.value, (error)=> {  
        //re enable form button
        formButton.removeAttribute("disabled");
        formInput.value= "";
        formInput.focus();
        if(error)
        {
            return console.log(error);
        }
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
        socket.emit("sendLocation", url, (locMsg) => {
                loc.removeAttribute("disabled");
            });
    });
});

socket.emit("join", {
    username: username,
    room: room
}, (error) => {
    if(error)   //hande error
    {
        alert(error);
        location.href= "/";
    }
});