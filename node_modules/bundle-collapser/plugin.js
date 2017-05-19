var through = require('through2');
var replace = require('./lib/replace.js');

module.exports = function apply (b, opts) {
    b.pipeline.get('label').push(through.obj(function (row, enc, next) {
        row.source = replace(row.source, row.deps);
        var deps = {};
		for (var key in row.deps) {
			deps[row.deps[key]] = row.deps[key];
		}
        row.deps = deps;
        this.push(row);
        next();
    }));
    b.once('reset', function () { apply(b, opts) });
};
