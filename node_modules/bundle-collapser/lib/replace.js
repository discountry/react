var falafel = require('falafel');
module.exports = replace;

function replace (src, deps) {
    var opts = {
        ecmaVersion: 6,
        allowReturnOutsideFunction: true
    };
    return falafel(src, opts, function (node) {
        if (isRequire(node)) {
            var value = node.arguments[0].value;
            if (has(deps, value) && deps[value]) {
                node.update('require(' + JSON.stringify(deps[value]) + ')');
            }
        }
    }).toString();
}

function isRequire (node) {
    var c = node.callee;
    return c
        && node.type === 'CallExpression'
        && c.type === 'Identifier'
        && c.name === 'require'
        && node.arguments[0]
        && node.arguments[0].type === 'Literal'
    ;
}

function has (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
