var fs         = require('fs');
var argv       = require('optimist').argv;
var instrument = require('../index')
var resolve    = require('resolve');

if (argv.tracer)
    var tracer = require(resolve(process.cwd(), argv.tracer));
else
    var tracer = require('./default-tracer');

global.$$__trace = tracer.trace;

function loadModule(module, filename) {
    var instrumented = transformModule(filename, tracer.filter);
    module._compile(instrumented, filename);
}

function always() { return true; }

function transformModule(name, fileFilter) {
    fileFilter = fileFilter || always;
    var src = fs.readFileSync(name, 'utf8')
    if (!fileFilter(name)) return src;
    else return instrument(src);
}


require.extensions['.js'] = loadModule;
require(argv._[0]);
