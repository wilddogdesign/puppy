var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // REQUIRE

  // measure the time
  require('time-grunt')(grunt);
  // load the tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  var config = {
    // Minify the scripts and css for production
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
    Create new file in project directory called .ftppass where you store user credentials.
    `key` is refered to from authKey option
    Example:
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
        exclusions: ['dist/**/.DS_Store', 'dist/**/Thumbs.db', 'dist/.tmp']
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
      },
      styleguide: {
        options: {
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src/styleguide',
          src: ['*.{scss,sass}'],
          dest: 'dist/styleguide/css',
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
      styleguide: {
        options: {
          map: false
        },
        expand: true,
        cwd:  'dist/styleguide/css',
        src:  '*.css',
        dest: 'dist/styleguide/css'
      }
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
          dest: 'dist/assets/img'
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
      },
      styleguide: {
        files: [{
          expand: true,
          cwd: 'src/img/site',
          src: ['**/*'],
          dest: 'dist/styleguide/img'
        }]
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
      html: ['dist/**/*.html'],
      css:  ['dist/assets/css/**/*.css']
    },

    // Styleguide
    styledown: {
      build: {
        files: {
          'dist/styleguide/index.html': [
            'src/styleguide/config.md',
            'src/css/partials/settings/_settings.local.scss',
            'src/css/partials/base/_base.forms.scss',
            'src/css/partials/objects/*.scss',
            'src/css/partials/components/*.scss',
            'src/css/partials/trumps/*.scss'
          ]
        },
        options: {
          css: [
            '../assets/css/vendor.min.css',
            '../assets/css/main.min.css',
            'css/styleguide.css'
            ],
          js: [
            '../assets/js/libs/modernizr.min.js',
            '../assets/js/vendor.min.js',
            '../assets/js/main.min.js'
          ],
          title: 'Puppy Style Guide'
        }
      },
    },

    concurrent: {
      options: {
        limit: 8
      },
      prod: [
        'sass:prod',
        'liquid:prod',
        'copy:scripts',
        'imagemin:prod',
        'copy:fonts'
      ]
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
  grunt.registerTask('minify', [
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'usemin',
  ]);


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
    'concurrent:prod',
    'wiredep',
    'autoprefixer:prod',
    'minify',
    'clean:unminified',
  ]);


  // Styleguide compilation task
  grunt.registerTask('styleguide', [
    'styledown',
    'sass:styleguide',
    'autoprefixer:styleguide',
    'copy:styleguide'
  ]);

};