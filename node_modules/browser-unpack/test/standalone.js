var test = require('tape');
var unpack = require('../');

var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/standalone.js', 'utf8');

test('standalone', function (t) {
    t.plan(2);
    t.doesNotThrow(function() {
        var rows = unpack(src);
        t.equal(rows.length, 3, 'should unpack 3 rows');
    }, 'should not throw');
});
