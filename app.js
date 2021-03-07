const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const sassMiddleware = require('node-sass-middleware');
const passport= require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
app.use(sassMiddleware({
    src: './public/scss',
    dest: './public/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/public/css'
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));



app.listen(3000, function(err){
    if(err){
        console.log("Error", err);
    }
    console.log("Server is up and running on port 3000");
});