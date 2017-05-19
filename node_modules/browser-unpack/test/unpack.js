var test = require('tape');
var unpack = require('../');
var pack = require('browser-pack');
var concat = require('concat-stream');
var vm = require('vm');

var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/bundle.js', 'utf8');
var empty = fs.readFileSync(__dirname + '/files/empty.js', 'utf8');

test('unpack', function (t) {
    t.plan(1);
    
    var p = pack({ raw: true });
    p.pipe(concat(function (body) {
        var log = function (msg) {
            t.equal(msg, 521);
        };
        var c = { console: { log: log } };
        vm.runInNewContext(body.toString('utf8'), c);
    }));
    
    var rows = unpack(src);
    rows.forEach(function (row) { p.write(row) });
    p.end();
});

test('does not break on empty modules', function (t) {
    t.plan(1);

    var p = pack({ raw: true });
    var rows = unpack(empty);

    p.pipe(concat(function (body) {
        t.pass('did not emit an error');
    }))

    rows.forEach(function (row) {
        p.write(row);
    })

    p.end();
})
