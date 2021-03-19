// Chandler Bass Tattoo - index.js
var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

//new
const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');
const path = require('path');

//env variables
var EMAIL_USER = '';
var EMAIL_PW = '';
var DROPBOX_ACCESS_TOKEN = '';
var RECAPTCHA = '';



// create session ref:
const dropbox = dropboxV2Api.authenticate({
    token: process.env.DROPBOX_ACCESS_TOKEN || DROPBOX_ACCESS_TOKEN
});

const bw = './public/tattoos/bw';
const color = './public/tattoos/color';

var tattoos = {'bw':[],'color':[]};

//BW PHOTOS
//delete photos
fs.readdir(bw, (err, files) => {
  if (err) throw err;

  for (var file of files) {
    console.log('removed ' + file);
    fs.unlink(path.join(bw, file), err => {
      if (err) throw err;
    });
  }
});

//download dropbox photos
dropbox({
    resource: 'files/list_folder',
    parameters: {
        'path': '/website/bw',
        'recursive': false,
        'include_media_info': false,
        'include_deleted': false,
        'include_has_explicit_shared_members': false,
        'include_mounted_folders': true,
        'include_non_downloadable_files': true
    }
}, (err, result, response) => {
    result.entries.forEach(function (imageName) {
        tattoos.bw.push(path.join('/tattoos/bw', imageName.name));
        console.log('about to download image: '+imageName.name);
        //download images
        dropbox({
            resource: 'files/download',
            parameters: {
                path: imageName.path_lower
            }
        }, (err, result, response) => {
            //download completed
        })
            //save file
            .pipe(fs.createWriteStream(path.join(bw, imageName.name))); 
            
        });

});






// COLOR images
fs.readdir(color, (err, files) => {
  if (err) throw err;

  for (var file of files) {
    console.log('removed ' + file);
    fs.unlink(path.join(color, file), err => {
      if (err) throw err;
    });
  }
});
//download dropbox photos
dropbox({
    resource: 'files/list_folder',
    parameters: {
        'path': '/website/color',
        'recursive': false,
        'include_media_info': false,
        'include_deleted': false,
        'include_has_explicit_shared_members': false,
        'include_mounted_folders': true,
        'include_non_downloadable_files': true
    }
}, (err, result, response) => {
    result.entries.forEach(function (imageName) {
        tattoos.color.push(path.join('/tattoos/color', imageName.name));
        console.log('about to download image: '+imageName.name);
        //download images
        dropbox({
            resource: 'files/download',
            parameters: {
                path: imageName.path_lower
            }
        }, (err, result, response) => {
            //download completed
        })
            //save file
            
            .pipe(fs.createWriteStream(path.join(color, imageName.name))); 
            
        });
      

});



//end new





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
    user: process.env.EMAIL_USER || EMAIL_USER,
    pass: process.env.EMAIL_PW || EMAIL_PW
  }
});

/*
//dropbox
//get all current tattoo photo web links from dropbox
var tattoos = {'bw':[],'color':[]};
const Dropboxs = require('dropbox');
var dbx = new Dropboxs.Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN || DROPBOX_ACCESS_TOKEN});
//get bw list of images    
dbx.filesListFolder({path: "/website/bw"})
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
dbx.filesListFolder({path: "/website/color"})
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
*/
    
//request
const request = require('request');

// Pug Tempalate Engine
require('pug');
app.set('view engine', 'pug');

// Serve Static Files
app.use(express.static(__dirname + '/public'));

// email post
app.post('/email', function(req, res) {
    //console.log(req.body);
    
    // Put your secret key here.
    var secretKey = process.env.RECAPTCHA || RECAPTCHA;
    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    //check recaptcha
    request(verificationUrl,function(error,response,body) {
      body = JSON.parse(body);
      console.log(body);
      // Success will be true or false depending upon captcha validation.
      if(body.success !== undefined && !body.success) {
          res.send('Are you a robot?...');
      } else {
          //NOT A ROBOT!
          try {
              //send email
              var mailOptions = {
                  from: process.env.EMAIL_USER || EMAIL_USER,
                  to: process.env.EMAIL_USER || EMAIL_USER,
                  cc: 'criewaldt@gmail.com',
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
              console.log(err);
          }
      }
    });
    
    
    
});


    

// index view
app.get('/', function(req, res) {
    //console.log(tattoos);
    res.render('index', {myTats:tattoos});
});

// test view
app.get('/go', function(req, res) {
    console.log(tattoos);
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