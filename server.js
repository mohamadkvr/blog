const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const a = require("./server/tools/generalTools")

const app = express();

//////////////connection db /////////////////////////////////////

require('./server/database/connectionMongo')();

/////////////configuration /////////////////////////////////////

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended : false}));
app.use(express.json())
app.use(cookieParser());
app.use(session({
    key : "user_sid",
    secret: "mysecret key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000000000000000
    }
}))
app.use(flash());

app.set("view engine", "ejs");

///////////////////////create admin //////////////////

require("./server/tools/initial")

///////////// routes/////////////////////////////////////

app.use('/', require("./server/routes/api"))

////////////listen///////////////////////////////////////

app.listen(3000, ()=>{
    console.log("server on listen on port 3000")
})