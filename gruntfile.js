module.exports = function(grunt) {

  // REQUIRE
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // CONFIG
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'http-server': {
      dev: {
        root: "dist",
        port: 8888,
        host: "127.0.0.1",
        runInBackground: true
      }
    },

    liquid: {
      options: {
        includes: 'src/liquid',
        list: [
          { item: "Item" },
          { item: "Item" },
          { item: "Item" },
          { item: "Item" },
          { item: "Item" },
          { item: "Item" }
        ]
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/liquid',
            src: ['**/*.liquid', '!includes/*.liquid'],
            dest: 'dist',
            ext: '.html'
          }
        ],
        options: {
          debug: true
        }
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: 'src/liquid',
            src: ['**/*.liquid', '!includes/*.liquid'],
            dest: 'dist',
            ext: '.html'
          }
        ],
        options: {
          debug: false
        }
      },
    },

    sass: {
      dev: {
        options: {
          outputStyle: 'nested',
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'src/css',
          src: '*.scss',
          dest: 'dist/assets/css',
          ext: '.css'
        }]
      },
      prod: {
        options: {
          outputStyle: 'compressed',
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: 'src/css',
          src: '*.scss',
          dest: 'dist/assets/css',
          ext: '.css'
        }]
      }
    },

    uglify: {
      src: {
        files: [{
            expand: true,
            cwd: 'src/js',
            src: 'app.js',
            dest: 'dist/assets/js',
            ext: '.js'
        }]
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/js/app.js'
      ]
    },

    concat: {
      options: {
        separator: ';',
      }
    },

    clean: {
      all: [
          "dist/"
      ]  
    },

    copy: {
      fonts: {
        expand: true,
        cwd: 'src',
        src: 'font/**',
        dest: 'dist/assets/',
      },
      scripts: {
        expand: true,
        cwd: 'src',
        src: 'js/app.js',
        dest: 'dist/assets/',
      },
      images: {
        expand: true,
        cwd: 'src',
        src: 'img/**',
        dest: 'dist/assets/',
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['src/js/**'],
        tasks: ['copy:scripts', 'jshint'],
        options: {
          spawn: false,
        },
      },
      fonts: {
        files: ['src/font/**'],
        tasks: ['copy:fonts']
      },
      styles: {
        files: ['src/css/**'],
        tasks: ['sass:dev']
      },
      liquid: {
        files: ['src/liquid/**'],
        tasks: ['liquid:dev']
      },
      images: {
        files: ['src/img/**'],
        tasks: ['copy:images']
      }
    },

  });

  // MODULES
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-liquid');
  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-concurrent');
  //grunt.loadNpmTasks('grunt-autoprefixer');

  // TASKS
  grunt.registerTask('server', [
    'http-server',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'clean', 
    'sass:dev',
    'jshint',
    'concat',
    'liquid:dev',
    'copy'
  ]);

  grunt.registerTask('prod', [
    'clean', 
    'sass:prod',
    'jshint',
    'liquid:prod',
    'concat',
    'uglify',
    'copy:fonts',
    'copy:images'
  ]);

};