const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');
const path = require('path');

// create session ref:
const dropbox = dropboxV2Api.authenticate({
    token: '1WVVq5c9KN8AAAAAAAAAAdNapSCCZfGkXaQos7_dR4WmY0XDIiziHKLfhXdyOn3b'
});

const bw = './public/tattoos/bw';
const color = './public/tattoos/color';

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

//resize photos?
