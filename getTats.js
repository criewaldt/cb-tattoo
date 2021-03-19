const fs = require('fs');
const path = require('path');
const color = path.join(__dirname, './public/tattoos/color');
const bw = path.join(__dirname, './public/tattoos/bw');
var tats = {color:[], bw:[]};
function getTats(callback){
    fs.readdir(color, function(err, items) {
       tats.color = items;
    });
    fs.readdir(bw, function(err, items) {
       tats.bw = items;
    });
    callback(tats);
}
exports.getTats = getTats;