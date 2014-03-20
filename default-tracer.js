exports.trace = function(filename, line, col) {
    console.log(filename, line + ':' + col);
}

exports.filter = function(filename) {
    return !~filename.indexOf('node_modules');
}

