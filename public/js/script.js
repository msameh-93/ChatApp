const socket= io();

//Elements
const form= document.querySelector("#msg-form");
const formInput= form.querySelector("input");
const formButton= form.querySelector("button");
const loc= document.querySelector("#loc");
const msg_container= document.querySelector("#msg_container");
const sidebar= document.querySelector("#sidebar");
//innerHTML access to nested HTML elemnts
const msg_template= document.querySelector("#msg_template").innerHTML;  
const loc_template= document.querySelector("#loc_template").innerHTML;
const sidebar_template= document.querySelector("#sidebar_template").innerHTML;
//from HTML script tag
const {username, room }= Qs.parse(location.search, { ignoreQueryPrefix: true /*ignores ?*/});      
//Scroling eautures
const scroll= () => {
    //new message element
    const newMsg= msg_container.lastElementChild;
    //get heigh of message element
    const newMsgStyle= getComputedStyle(newMsg);    //css styles
    const newMsgMargin= parseInt(newMsgStyle.marginBottom); //get botton margin pixel
    const newMsgHeight= newMsg.offsetHeight + newMsgMargin; //add to total height
    //Height of chat messages available to user
    const visibleHeight= msg_container.offsetHeight;
    //Height of messages container
    const containerHeight= msg_container.scrollHeight;

    //How far down are we ( to disable auto scrolling when user is viewiing a msg )
    const scrollOffset= msg_container.scrollTop + visibleHeight;

    if(containerHeight - newMsgHeight <= scrollOffset)
    {
        msg_container.scrollTop= msg_container.scrollHeight;
    }
    
}
socket.on("message", (msgObj)=> {  //Render messages
    const htmlResponse= Mustache.render(msg_template, {
        username: msgObj.username,
        msg: msgObj.text,
        timestamp: moment(msgObj.createdAt).format("hh:mm A")  //from HTML script tag
    });
    msg_container.insertAdjacentHTML("beforeend", htmlResponse);
    scroll();
})
socket.on("location", (msgObj) => {
    const htmlResponse= Mustache.render(loc_template, {
        username: msgObj.username,
        msg: msgObj.text,
        timestamp: moment(msgObj.createdAt).format("h:mm A")
    })
    msg_container.insertAdjacentHTML("beforeend", htmlResponse);
    scroll();
})
socket.on("roomData", (msgObj) => {
    const htmlResponse= Mustache.render(sidebar_template, {
        room: msgObj.room,
        users: msgObj.users
    });
    sidebar.innerHTML= htmlResponse;        //replace old data with new data
});
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