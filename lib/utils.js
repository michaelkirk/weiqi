// Random id generator
module.exports.generateId = function(len) {
    var id = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz'+
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
                '0123456789-_';
    if(typeof len == "undefined")
      len = 10
    for (i=0; i<len; i++) {
        var index = Math.floor(Math.random() * chars.length)
        id += chars[index];
    }
    return id;
};

