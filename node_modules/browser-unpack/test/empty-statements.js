var test = require('tape');
var unpack = require('../');
var pack = require('browser-pack');
var concat = require('concat-stream');
var vm = require('vm');

var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/empty-statements.js', 'utf8');

test('uglified', function (t) {
    t.plan(2);
    t.doesNotThrow(function() {
        var p = pack({ raw: true });
        var rows = unpack(src);
        t.equal(rows.length, 3, 'should unpack 3 rows');
    }, 'should not throw');
});
