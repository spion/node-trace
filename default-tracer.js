var path = require('path');

exports.trace = function(filename, line, col) {
    console.log(path.relative(process.cwd(), filename), line + ':' + col);
}

exports.filter = function(filename) {
    return !~filename.indexOf('node_modules');
}

