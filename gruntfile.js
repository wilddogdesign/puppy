var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // REQUIRE
  require('time-grunt')(grunt);
  // require('load-grunt-tasks')(grunt);
  require('jit-grunt')(grunt, {
    /* jshint camelcase:false */
    useminPrepare: 'grunt-usemin'
    /* jshint camelcase:true */
  });

  var config = {
    minifyScripts: true
  };

  // CONFIG
  grunt.initConfig({

    config: config,

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      options: {
        port: 8888,
        hostname: '127.0.0.1',
        open: true,
        livereload: 35729,
        useAvailablePort: true
      },
      server: {
        options: {
          base: 'dist',
          livereload: true
        }
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder( connect, 'dist' ),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/partials', connect.static('./src/css/partials')),
              mountFolder( connect, 'src' )
            ];
          }
        }
      },
    },

    /* 
    FTP deploy
    Create new file in project directory called .ftppass where you store user crediantials. Example:
    {
      "key": {
        "username": "username1",
        "password": "password1"
      }
    }
    */
    'ftp-deploy': {
      build: {
        auth: {
          host: 'server.com',
          port: 21,
          authKey: 'key'
        },
        src: 'dist/',
        dest: '/path/to/destination/folder',
        exclusions: ['src/**/.DS_Store', 'src/**/Thumbs.db', 'dist/tmp']
      }
    },

    liquid: {
      options: {
        includes: 'src/liquid',
        //example data
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
        ]
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
          minify: config.minifyScripts
        }
      },
    },

    // LibSass
    sass: {
      dev: {
        options: {
          // For some reason, nested breaks source map functionality
          outputStyle: 'compressed',
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
          outputStyle: 'nested',
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

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'ie 9']
      },
      dev: {
        options: {
          map: true
        },
        expand: true,
        cwd:  'dist',
        src:  'assets/css/main.css',
        dest: 'dist'
      },
      prod: {
        expand: true,
        cwd:  'dist',
        src:  'assets/css/main.css',
        dest: 'dist',
      },
    },

    // Automatic Bower script and styles inclusion
    wiredep: {

      main: {

        exclude: [
          'bower_components/modernizr/modernizr.js'
        ],

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          'dist/**/*.html'
          // 'src/css/main.scss'
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:

          // https://github.com/taptapship/wiredep#configuration
        }
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/js/main.js'
      ]
    },

    concat: {
      options: {
        separator: ';',
      }
    },

    clean: {
      dist: [ 'dist/' ],
      unminified: ( function () {
        if ( config.minifyScripts ) {
          return [
            'dist/assets/css/main.css',
            'dist/assets/js/main.js'
          ];
        } else {
          // Scripts are not minified, nothing to clean
          return [];
        }
      }() )
    },

    imagemin: {
      prod: {
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['**/*.{png,svg,jpg,gif}'],
          dest: 'dist/assets/img/'
        }]
      }
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
        src: 'js/main.js',
        dest: 'dist/assets/',
      },
      images: {
        expand: true,
        cwd: 'src',
        src: 'img/**',
        dest: 'dist/assets/',
      }
    },

    useminPrepare: {
      html: 'dist/index.html',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      options: {
        dirs: ['dist']
      },
      html: ['dist/{,*/}*.html'],
      css:  ['dist/assets/css/{,*/}*.css']
    },

    watch: {
      options: {
        livereload: true,
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      scripts: {
        files: ['src/js/**'],
        tasks: ['jshint', 'copy:scripts'],
        options: {
          spawn: false,
        },
      },
      fonts: {
        files: ['src/fonts/**'],
        tasks: ['copy:fonts']
      },
      styles: {
        files: ['src/css/**'],
        tasks: ['sass:dev', 'autoprefixer:dev']
      },
      liquid: {
        files: ['src/liquid/**'],
        tasks: ['liquid:dev', 'wiredep']
      },
      images: {
        files: ['src/img/**'],
        tasks: ['newer:copy:images']
      }
    },

  });


  // TASKS
  grunt.registerTask('server', [
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'jshint',
    'clean:dist',
    'sass:dev',
    'autoprefixer:dev',
    'concat',
    'liquid:dev',
    'wiredep',
    'copy'
  ]);

  grunt.registerTask('prod', [
    'jshint',
    'clean:dist',
    'sass:prod',
    'autoprefixer:prod',
    'liquid:prod',
    'wiredep',
    'copy:scripts',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'usemin',
    'clean:unminified',
    'copy:fonts',
    'imagemin:prod'
  ]);

};