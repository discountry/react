var test = require('tape');
var unpack = require('../');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/files/utf-8.js', 'utf8');
var buf = new Buffer(src);

test('multi-byte characters', function (t) {
    t.plan(6);
    t.doesNotThrow(function() {
        var srcRows = unpack(src);
        var bufRows = unpack(buf);
        t.equal(srcRows.length, bufRows.length, 'should unpack the same number of rows');
        t.equal(srcRows.length, 3, 'should unpack 3 rows');
        for (var i = 0; i < 3; i++) {
          t.equal(bufRows[i].source, srcRows[i].source, 'should have the same source');
        }
    }, 'should not throw');
});
