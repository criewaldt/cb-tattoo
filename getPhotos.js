var fs = require('fs');
var color = './public/tattoos/color';
var bw = './public/tattoos/black';
var tats = {'color':[], 'black':[]};
function getTats(callback){
    fs.readdir(color, function(err, items) {
       tats.color.push(items);      
    });
    fs.readdir(bw, function(err, items) {
       tats.bw.push(items);      
    });
    callback(tats);
}
exports.getTats = getTats;