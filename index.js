var falafel = require('falafel');

function instrumentSource(src) {
    var out = falafel(src, {loc: true}, function(node) {
        if ((node.type === 'FunctionDeclaration') ||
            (node.type === 'FunctionExpression')) {
            instrumentFunctionBody(node.body);
        }
    });
    return out.toString();
}

function instrumentFunctionBody(body) {
    if (body.body.length < 1) return;
    var src = body.body[0].source();
    var loc = body.body[0].loc.start;
    body.body[0].update('$$__trace(__filename,' +
                        loc.line + ',' + loc.column + ');' + src);
}

module.exports = instrumentSource;




