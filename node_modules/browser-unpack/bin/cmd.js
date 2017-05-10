#!/usr/bin/env node

var parse = require('../');
var concat = require('concat-stream');
var fs = require('fs');

var minimist = require('minimist');
var argv = minimist(process.argv.slice(2));
if (argv.help || argv.h) {
    return fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout)
    ;
}

process.stdin.pipe(concat(function (body) {
    var rows = parse(body);
    if (!rows) {
        console.error("couldn't parse this bundle");
        process.exit(1);
    }
    
    console.log('[');
    rows.forEach(function (row, index) {
        if (index > 0) console.log(',');
        console.log(JSON.stringify(row));
    });
    console.log(']');
}));
