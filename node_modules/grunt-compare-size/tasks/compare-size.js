/*
 * grunt-compare-size
 * https://github.com/rwldrn/grunt-compare-size
 *
 * Copyright (c) 2012 Rick Waldron <waldron.rick@gmail.com> &
 *                     Richard Gibson <richard.gibson@gmail.com> &
 *                      Corey Frang <gnarf@gnarf.net> &
 *                       Mike Sherov <mike.sherov@gmail.com>
 * Licensed under the MIT license.
 */

"use strict";

var _ = require("lodash");
var fs = require("fs");
var exec = require("child_process").exec;

module.exports = function(grunt) {
  // Grunt utilities & task-wide assignments
  var file, log, verbose, defaultCache, lastrun, helpers;

  file = grunt.file;
  log = grunt.log;
  verbose = grunt.verbose;
  defaultCache = ".sizecache.json";
  lastrun = " last run";
  helpers = {

    // Label sequence helper
    sorted_labels: function( cache ) {
      var tips = cache[""].tips;

      // Sort labels: metadata, then branch tips by first add,
      // then user entries by first add, then last run
      // Then return without metadata
      return Object.keys( cache ).sort(function( a, b ) {
        var keys = Object.keys( cache );

        return ( a ? 1 : 0 ) - ( b ? 1 : 0 ) ||
          ( a in tips ? 0 : 1 ) - ( b in tips ? 0 : 1 ) ||
          ( a.charAt(0) === " " ? 1 : 0 ) - ( b.charAt(0) === " " ? 1 : 0 ) ||
          keys.indexOf( a ) - keys.indexOf( b );
      }).slice( 1 );
    },

    // Label with optional commit
    label: function( label, commit ) {
      return label.replace( /^ /, "" ) + ( commit ? " " + ( "@ " + commit )[ "grey" ] : "" );
    },

    // Color-coded size difference
    delta: function( delta, width ) {
        var color = "green";

        if ( delta > 0 ) {
          delta = "+" + delta;
          color = "red";
        } else if ( !delta ) {
          delta = delta === 0 ? "=" : "?";
          color = "grey";
        }

        return _.padStart( delta, width )[ color ];
    },

    // Size cache helper
    get_cache: function( src ) {
      var cache, tmp;

      try {
        cache = fs.existsSync( src ) ? file.readJSON( src ) : undefined;
      } catch ( e ) {
        verbose.error( e );
      }

      // Progressively upgrade `cache`, which is one of:
      // empty
      // {}
      // { file: size [,...] }
      // { "": { tips: { label: SHA1, ... } }, label: { file: size, ... }, ... }
      // { "": { version: 0.4, tips: { label: SHA1, ... } },
      //   label: { file: { "": size, compressor: size, ... }, ... }, ... }
      if ( typeof cache !== "object" ) {
        cache = undefined;
      }
      if ( !cache || !cache[""] ) {
        // If promoting cache to dictionary, assume that data are for last run
        cache = _.zipObject( [ "", lastrun ], [ { version: 0, tips: {} }, cache ] );
      }
      if ( !cache[""].version ) {
        cache[""].version = 0.4;
        _.forEach( cache, function( sizes, label ) {
          if ( !label || !sizes ) {
            return;
          }

          // If promoting sizes to dictionary, assume that compressed size data are indicated by suffixes
          Object.keys( sizes ).sort().forEach(function( file ) {
            var parts = file.split("."),
              prefix = parts.shift();

            // Append compressed size data to a matching prefix
            while ( parts.length ) {
              if ( typeof sizes[ prefix ] === "object" ) {
                sizes[ prefix ][ parts.join(".") ] = sizes[ file ];
                delete sizes[ file ];
                return;
              }
              prefix += "." + parts.shift();
            }

            // Store uncompressed size data
            sizes[ file ] = { "": sizes[ file ] };
          });
        });
      }

      return cache;
    },

    // Files helper.
    sizes: function( task, compressors ) {
      var sizes = {},
          files = file.expand(
            { filter: "isFile" },
            task.filesSrc
          );

      files.forEach(function( src, index ) {
        var contents = file.read( src ),
          fileSizes = sizes[ src ] = { "": contents.length };
        if ( compressors ) {
          Object.keys( compressors ).forEach(function( compressor ) {
            fileSizes[ compressor ] = compressors[ compressor ]( contents );
          });
        }
      });

      return sizes;
    },

    // git helper.
    git_status: function( done ) {
      verbose.write( "Running `git branch` command..." );
      exec("git branch --no-color --verbose --no-abbrev --contains HEAD", function( err, stdout ) {
        var status = {},
            matches = /^\* (.+?)\s+([0-9a-f]{8,})/im.exec( stdout );

        if ( err || !matches ) {
          verbose.error();
          done( err || "branch not found" );
        } else if ( matches[ 1 ].indexOf(" ") >= 0 ) {
          done( "not a branch tip: " + matches[ 2 ] );
        } else {
          status.branch = matches[ 1 ];
          status.head = matches[ 2 ];
          exec("git diff --quiet HEAD", function( err ) {
            status.changed = !!err;
            done( null, status );
          });
        }
      });
    }
  };

  // Load test harness, if there is one
  // A hack, but we can't drop it into tasks/ because loadTasks might evaluate the harness first
  if ( grunt.file.expand("./harness/harness*").length ) {
    helpers.git_status = require("../harness/harness");
  }

  // Compare size to saved sizes
  // Derived and adapted from Corey Frang's original `sizer`
  grunt.registerMultiTask( "compare_size", "Compare working size to saved sizes", function() {
    var done = this.async(),
      compressors = ( this.options() || {} ).compress,
      newsizes = helpers.sizes( this, compressors ),
      files = Object.keys( newsizes ),
      explicitFile = Object.keys( this.flags || {} ).join(":"),
      sizecache = grunt.config("compare_size.options.cache") || defaultCache,
      cache = helpers.get_cache( sizecache ),
      tips = cache[""].tips,
      labels = helpers.sorted_labels( cache );

    // Explicit comparison file flag
    if ( explicitFile && files.indexOf( explicitFile ) < 0 ) {
      log.error( "Unknown file: " + explicitFile );
      return false;
    }

    // Obtain the current branch and continue...
    helpers.git_status( function( err, status ) {
      var key,
        prefixes = compressors ? [ "" ].concat( Object.keys( compressors ) ) : [ "" ],
        availableWidth = 79,
        columns = prefixes.map(function( label ) {
          // Ensure width for the label and 6-character sizes, plus a padding space
          return Math.max( label.length + 1, 7 );
        }),

        // Right-align headers
        commonHeader = prefixes.map(function( label, i ) {
          return _.padStart( i === 0 && compressors ? "raw" : label, columns[ i ] - 1 );
        });

      if ( err ) {
        log.warn( err );
        status = {};
      }

      // Remaining space goes to the file path
      columns.push( Math.max( 1, availableWidth -
          columns.reduce(function( a, b ) { return a + b; }) ) );

      // Compressed display for explicit-file comparison
      if ( explicitFile ) {
        // Header
        log.writetableln( columns, commonHeader.concat("") );

        // Raw sizes
        log.writetableln( columns, prefixes.map(function( prefix, i ) {
          return _.padStart( newsizes[ explicitFile ][ prefix ], columns[ i ] - 1 );
        }).concat( explicitFile ) );

        // Comparisons
        labels.forEach(function( label ) {
          var old = cache[ label ] && cache[ label ][ explicitFile ];
          log.writetableln( columns, prefixes.map(function( prefix, i ) {
    
            return helpers.delta( old && newsizes[ explicitFile ][ prefix ] - old[ prefix ], columns[ i ] - 1 );
          }).concat( helpers.label(label, tips[label]) ) );
        });

      // Detailed display for all-files comparison
      } else {
        // Raw sizes
        log.writetableln( columns, commonHeader.concat("Sizes") );
        files.forEach(function( key ) {
          log.writetableln( columns,
            prefixes.map(function( prefix, i ) {
              return _.padStart( newsizes[ key ][ prefix ], columns[ i ] - 1 );
            }).concat( key + "" )
          );
        });

        // Comparisons
        labels.forEach(function( label, index ) {
          var key, diff, color,
              oldsizes = cache[ label ];

          // Skip metadata key and empty cache entries
          if ( label === "" || !cache[ label ] ) {
            return;
          }

          // Header
          log.writeln("");
          log.writetableln( columns,
            commonHeader.concat( "Compared to " + helpers.label( label, tips[label] ) )
          );

          // Data
          files.forEach(function( key ) {
            var old = oldsizes && oldsizes[ key ];
            log.writetableln( columns,
              prefixes.map(function( prefix, i ) {
                return helpers.delta( old && newsizes[ key ][ prefix ] - old[ prefix ], columns[ i ] - 1 );
              }).concat( key + "" )
            );
          });
        });
      }

      // Update "last run" sizes
      cache[ lastrun ] = newsizes;

      // Remember if we're at a branch tip and the branch name is an available key
      if ( status.branch && !status.changed && ( status.branch in tips || !cache[ status.branch ] ) ) {
        tips[ status.branch ] = status.head;
        cache[ status.branch ] = newsizes;
        log.writeln( "\nSaved as: " + status.branch );
      }

      // Write to file
      file.write( sizecache, JSON.stringify( cache ) );

      done();
    });

    // Fail task if errors were logged.
    if ( this.errorCount ) {
      return false;
    }
  });

  // List saved sizes
  grunt.registerTask( "compare_size:list", "List saved sizes", function() {
    var sizecache = grunt.config("compare_size.options.cache") || defaultCache,
        cache = helpers.get_cache( sizecache ),
        tips = cache[""].tips;

    helpers.sorted_labels( cache ).forEach(function( label ) {
      // Skip the special labels
      if ( label && label.charAt( 0 ) !== " " ) {
        log.write( label );
        if ( label in tips ) {
          log.write( " " + ( "@ " + tips[ label ] )[ "grey" ] );
        }
        log.writeln("");
      }
    });
  });

  // Add custom label
  grunt.registerTask( "compare_size:add", "Add to saved sizes", function() {
    var label,
        sizecache = grunt.config("compare_size.options.cache") || defaultCache,
        cache = helpers.get_cache( sizecache );

    if ( !cache[ lastrun ] ) {
      log.error("No size data found");
      return false;
    }

    // Store last run sizes under each label, clearing them as branch heads
    for ( label in this.flags ) {
      if ( label in cache[""].tips ) {
        delete cache[""].tips[ label ];
        log.write("(removed branch data) ");
      }
      cache[ label ] = cache[ lastrun ];
      log.writeln( "Last run saved as: " + label );
    }

    file.write( sizecache, JSON.stringify( cache ) );
  });

  // Remove custom label
  grunt.registerTask( "compare_size:remove", "Remove from saved sizes", function() {
    var label,
        sizecache = grunt.config("compare_size.options.cache") || defaultCache,
        cache = helpers.get_cache( sizecache );

    for ( label in this.flags ) {
      delete cache[""].tips[ label ];
      delete cache[ label ];
      log.writeln( "Removed: " + label );
    }

    file.write( sizecache, JSON.stringify( cache ) );
  });

  // Empty size cache
  grunt.registerTask( "compare_size:prune", "Clear all saved sizes except those specified", function() {
    var sizecache = grunt.config("compare_size.options.cache") || defaultCache,
        cache = helpers.get_cache( sizecache ),
        saved = Object.keys( cache ),
        keep = Object.keys( this.flags );

    // If preserving anything, include last run
    if ( keep.length ) {
      keep.push( lastrun );
    }

    saved.forEach(function( label ) {
      if ( !label || keep.indexOf( label ) !== -1 ) {
        return;
      }
      delete cache[""].tips[ label ];
      delete cache[ label ];
      if ( keep.length ) {
        log.writeln( "Removed: " + label );
      }
    });

    if ( Object.keys( cache ).length > 1 ) {
      file.write( sizecache, JSON.stringify( cache ) );
    } else if ( fs.existsSync( sizecache ) ) {
      fs.unlinkSync( sizecache );
    }
  });

  // Backwards compatibility aliases
  grunt.registerTask( "compare_size:empty", function() {
    grunt.task.run( ["compare_size:prune"].concat(
      Object.keys( this.flags )
    ).join(":") );
  });
  "list add remove empty".split(" ").forEach(function( task ) {
    grunt.registerTask( "compare_size_" + task, function() {
      grunt.task.run( [ "compare_size:" + task ].concat(
        Object.keys( this.flags )
      ).join(":") );
    });
  });
};
