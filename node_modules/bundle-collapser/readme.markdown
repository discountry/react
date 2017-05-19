# bundle-collapser

convert bundle paths to IDs to save bytes in browserify bundles

[![build status](https://secure.travis-ci.org/substack/bundle-collapser.png)](http://travis-ci.org/substack/bundle-collapser)

# example

The easiest way to use bundle-collapser is from the plugin:

```
$ browserify -p bundle-collapser/plugin main.js
```

Instead of the usual output which would have the original `require('./foo.js')`
style calls in it, the output just has `require(2)` style paths, which minifies
more compactly:

``` js
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (n) { return n * 5 }

},{}],2:[function(require,module,exports){
var bar = require(1);

module.exports = function (n) { return bar(n+1) }

},{}],3:[function(require,module,exports){
var foo = require(2);
var bar = require(1);

console.log(foo(5) * bar(2));

},{}]},{},[3]);
```
## api

You can use bundle-collapser from the api too:

``` js
var collapse = require('bundle-collapser');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/bundle.js', 'utf8');
collapse(src).pipe(process.stdout);
```

# usage

There is also a command-line program included in this distribution:

```
usage: bundle-collapser {FILE | -} {OPTIONS}

  Collapse a browser-pack/browserify bundle from STDIN or a FILE.

OPTIONS:

  -h --help  Show this message.

```

# methods

``` js
var collapse = require('bundle-collapser')
```

## var stream = collapse(src)

Return a readable `stream` of output from
[browser-pack](https://npmjs.org/package/browser-pack) with the input source
string `src` converted to have its `require()` calls collapsed down to the
dependency targets in the "deps" fields from the unpacking.

# install

With [npm](https://npmjs.org), to get the library do:

```
npm install bundle-collapser
```

and to get the command-line program do:

```
npm install -g bundle-collapser
```

# license

MIT
