#!/usr/bin/env node

var fs = require('fs');
var concat = require('concat-stream');
var minimist = require('minimist');
var collapse = require('../');

var argv = minimist(process.argv.slice(2), {
    alias: { h: 'help', i: 'infile', o: 'outfile' }
});
if (argv.help) {
    return fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout)
    ;
}

var infile = argv.infile || argv._[0];
var input = infile && infile !== '-'
    ? fs.createReadStream(infile)
    : process.stdin
;
var outfile = argv.outfile;
var output = outfile && outfile !== '-'
    ? fs.createWriteStream(outfile)
    : process.stdout
;

input.pipe(concat({encoding: 'string'}, function (body) {
    collapse(body).pipe(output);
}));
