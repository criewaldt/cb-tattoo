// Chandler Bass Tattoo - index.js
var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

const fs = require("fs");
const path = require('path');

const blackFolder = 'public/tattoos/black';
const colorFolder = 'public/tattoos/color';

const getTats = require('./getTats');
var tatList = {};
getTats.getTats(function(logFiles){
  tatList = logFiles;
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// mail
var nodemailer = require('nodemailer');

// mail stuff
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'criewaldt@gmail.com',
    pass: process.env.EMAIL_PW || 'nrssnfyicsislxkd'
  }
});

// Pug Tempalate Engine
require('pug');
app.set('view engine', 'pug');

// Serve Static Files
app.use(express.static(__dirname + '/public'));

// index view
app.get('/tats', function(req, res) {
    //console.log(results);
    console.log(tatList);
    res.json(tatList);
});
    

// index view
app.get('/', function(req, res) {
  
    res.render('index');
});

// 404 for any page that doesnt exist - This goes after all other views
app.get('*', function(req, res){
    res.status(301).redirect('/');
});

//start http listening
http.listen(port, function(){
    console.log('listening on *:' + port);
});
