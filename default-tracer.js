var path = require('path');

exports.trace = function(filename, line, col, name) {
    console.log(path.relative(process.cwd(), filename), line + ':' + col, name || '');
}

exports.filter = function(filename) {
    return !~filename.indexOf('node_modules');
}

