"use strict";

module.exports = function(grunt) {

  var gzip = require("gzip-js");

  // Project configuration.
  grunt.initConfig({
    compare_size: {
      files: [
        "tasks/compare-size.js",
        "test/compare-size.js"
      ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        }
      }
    },
    nodeunit: {
      tests: [ "test/**/*.js" ]
    },
    jshint: {
      files: [ "Gruntfile.js", "tasks/**/*.js", "test/**/*.js" ],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    watch: {
      files: "<%= jshint.files %>",
      tasks: "default"
    }
  });

  // Load local tasks.
  grunt.loadTasks("tasks");

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task.
  grunt.registerTask( "default", [ "jshint", "nodeunit" ] );

  // Task aliases.
  grunt.registerTask( "test", [ "nodeunit" ] );
};
