var parse = require('acorn').parse;

module.exports = function (src) {
    // If src is a Buffer, esprima will just stringify it, so we beat them to
    // the punch. This avoids the problem where we're using esprima's range
    // indexes -- which are meant for a UTF-16 string -- in a buffer that
    // contains UTF-8 encoded text.
    if (typeof src !== 'string') {
        src = String(src);
    }

    var ast = parse(src, {
      range: true,
      ecmaVersion: 6
    });

    ast.body = ast.body.filter(function(node) {
        return node.type !== 'EmptyStatement';
    });

    if (ast.body.length !== 1) return;
    if (ast.body[0].type !== 'ExpressionStatement') return;
    if (ast.body[0].expression.type === 'UnaryExpression') {
        var body = ast.body[0].expression.argument;
    } else if (ast.body[0].expression.type === 'AssignmentExpression') {
        var body = ast.body[0].expression.right;
    } else {
        var body = ast.body[0].expression;
    }

    if (body.type !== 'CallExpression') return;

    var args = body.arguments;
    if (args.length === 1) args = extractStandalone(args) || args;
    if (args.length !== 3) return;
    
    if (args[0].type !== 'ObjectExpression') return;
    if (args[1].type !== 'ObjectExpression') return;
    if (args[2].type !== 'ArrayExpression') return;
    
    var files = args[0].properties;
    var cache = args[1];
    var entries = args[2].elements.map(function (e) {
        return e.value
    });
    
    return files.map(function (file) {
        var body = file.value.elements[0].body.body;
        var start, end;
        if (body.length === 0) {
            start = body.start || 0;
            end = body.end || 0;
        }
        else {
            start = body[0].start;
            end = body[body.length-1].end;
        }
        
        var depProps = file.value.elements[1].properties;
        var deps = depProps.reduce(function (acc, dep) {
            var key = dep.key.type === 'Literal' 
                ? dep.key.value 
                : dep.key.name;
            acc[key] = dep.value.value;
            return acc;
        }, {});
        var row = {
            id: file.key.value,
            source: src.slice(start, end),
            deps: deps
        };
        if (entries.indexOf(row.id) >= 0) row.entry = true;
        return row;
    });
};

function extractStandalone (args) {
    if (args[0].type !== 'FunctionExpression') return;
    if (args[0].body.length < 2) return;
    if (args[0].body.body.length < 2) return;

    args = args[0].body.body[1].argument;
    if (args.type !== 'CallExpression') return;
    if (args.callee.type !== 'CallExpression') return;

    return args.callee.arguments;
};
