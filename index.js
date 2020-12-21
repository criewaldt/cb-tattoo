// Chandler Bass Tattoo - index.js
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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PW
  }
});


//dropbox
//get all current tattoo photo web links from dropbox
var tattoos = {'bw':[],'color':[]};
const Dropbox = require('dropbox');
var dbx = new Dropbox.Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
//get bw list of images
dbx.filesListFolder({path: "/tattoos/bw"})
    .then(function(response) {
      //get paths
      response.result.entries.forEach(function (result){
          //get sharable links
          dbx.sharingCreateSharedLink({path: result.path_lower})
            .then(function(uri) {
                //add to array
                //console.log(uri.result.url);
                var splitUrl = uri.result.url.split('?dl=0')[0];
                var newUrl = splitUrl.concat('?raw=1');
                tattoos.bw.push(newUrl);
             })
            .catch(function(error) {
                console.error(error);
          });
        });
      //console.log(JSON.stringify(response.result.entries, null, 4));
      //console.log(response.entries);
      
    })
    .catch(function(error) {
      console.error(error);
});
    
//get color list of images
dbx.filesListFolder({path: "/tattoos/color"})
    .then(function(response) {
      //get sharable links for photos
      response.result.entries.forEach(function (result){
          //get sharable links
          dbx.sharingCreateSharedLink({path: result.path_lower})
            .then(function(uri) {
                //add to array
                //console.log(uri.result.url);
                var splitUrl = uri.result.url.split('?dl=0')[0];
                var newUrl = splitUrl.concat('?raw=1');
                tattoos.color.push(newUrl);
             })
            .catch(function(error) {
                console.error(error);
          });
        });
      //console.log(JSON.stringify(response.result.entries, null, 4));
      //console.log(response.entries);
      
    })
    .catch(function(error) {
      console.error(error);
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
            subject: 'Interested client from ChandlerBTattoo.com',
            text: 'Interested client from ChandlerBTattoo.com\n\n' +
                req.body.name + '\n' + req.body.email + '\n' + req.body.phone + '\n' + req.body.message
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.send('Problem with contact form, please try again.');
            } else {
                console.log('Email sent: ' + info.response);
                res.send('Message sent!');
            }
        });
    }
    catch(err) {
        console.log('ERROR: sending email failed.');
    }
    
});
    

// index view
app.get('/', function(req, res) {
    //console.log(tattoos);
    res.render('index', {myTats:tattoos});
});

// 404 for any page that doesnt exist - This goes after all other views
app.get('*', function(req, res){
    res.status(301).redirect('/');
});

//start http listening
http.listen(port, function(){
    console.log('listening on *:' + port);
});