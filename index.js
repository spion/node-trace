var falafel = require('falafel');

function instrumentSource(src) {
    var out = falafel(src, {loc: true}, function(node) {
        if ((node.type === 'FunctionDeclaration') ||
            (node.type === 'FunctionExpression')) {
            instrumentFunctionBody(node.body, node.id);
        }
    });
    return out.toString();
}

function instrumentFunctionBody(body, id) {
    if (body.body.length < 1) return;
    var src = body.body[0].source();
    var loc = body.body[0].loc.start;
    var traceArgs = ['__filename', loc.line, loc.column];
    if (id && id.name) {
        traceArgs.push(JSON.stringify(id.name));
    }
    var traceCall = '$$__trace(' + traceArgs + ');';
    body.body[0].update(traceCall + src);
}

module.exports = instrumentSource;




