#!/usr/bin/env node

require.extensions['.js'] = loadModule;

var fs         = require('fs');
var argv       = require('optimist').argv;
var instrument = require('../index')
var resolve    = require('resolve');

if (argv.tracer)
    var tracer = require(resolve.sync(argv.tracer, {basedir: process.cwd()}));
else
    var tracer = require('../default-tracer');

global.$$__trace = tracer.trace;


function loadModule(module, filename) {
    if (!loadModule.tracingEnabled)
        return module._compile(fs.readFileSync(filename, 'utf8'), filename);
    var instrumented = transformModule(filename, tracer.filter);
    module._compile(instrumented, filename);
}

loadModule.tracingEnabled = false;

function always() { return true; }

function transformModule(name, fileFilter) {
    fileFilter = fileFilter || always;
    var src = fs.readFileSync(name, 'utf8')
    if (!fileFilter(name)) return src;
    else try {
        return instrument(src);
    } catch (e) {
        console.error("Error instrumenting", name)
        throw e;
    }
}


var rmod = resolve.sync('./' + argv._[0], {basedir: process.cwd()});

loadModule.tracingEnabled = true;
process.argv = [process.argv[0]].concat(argv._);
require(rmod);
