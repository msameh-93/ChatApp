const express= require("express");
const path= require("path");

const app= express();
app.set("view engine", "pug");
app.set("views", "View");
app.use(express.static(path.join(__dirname+"/View")));

app.get("/", (request, response) => {
    response.status(200).render("index");
});


const PORT_NO= process.env.PORT || 8000;
app.listen(8000, () => {
    console.log(`Listening on port ${PORT_NO}`)
})