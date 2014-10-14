module.exports = function(grunt) {
  grunt.initConfig({
    // Validate JavaScript
    jshint: {
      all: ['javascripts/pedit.js']
    },
    // Compress JavaScript
    uglify: {
      pedit: {
        files: {
          'javascripts/pedit.min.js': 'javascripts/pedit.js'
        }
      }
    },
    // Compile SCSS files
    sass: {
      style: {
        files: [{
          expand: true,
          src: 'stylesheets/style.scss',
          ext: '.css'
        }]
      }
    },
    // Watch for changes
    watch: {
      js: {
        files: ['javascripts/pedit.js'],
        tasks: ['jshint', 'uglify'],
        options: {
          livereload: true,
        }
      },
      sass: {
        files: ['stylesheets/style.scss'],
        tasks: ['sass'],
      },
      css: {
        files: ['stylesheets/style.css'],
        options: {
          livereload: true,
        }
      },
    },
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Task definition
  grunt.registerTask('default', ['watch']);
};