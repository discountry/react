"use strict";

var grunt = require("grunt"),
    fs = require("fs"),
    gzip = require("gzip-js"),
    exec = require("child_process").exec,
    _ = require("lodash"),
    files = [ "tasks/compare-size.js", "test/compare-size.js" ],
    compressors = [ "", "gz" ],
    sizecache = ".sizecache.json",
    harness = "harness/harness.js",
    rfileLine = /^\s*((?:[-+=?0-9]+\s+)+)(.*)/,
    overwritten = {},
    cacheEntry_0_3 = {},
    cacheEntry = {};

function configureHarness() {
  grunt.file.write( harness, "module.exports = " + [].join.call( arguments, "\n" ));
}

function indexOf( array, re ) {
  var i = 0,
    len = array.length;
  for ( ; i < len; i++ ) {
    if ( re.test( array[i] ) ) {
      return i;
    }
  }
  return -1;
}

function formatDelta( delta ) {
  return delta ?
    delta > 0 ? "+" + delta : delta :
    delta === 0 ? "=" : "?";
}

function backfillCompression( cache, test ) {
  Object.keys( cache ).forEach(function( label ) {
    // Skip metadata
    if ( !label ) {
      return;
    }

    // Skip the last file (which was always compressed)
    files.slice( 0, -1 ).forEach(function( file ) {
      compressors.forEach(function( compressor ) {
        // Make sure that compressed data is not already present
        if ( compressor && compressor in cache[ label ][ file ] ) {
          test.strictEqual( cache[ label ][ file ][ compressor ], undefined, "No " + compressor + " data" );
        // ...and add it
        } else if ( compressor ) {
          cache[ label ][ file ][ compressor ] = cacheEntry[ file ][ compressor ];
        }
      });
    });
  });
}

function augmentCache( key, head, cache ) {
  cache = cache || { "": { version: 0.4, tips: {} } };
  cache[ key ] = _.cloneDeep( cacheEntry );
  if ( head ) {
    cache[""].tips[ key ] = head;
  }
  return cache;
}

function testTask( test, task, args, success, failure ) {
  exec("grunt " + task + " " + (args || []).join(" "), {}, function( err, stdout ) {
    console.log( ("\n\nOUTPUT:")["bold"] +
        ( "\n" + stdout ).replace( /\n/g, "\n    " ) );

    // No error; send output to success callback
    if ( !err ) {
      success( stdout );

    // Expected error; send output to failure callback
    } else if ( failure ) {
      failure( stdout );

    // Unexpected error
    } else {
      test.ok( false, "Error: " + err );
      test.done();
    }
  });
}

function testCompare( test, beforeCache, args, standardTests, success ) {
  if ( beforeCache == null ) {
    if ( fs.existsSync( sizecache ) ) {
      fs.unlinkSync( sizecache );
    }
  } else {
    grunt.file.write( sizecache, JSON.stringify( beforeCache ) );
  }

  testTask( test, [ "compare_size" ].concat( args || [] ).join(":"), [], function( result ) {
    var expected = {},
        lines = grunt.log.uncolor( result ).split("\n").map(function( line ) { return line.trim(); }),
        details = {
          headers: lines.filter(function( line ) {
            return (/ Sizes| Compared/).test( line );
          }),
          saves: lines.filter(function( line ) {
            return (/^Saved as: /).test( line );
          }),
          deltas: {}
        },
        cache = grunt.file.readJSON( sizecache );

    // Store the array of deltas output per file per label for easy comparison
    details.headers.forEach(function( header ) {
      var parts,
          i = lines.indexOf( header ) + 1;
      details.deltas[ header ] = {};
      for ( ; (parts = rfileLine.exec( lines[ i ] )); i++ ) {
        details.deltas[ header ][ parts[ 2 ] ] = parts[ 1 ].match( /\S+/g );
      }
    });

    // Conditional sanity checks for cache/output consistency
    if ( standardTests ) {
      // Promote beforeCache to labeled (0.3) format
      if ( beforeCache && !beforeCache[""] ) {
        beforeCache = { "": undefined, " last run": beforeCache };
      }

      // Check command-line output
      test.ok( (/ Sizes$/).test( details.headers[ 0 ] ), "Raw sizes first" );
      Object.keys( beforeCache || {} ).forEach(function( label ) {
        var testLabel = label.replace( /^ /, "" ) || "raw",
            rlabel = label ? new RegExp( " Compared to " + testLabel + "( .*)?" ) : / Sizes/,
            index = indexOf( lines, rlabel ),
            outputCompressors = [""].concat(
              ( lines[ index ] || "" ).replace( rlabel, "" ).replace( /raw/, "" ).match( /\S+/g )
            ),
            detail = {
              lines: lines.slice( index + 1, index + 1 + files.length ),
              files: [],
              values: {}
            },
            expectedValues = {};

        // Get files and values from the comparison lines
        detail.lines.forEach(function( line ) {
          var match = rfileLine.exec( line ) || [],
              sizes = ( match[ 1 ] || "" ).match( /\S+/g ) || [],
              file = match[ 2 ],
              values = detail.values[ file ] = {};

          detail.files.push( file );
          outputCompressors.forEach(function( label, i ) {
            values[ label ] = sizes[ i ];
          });
        });


        test.ok( index >= 0, testLabel );
        test.deepEqual( detail.files, files, testLabel + ": all files output" );
        test.ok( !lines[ index + 1 + files.length ], testLabel + ": no unexpected files output" );

        // Check raw sizes
        if ( !label ) {
          test.deepEqual( detail.values, cacheEntry, testLabel + ": all sizes match cache" );

        // Check size comparisons
        } else {
          files.forEach(function( file ) {
            var sizeBefore = ( beforeCache[ label ] || {} )[ file ],
                expected = {};

            // 0.4 format
            if ( typeof sizeBefore === "object" ) {
              Object.keys( sizeBefore ).forEach(function( compressor ) {
                expected[ compressor ] = formatDelta( cacheEntry[ file ][ compressor ] -
                    sizeBefore[ compressor ] );
              });

            // Pre-0.4 format
            } else {
              expected = { "": formatDelta( cacheEntry[ file ][""] - sizeBefore ) };
              outputCompressors.forEach(function( compressor ) {
                expected[ compressor ] = formatDelta( cacheEntry[ file ][ compressor ] -
                    ( beforeCache[ label ] || {} )[ file + "." + compressor ] );
              });
            }

            test.deepEqual( detail.values[ file ], expected, testLabel + ": all deltas match cache for " + file );
          });
        }
      });

      // Check expected deltas
      if ( typeof standardTests === "object" ) {
        test.equal( details.headers.length, Object.keys( standardTests ).length + 1, "Header count" );
        Object.keys( standardTests ).forEach(function( label, i ) {
          var headerIndex = i + 1,
              tip = beforeCache[""].tips[ label ],
              re = " Compared to " + label.replace( /^\s/, "" ) + ( tip ? " @ " + tip : "" ) + "$";
          test.ok( (new RegExp( re )).test( details.headers[ headerIndex ] ),
              "Correct sequence: " + label );
          test.deepEqual( details.deltas[ details.headers[ headerIndex ] ], standardTests[ label ],
              "Deltas correct: " + label );
        });
      }

      // Check cache contents
      test.equal( typeof cache, "object", "Size cache exists" );
      test.equal( typeof cache[""], "object", "Size cache has metadata" );
      test.equal( cache[""].version, 0.4, "Size cache is correctly versioned" );
      test.equal( typeof cache[""].tips, "object", "Size cache identifies branch tips" );
      test.deepEqual( cache[" last run"], cacheEntry, "Size cache includes 'last' data" );
    }

    // Test-specific assertions
    success( lines, cache, details );
  });
}

module.exports["compare_size"] = {
  "setup": function( test ) {
    // Store about-to-be-overwritten data
    [ sizecache, harness ].forEach(function( old ) {
      overwritten[ old ] = fs.existsSync( old ) ? grunt.file.read( old ) : undefined;
    });

    // Get file sizes for later comparison
    files.forEach(function( file, i ) {
      var contents = fs.existsSync( file ) ? grunt.file.read( file ) : "",
          compressed = contents ? gzip.zip( contents, {} ) : "";
      cacheEntry[ file ] = { "": contents.length, "gz": compressed.length };
      cacheEntry_0_3[ file ] = contents.length;
      if ( i + 1 === files.length ) {
        cacheEntry_0_3[ file + ".gz" ] = compressed.length;
      }
    });

    test.done();
  },

  "off-tip/working-changes, old-format cache": function( test ) {
    var expectedDeltas = { " last run": {} },
        harnesses = [
          // Off-tip
          "function( done ) { done('branch not found'); };",
          // Working-changes
          "function( done ) { done( null, { branch: 'wip', head: 'deadbeef', changed: true }); };"
        ];

    files.forEach(function( file, index ) {
      expectedDeltas[" last run"][ file ] = compressors.map(function( compressor ) {
        // Pre-0.4 caches only stored compressed data for the last file in the list
        return !compressor || index + 1 === files.length ?
          "=" :
          "?";
      });
    });

    next();

    function next() {
      if ( harnesses.length ) {
        configureHarness( harnesses.shift() );
        testCompare( test, cacheEntry_0_3, [], false, check );
      } else {
        test.done();
      }
    }

    function check( lines, cache, detail ) {
      // Output tests
      test.equal( detail.headers.length, 2, "Header count" );
      test.ok( (/ Sizes$/).test( detail.headers[ 0 ] ), "Correct placement: Sizes" );
      test.ok( (/ Compared to last run$/).test( detail.headers[ 1 ] ), "Cache interpreted as last run" );
      test.deepEqual( detail.deltas[ detail.headers[ 1 ] ], expectedDeltas[" last run"], "Deltas correct: last run" );
      test.deepEqual( detail.saves, [], "Only saved to last run" );

      // Cache tests
      test.deepEqual( cache[""].tips, {}, "No recorded branch tips" );
      test.deepEqual( cache, augmentCache(" last run"), "No unexpected data" );

      next();
    }
  },

  "off-tip/working-changes, no cache": function( test ) {
    var harnesses = [
          // Off-tip
          "function( done ) { done('branch not found'); };",
          // Working-changes
          "function( done ) { done( null, { branch: 'wip', head: 'deadbeef', changed: true }); };"
        ];

    next();

    function next() {
      if ( harnesses.length ) {
        configureHarness( harnesses.shift() );
        testCompare( test, undefined, [], true, check );
      } else {
        test.done();
      }
    }

    function check( lines, cache, detail ) {
      // Output tests
      test.equal( detail.headers.length, 1, "Header count" );
      test.ok( (/ Sizes$/).test( detail.headers[ 0 ] ), "Correct placement: Sizes" );
      test.deepEqual( detail.saves, [], "Only saved to last run" );

      // Cache tests
      test.deepEqual( cache[""].tips, {}, "No recorded branch tips" );
      test.deepEqual( cache, augmentCache(" last run"), "No unexpected data" );

      next();
    }
  },

  "off-tip/working-changes, zero cache": function( test ) {
    var labels = ["zeroes"],
        expectedDeltas = _.zipObject( labels, labels.map(function() { return {}; }) ),
        base = augmentCache("zeroes"),
        expected = augmentCache( " last run", false, augmentCache("zeroes") ),
        harnesses = [
          // Off-tip
          "function( done ) { done('branch not found'); };",
          // Working-changes
          "function( done ) { done( null, { branch: 'wip', head: 'deadbeef', changed: true }); };"
        ];

    files.forEach(function( file ) {
      _.values( expectedDeltas ).forEach(function( obj ) {
        obj[ file ] = [];
      });
      compressors.forEach(function( compressor ) {
        base["zeroes"][ file ][ compressor ] = expected["zeroes"][ file ][ compressor ] = 0;
        expectedDeltas["zeroes"][ file ].push( "+" + cacheEntry[ file ][ compressor ] );
      });
    });

    next();

    function next() {
      if ( harnesses.length ) {
        configureHarness( harnesses.shift() );
        testCompare( test, base, [], expectedDeltas, check );
      } else {
        test.done();
      }
    }

    function check( lines, cache, detail ) {
      // Branch logging
      test.deepEqual( detail.saves, [], "Only saved to last run" );

      // New cache contents
      test.deepEqual( cache[""].tips, {}, "No recorded branch tips" );
      test.deepEqual( cache, expected, "No unexpected data" );

      next();
    }
  },

  "off-tip/working-changes, hash cache": function( test ) {
    var labels = [ "branch", "zeroes", "ones", " last run" ],
        expectedDeltas = _.zipObject( labels, labels.map(function() { return {}; }) ),
        base = augmentCache( "branch", "tip",
          augmentCache(" last run", false,
            augmentCache( "ones", false, augmentCache("zeroes") )
          )
        ),
        expected = augmentCache( "branch", "tip",
          augmentCache(" last run", false,
            augmentCache( "ones", false, augmentCache("zeroes") )
          )
        ),
        harnesses = [
          // Off-tip
          "function( done ) { done('branch not found'); };",
          // Working-changes
          "function( done ) { done( null, { branch: 'wip', head: 'deadbeef', changed: true }); };"
        ];

    files.forEach(function( file, index ) {
      _.values( expectedDeltas ).forEach(function( obj ) {
        obj[ file ] = [];
      });
      compressors.forEach(function( compressor ) {
        expectedDeltas["branch"][ file ].push("=");

        base["zeroes"][ file ][ compressor ] = expected["zeroes"][ file ][ compressor ] = 0;
        expectedDeltas["zeroes"][ file ].push( "+" + cacheEntry[ file ][ compressor ] );

        base["ones"][ file ][ compressor ] = expected["ones"][ file ][ compressor ] = cacheEntry[ file ][ compressor ] + 1;
        expectedDeltas["ones"][ file ].push("-1");

        base[" last run"][ file ][ compressor ] = cacheEntry[ file ][ compressor ] - index;
        expectedDeltas[" last run"][ file ].push( index ? "+" + index : "=" );
      });
    });

    next();

    function next() {
      if ( harnesses.length ) {
        configureHarness( harnesses.shift() );
        testCompare( test, base, [], expectedDeltas, check );
      } else {
        test.done();
      }
    }

    function check( lines, cache, detail ) {
      // Branch logging
      test.deepEqual( detail.saves, [], "Only saved to last run" );

      // New cache contents
      test.deepEqual( cache[""].tips, { branch: "tip" }, "Branch tips unchanged" );
      test.deepEqual( cache, expected, "No unexpected data" );

      next();
    }
  },

  "at-tip, old-format cache": function( test ) {
    var expectedDeltas = { " last run": {} };

    files.forEach(function( file, index ) {
      expectedDeltas[" last run"][ file ] = compressors.map(function( compressor ) {
        // Pre-0.4 caches only stored compressed data for the last file in the list
        return !compressor || index + 1 === files.length ?
          "=" :
          "?";
      });
    });

    configureHarness('function( done ) { done( null, { branch: "branch", head: "tip", changed: false }); };');
    testCompare( test, cacheEntry_0_3, [], false, function( lines, cache, detail ) {
      // Output tests
      test.equal( detail.headers.length, 2, "Header count" );
      test.ok( (/ Sizes$/).test( detail.headers[ 0 ] ), "Correct placement: Sizes" );
      test.ok( (/ Compared to last run$/).test( detail.headers[ 1 ] ), "Cache interpreted as last run" );
      test.deepEqual( detail.deltas[ detail.headers[ 1 ] ], expectedDeltas[" last run"], "Deltas correct: last run" );
      test.deepEqual( detail.saves, ["Saved as: branch"], "Saved to branch label" );

      // Cache tests
      test.deepEqual( cache[""].tips, { branch: "tip" }, "New tip saved" );
      test.deepEqual( cache.branch, cacheEntry, "Sizes updated for active branch" );
      test.deepEqual( cache, augmentCache( "branch", "tip", augmentCache(" last run") ), "No unexpected data" );

      test.done();
    });
  },

  "at-tip, no cache": function( test ) {
    var expected = augmentCache( " last run", false, augmentCache( "branch", "tip" ) );

    configureHarness('function( done ) { done( null, { branch: "branch", head: "tip", changed: false }); };');
    testCompare( test, undefined, [], true, function( lines, cache, detail ) {
      // Output tests
      test.equal( detail.headers.length, 1, "Header count" );
      test.ok( (/ Sizes$/).test( detail.headers[ 0 ] ), "Correct placement: Sizes" );
      test.deepEqual( detail.saves, ["Saved as: branch"], "Saved to branch label" );

      // Cache tests
      test.deepEqual( cache[""].tips, { branch: "tip" }, "New tip saved" );
      test.deepEqual( cache.branch, cacheEntry, "Sizes updated for active branch" );
      test.deepEqual( cache, expected, "No unexpected data" );

      test.done();
    });
  },

  "at-tip, zero cache": function( test ) {
    var labels = ["zeroes"],
        expectedDeltas = _.zipObject( labels, labels.map(function() { return {}; }) ),
        base = augmentCache( "zeroes", "old-tip" ),
        expected = augmentCache( " last run", false, augmentCache( "zeroes", "new-tip" ) );

    files.forEach(function( file ) {
      _.values( expectedDeltas ).forEach(function( obj ) {
        obj[ file ] = [];
      });
      compressors.forEach(function( compressor ) {
        base["zeroes"][ file ][ compressor ] = 0;
        expectedDeltas["zeroes"][ file ].push( "+" + cacheEntry[ file ][ compressor ] );
      });
    });

    configureHarness('function( done ) { done( null, { branch: "zeroes", head: "new-tip", changed: false }); };');
    testCompare( test, base, [], expectedDeltas, function( lines, cache, detail ) {
      // Branch logging
      test.deepEqual( detail.saves, ["Saved as: zeroes"], "Saved to branch label" );

      // New cache contents
      test.deepEqual( cache[""].tips, { zeroes: "new-tip" }, "New tip saved" );
      test.deepEqual( cache.zeroes, cacheEntry, "Sizes updated for active branch" );
      test.deepEqual( cache, expected, "No unexpected data" );

      test.done();
    });
  },

  "at-tip, hash cache": function( test ) {
    var labels = [ "ones", "stale", "zeroes", " last run" ],
        expectedDeltas = _.zipObject( labels, labels.map(function() { return {}; }) ),
        base = augmentCache( "stale", "tip",
          augmentCache(" last run", false,
            augmentCache( "ones", "old-tip", augmentCache("zeroes") )
          )
        ),
        expected = augmentCache( "stale", "tip",
          augmentCache(" last run", false,
            augmentCache( "ones", "new-tip", augmentCache("zeroes") )
          )
        );

    files.forEach(function( file, index ) {
      _.values( expectedDeltas ).forEach(function( obj ) {
        obj[ file ] = [];
      });
      compressors.forEach(function( compressor ) {
        base["stale"][ file ][ compressor ] = expected["stale"][ file ][ compressor ] = cacheEntry[ file ][ compressor ] + 1;
        expectedDeltas["stale"][ file ].push("-1");

        base["zeroes"][ file ][ compressor ] = expected["zeroes"][ file ][ compressor ] = 0;
        expectedDeltas["zeroes"][ file ].push( "+" + cacheEntry[ file ][ compressor ] );

        base["ones"][ file ][ compressor ] = cacheEntry[ file ][ compressor ] + 1;
        expectedDeltas["ones"][ file ].push("-1");

        base[" last run"][ file ][ compressor ] = cacheEntry[ file ][ compressor ] - index;
        expectedDeltas[" last run"][ file ].push( index ? "+" + index : "=" );
      });
    });

    configureHarness('function( done ) { done( null, { branch: "ones", head: "new-tip", changed: false }); };');
    testCompare( test, base, [], expectedDeltas, function( lines, cache, detail ) {
      // Branch logging
      test.deepEqual( detail.saves, ["Saved as: ones"], "Saved to branch label" );

      // New cache contents
      test.deepEqual( cache[""].tips, { stale: "tip", ones: "new-tip" }, "New tip saved" );
      test.deepEqual( cache.ones, cacheEntry, "Sizes updated for active branch" );
      test.deepEqual( cache.stale, expected.stale, "Sizes not updated for inactive branch" );
      test.deepEqual( cache, expected, "No unexpected data" );

      test.done();
    });
  },

  "single file": function( test ) {
    var singleFile = files[0],
        labels = [ "branch", "zeroes", "ones", " last run" ],
        expectedDeltas = _.zipObject( labels, labels.map(function() { return {}; }) ),
        base = augmentCache( "branch", "tip",
          augmentCache(" last run", false,
            augmentCache( "ones", false, augmentCache("zeroes") )
          )
        ),
        expected = augmentCache( "branch", "tip",
          augmentCache(" last run", false,
            augmentCache( "ones", false, augmentCache("zeroes") )
          )
        );

    files.forEach(function( file, index ) {
      _.values( expectedDeltas ).forEach(function( obj ) {
        obj[ file ] = [];
      });
      compressors.forEach(function( compressor ) {
        expectedDeltas["branch"][ file ].push("=");

        base["zeroes"][ file ][ compressor ] = expected["zeroes"][ file ][ compressor ] = 0;
        expectedDeltas["zeroes"][ file ].push( "+" + cacheEntry[ file ][ compressor ] );

        base["ones"][ file ][ compressor ] = expected["ones"][ file ][ compressor ] = cacheEntry[ file ][ compressor ] + 1;
        expectedDeltas["ones"][ file ].push("-1");

        base[" last run"][ file ][ compressor ] = cacheEntry[ file ][ compressor ] - index;
        expectedDeltas[" last run"][ file ].push( index ? "+" + index : "=" );
      });
    });

    // Configure state
    configureHarness("function( done ) { done( null, { branch: 'wip', head: 'deadbeef', changed: true }); };");
    grunt.file.write( sizecache, JSON.stringify( base ) );

    testCompare( test, base, [ "", singleFile ], false, function( lines, cache, details ) {
      var headerIndex = indexOf( lines, /raw/ ),
          outputCompressors = headerIndex >= 0 ?
            [""].concat( lines[ headerIndex ].replace( "raw", "" ).match( /\S+/g ) ) :
            [];

      // Check command-line output
      test.ok( !/\d/.test( lines[ headerIndex ] ), "Header row" );
      test.equal( lines[ headerIndex + 1 ].slice( -singleFile.length - 1 ), " " + singleFile,
          "Raw sizes for file" );
      Object.keys( base ).forEach(function( label ) {
        var testLabel = label.replace( /^ /, "" ) || "raw",
            rlabel = new RegExp( " " + ( label ? testLabel : singleFile ) + "( .*)?" ),
            index = indexOf( lines, rlabel ),
            line = lines[ index ] || "",
            lineSizes = line.match( /[-+=0-9]+/g ),
            sizeBefore = base[ label ][ singleFile ];

        test.ok( index >= 0, testLabel );

        // Check raw sizes
        if ( !label ) {
          test.deepEqual( _.zipObject( outputCompressors, lineSizes ),
              cacheEntry[ singleFile ], "sizes match cache" );

        // Check size comparisions
        } else {
          test.deepEqual( lineSizes, Object.keys( cacheEntry[ singleFile ] ).map(function( compressor ) {
            return formatDelta( cacheEntry[ singleFile ][ compressor ] - sizeBefore[ compressor ] );
          }), testLabel + ": deltas match cache" );
        }
      });

      // Check branch logging
      test.deepEqual( details.saves, [], "Only saved to last run" );

      // Check cache contents
      test.equal( typeof cache, "object", "Size cache exists" );
      test.equal( typeof cache[""], "object", "Size cache has metadata" );
      test.equal( cache[""].version, 0.4, "Size cache is correctly versioned" );
      test.equal( typeof cache[""].tips, "object", "Size cache identifies branch tips" );
      test.deepEqual( cache[" last run"], cacheEntry, "Size cache includes 'last' data" );
      test.deepEqual( cache[""].tips, { branch: "tip" }, "Branch tips unchanged" );
      test.deepEqual( cache, expected, "No unexpected data" );

      test.done();
    });
  },

  "list": function( test ) {
    var cache = augmentCache( "label", false, augmentCache( "branch", "tip", augmentCache(" last run") ) );

    grunt.file.write( sizecache, JSON.stringify( cache ) );
    testTask( test, "compare_size:list", [], function( result ) {
      var lines = result.toString().split("\n").map(function( line ) { return line.trim(); }),
          index = lines.indexOf("label");

      // Output tests
      test.ok( (/^branch.*@ tip/).test( lines[ index - 1 ] ), "Found branch with correct tip" );
      test.ok( index >= 0, "Found custom label" );
      test.ok( !lines[ index + 1 ], "Last run not listed" );

      // Cache tests
      test.deepEqual( JSON.parse( grunt.file.read( sizecache ) ), cache, "Size cache untouched" );

      test.done();
    });
  },

  "add, old-format cache": function( test ) {
    grunt.file.write( sizecache, JSON.stringify( cacheEntry_0_3 ) );
    testTask( test, "compare_size:add:custom", [], function( result ) {
      var lines = result.toString().split("\n").map(function( line ) { return line.trim(); }),
          cache = grunt.file.readJSON( sizecache ),
          index = lines.indexOf("Last run saved as: custom");

      // Output tests
      test.ok( index >= 0, "Added with correct label" );
      test.ok( !(/^Last run saved/).test( lines[ index - 1 ] ), "No antecedent adds" );
      test.ok( !lines[ index + 1 ], "No subsequent adds" );

      // Cache tests
      backfillCompression( cache, test );
      test.deepEqual( cache[""].tips, {}, "No recorded branch tips" );
      test.deepEqual( cache[" last run"], cacheEntry, "Last run unchanged" );
      test.deepEqual( cache["custom"], cacheEntry, "Custom data stored" );
      test.deepEqual( cache, augmentCache( "custom", false, augmentCache(" last run") ), "No unexpected data" );

      test.done();
    });
  },

  "add, no cache": function( test ) {
    fs.unlinkSync( sizecache );
    testTask( test, "compare_size:add:custom", [], function() {
      test.ok( false, "Error expected" );
    }, function( err ) {
      // Output tests
      test.ok( (/No size data found/).test( err ), "Error found" );

      // Cache tests
      test.ok( !fs.existsSync( sizecache ), "Cache not created" );

      test.done();
    });
  },

  "add, hash cache": function( test ) {
    grunt.file.write( sizecache, JSON.stringify(
      augmentCache( "branch", "tip", augmentCache( "replaced", "tip", augmentCache(" last run") ) ) )
    );
    testTask( test, "compare_size:add:custom:replaced", [], function( result ) {
      var lines = result.toString().split("\n").map(function( line ) { return line.trim(); }),
          cache = grunt.file.readJSON( sizecache ),
          index = lines.indexOf("Last run saved as: custom");

      // Output tests
      test.ok( index >= 0, "First label" );
      test.equal( lines[ index + 1 ], "(removed branch data) Last run saved as: replaced", "Second label" );
      test.ok( !(/^Last run saved/).test( lines[ index - 1 ] ), "No antecedent adds" );
      test.ok( !lines[ index + 2 ], "No subsequent adds" );

      // Cache tests
      test.deepEqual( cache[""].tips, { branch: "tip" }, "Removed branch data" );
      test.deepEqual( cache[" last run"], cacheEntry, "Last run unchanged" );
      test.deepEqual( cache["custom"], cacheEntry, "Custom data stored" );
      test.deepEqual( cache["replaced"], cacheEntry, "Replaced data stored" );
      test.deepEqual( cache, augmentCache( "custom", false,
        augmentCache( "branch", "tip", augmentCache( "replaced", false, augmentCache(" last run") ) ) ),
        "No unexpected data" );

      test.done();
    });
  },

  "remove": function( test ) {
    grunt.file.write( sizecache, JSON.stringify(
      augmentCache( "branch", "tip", augmentCache( "removed", "tip", augmentCache(" last run") ) ) )
    );
    testTask( test, "compare_size:remove:removed", [], function( result ) {
      var lines = result.toString().split("\n").map(function( line ) { return line.trim(); }),
          cache = grunt.file.readJSON( sizecache ),
          index = lines.indexOf("Removed: removed");

      // Output tests
      test.ok( index >= 0, "Removed label" );
      test.ok( !(/^Last run saved/).test( lines[ index - 1 ] ), "No antecedent removes" );
      test.ok( !lines[ index + 1 ], "No subsequent removes" );

      // Cache tests
      test.deepEqual( cache[""].tips, { branch: "tip" }, "No recorded branch tips" );
      test.deepEqual( cache[" last run"], cacheEntry, "Last run unchanged" );
      test.deepEqual( cache["branch"], cacheEntry, "Branch data retained" );
      test.ok( !( "removed" in cache ), "Data removed" );
      test.deepEqual( cache, augmentCache( "branch", "tip", augmentCache(" last run") ),
        "No unexpected data" );

      test.done();
    });
  },

  "empty": function( test ) {
    grunt.file.write( sizecache, JSON.stringify(
      augmentCache( "branch", "tip", augmentCache( "removed", "tip", augmentCache(" last run") ) ) )
    );
    testTask( test, "compare_size:empty", [], function() {
      // Cache tests
      test.ok( !fs.existsSync( sizecache ), "Size cache removed" );

      test.done();
    });
  },

  "indiscriminate prune": function( test ) {
    grunt.file.write( sizecache, JSON.stringify(
      augmentCache( "branch", "tip", augmentCache( "removed", "tip", augmentCache(" last run") ) ) )
    );
    testTask( test, "compare_size:prune", [], function( result ) {
      var lines = result.toString().split("\n").map(function( line ) { return line.trim(); }),
          removes = lines.filter(function( line ) { return (/^Removed:/).test( line ); });

      // output tests
      test.deepEqual( removes, [], "No per-label output" );

      // cache tests
      test.ok( !fs.existsSync( sizecache ), "Size cache removed" );

      test.done();
    });
  },

  "selective prune": function( test ) {
    grunt.file.write( sizecache, JSON.stringify(
      augmentCache( "foo", false, augmentCache( "branch", "tip", augmentCache( "removed", "tip", augmentCache(" last run") ) ) ) )
    );
    testTask( test, "compare_size:prune:bar:branch", [], function( result ) {
      var lines = result.toString().split("\n").map(function( line ) { return line.trim(); }),
          removes = lines.filter(function( line ) { return (/^Removed:/).test( line ); }),
          cache = grunt.file.readJSON( sizecache );

      // output tests
      test.deepEqual( removes.sort(), [ "Removed: foo", "Removed: removed" ], "Explicit per-label output" );

      // cache tests
      test.deepEqual( cache[""].tips, { branch: "tip" }, "Specified branches preserved" );
      test.deepEqual( cache[" last run"], cacheEntry, "Last run unchanged" );
      test.deepEqual( cache["branch"], cacheEntry, "Branch data retained" );
      test.ok( !( "removed" in cache ) && !( "foo" in cache ), "Data removed" );
      test.deepEqual( cache, augmentCache( "branch", "tip", augmentCache(" last run") ),
        "No unexpected data" );

      test.done();
    });
  },

  "teardown": function( test ) {
    // Restore overwritten data
    Object.keys( overwritten ).forEach(function( old ) {
      if ( overwritten[ old ] == null ) {
        if ( fs.existsSync( old ) ) {
          fs.unlinkSync( old );
        }
      } else {
        grunt.file.write( old, overwritten[ old ] );
      }
    });

    test.done();
  }
};
