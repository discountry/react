var exec = require('child_process').exec;
var test = require('tape');
var unpack = require('browser-unpack');
var binFile = __dirname + '/../bin/cmd.js';
var bundleFile = __dirname + '/non-ascii/non-ascii.js';

test('non-ascii piping', function (t) {
    t.plan(2);
    exec(binFile + ' < ' + bundleFile, function (err, stdout) {
      t.notOk(err, 'bundle-collapse should exit successfully');
      var rows = unpack(stdout);
      t.equal(rows.length, 1, 'should produce a valid bundle');
    });
});
