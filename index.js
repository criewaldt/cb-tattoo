// Resilience Fitness - index.js
var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

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

// email post
app.post('/email', function(req, res) {
    console.log(req.body);
    
    try {
        //send email
        var mailOptions = {
            from: process.env.EMAIL_USER || 'criewaldt@gmail.com',
            to: process.env.EMAIL_USER || 'criewaldt@gmail.com',
            subject: 'Interested client from ResilienceFitness.net',
            text: 'Interested client from ResilienceFitness.net\n\n' +
                req.body.name + '\n' + req.body.phone + '\n' + req.body.email
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.send('no');
            } else {
                console.log('Email sent: ' + info.response);
                res.send('yes');
            }
        });
    }
    catch(err) {
        console.log('ERROR: sending email failed.');
    }
    
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
