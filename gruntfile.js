'use strict';

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var config = {
    app:  'src',
    dist: 'pre-build',
    dev:  'build/dev',
    live: 'build/live',
    tmp:  '.tmp'
  };

  grunt.initConfig({

    config: config,

    watch: {
      options: {
        livereload: true,
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'copy:html']
      },
      css: {
        files: '<%= config.app %>/sass/{,*/}*.scss',
        tasks: ['sass:server', 'autoprefixer:server', 'copy:nonmincsslibs']
      },
      js: {
        files: '<%= config.app %>/js/{,*/}*.js',
        tasks: ['jshint', 'copy:nonminjs'],
        options: {
          livereload: true
        }
      },
      responsive_images: {
        files: ['<%= config.app %>/img/media/**/*.{png,jpg,gif}'],
        tasks: ['newer:responsive_images'],
      },
      images: {
        files: ['<%= config.app %>/img/site/**/*.{png,jpg,gif,svg}'],
        tasks: ['newer:imagemin'],
      },
      fonts: {
        files: ['<%= config.app %>/fonts/**/*.{ttf,eot,svg,woff,woff2}'],
        tasks: ['newer:copy:fonts'],
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      liquid: {
        files: ['<%= config.app %>/liquid/{,*/}*.liquid'],
        tasks: ['liquid:server', 'wiredep', 'responsive_images_extender', 'copy:html']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/css/{,*/}*.css',
          '<%= config.dist %>/assets/js/{,*/}*.js',
          '<%= config.dist %>/assets/img/**/*'
        ]
      }
    },
    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        loadPath: 'bower_components',
        require:  'susy'
      },
      dev: {
        options: {
          outputStyle: 'nested'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dev %>/assets/css',
          ext: '.css'
        }]
      },
      live: {
        options: {
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass',
          src: ['*.{scss,sass}'],
          dest: '<%= config.live %>/assets/css',
          ext: '.css'
        }]
      },
      server: {
        options: {
          outputStyle: 'compressed',
          sourceMap:    true
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dist %>/assets/css',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'ie 9']
      },
      dev: {
        files: [{
          expand: true,
          flatten: true,
          src:  '<%= config.dev %>/assets/css/*.css',
          dest: '<%= config.dev %>/assets/css/*.css',
        }],
      },
      live: {
        files: [{
          expand: true,
          flatten: true,
          src:  '<%= config.live %>/assets/css/*.css',
          dest: '<%= config.live %>/assets/css/*.css',
        }],
      },
      server: {
        options: {
          map: true
        },
        expand: true,
        cwd:  '<%= config.dist %>',
        src:  'assets/**/*.css',
        dest: '<%= config.dist %>'
      }
    },
    liquid: {
      options: {
        includes: '<%= config.app %>/liquid'
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/liquid',
          src: ['**/*.liquid', '!includes/*.liquid'],
          dest: '<%= config.tmp %>/html',
          ext: '.html'
        }],
        options: {
          MINIFIED: 'FALSE',
          BUILD: 'DEV',
          FILE_EXT: '.html'
        }
      },
      live: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/liquid',
          src: ['**/*.liquid', '!includes/*.liquid'],
          dest: '<%= config.tmp %>/html',
          ext: '.php'
        }],
        options: {
          MINIFIED: 'TRUE',
          BUILD: 'LIVE',
          FILE_EXT: '.php'
        }
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/liquid',
          src: ['**/*.liquid', '!includes/*.liquid'],
          dest: '<%= config.tmp %>/html',
          ext: '.html'
        }],
        options: {
          MINIFIED: 'FALSE',
          BUILD: 'DEV',
          FILE_EXT: '.html'
        }
      }
    },
    responsive_images: {
      all: {
        options: {
          sizes: [{
            name:  'small',
            width: 480
          },
          {
            name: 'medium',
            width: 960
          },
          {
            name: 'large',
            width: 1200,
          }]
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img/media',
          src: ['**/*.{jpg,jpeg,gif,png}'],
          custom_dest: '<%= config.dist %>/assets/img/media/'
        }]
      }
    },
    responsive_images_extender: {
      complete: {
        options: {
          srcset: [{
            suffix: '-small',
            value: '480w'
          },{
            suffix: '-medium',
            value: '960w'
          },{
            suffix: '-large',
            value: '1200w'
          }],
          sizes: [{
            selector: 'figure img',
            sizeList: [{
              cond: 'max-width: 30em',
              size: '100vw'
            },{
              cond: 'max-width: 50em',
              size: '50vw'
            },{
              cond: 'default',
              size: 'calc(33vw - 100px)'
            }]
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.{html,php}'],
          cwd: '<%= config.tmp %>/html/',
          dest: '<%= config.dist %>/'
        }]
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img/site/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= config.dist %>/assets/img/site'
        }]
      }
    },
    // concat: {
    //   main: {
    //     src: [
    //       '.tmp/_bower.js',
    //       'scripts/*.js'  // You site's scripts
    //     ],
    //     dest: 'build/scripts.js'
    //   }
    // },
    // uglify: {
    //   main: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= config.app %>/js',
    //       src: '*.js',
    //       dest: '<%= config.live %>/assets/js',
    //       ext: '.min.js',
    //       extDot: 'last'
    //     }]
    //   },
    //   libs: {
    //     files: {
    //       '<%= config.live %>/assets/js/libs.min.js': ['<%= config.app %>/js/libs/*.js']
    //     },
    //     mangle: false
    //   }
    // },
    // cssmin: {
    //   main: {
    //     expand: true,
    //     cwd: '<%= config.dist %>/assets/css',
    //     src: ['*.css', '!*.min.css'],
    //     dest: '<%= config.dist %>/assets/css',
    //     ext: '.min.css'
    //   },
    //   libs: {
    //     files: {
    //       '<%= config.dist %>/assets/css/libs/libs.min.css': ['<%= config.app %>/css/libs/*.css']
    //     }
    //   }
    // },
    connect: {
      options: {
        port: 8888,
        hostname: '0.0.0.0',
        open: true,
        livereload: 35729
      },
      server: {
        options: {
          base: '<%= config.dist %>',
          livereload: true
        }
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder( connect, config.dist ),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/<%= config.app %>/sass', connect.static('./<%= config.app %>/sass')),
              mountFolder( connect, config.app )
            ];
          }
        }
      },
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/js/{,*/}*.js',
        '!<%= config.app %>/js/vendor/*',
        '!<%= config.app %>/js/plugins.js',
        'test/spec/{,*/}*.js'
      ]
    },
    open: {
      server: {
        path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
      }
    },
    useminPrepare: {
      html: ['<%= config.tmp %>/html/**/*.{html,php}'],
      options: {
        dest: '<%= config.dist %>'
      }
    },
    usemin: {
      options: {
        dirs: ['<%= config.live %>']
      },
      html: ['<%= config.live %>/{,*/}*.html'],
      css: ['<%= config.live %>/css/{,*/}*.css']
    },
    clean: {
      tmp: [
        '<%= config.tmp %>/*'
      ],
      dev: [
        '<%= config.dev %>/**/*.css',
        '<%= config.dev %>/**/*.js',
        '<%= config.dev %>/*.html',
        '<%= config.dev %>/*'
      ],
      live: [
        '<%= config.live %>/**/*.css',
        '<%= config.live %>/**/*.js',
        '<%= config.live %>/*.html',
        '<%= config.live %>/*'
      ],
      server: [
        '<%= config.dist %>/**/*.css',
        '<%= config.dist %>/**/*.js',
        '<%= config.dist %>/*.html',
        '<%= config.dist %>/*'
      ],
      images: [
        '<%= config.dist %>/assets/img/*'
      ]
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['**/*'],
          dest: '<%= config.dev %>'
        }]
      },
      live: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['**/*'],
          dest: '<%= config.live %>'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass/fonts',
          src: ['**/*'],
          dest: '<%= config.dist %>/assets/fonts'
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: '<%= config.tmp %>/html',
          src: ['**/*'],
          dest: '<%= config.dist %>'
        }]
      },
      index: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/index',
          src: ['**/*'],
          dest: '<%= config.dist %>'
        }]
      },
      nonminjs: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/js',
          src: ['**/*'],
          dest: '<%= config.dist %>/assets/js'
        }]
      },
      nonmincsslibs: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/css/libs',
          src: ['**/*'],
          dest: '<%= config.dist %>/assets/css/libs'
        }]
      }
    },
    // Run some tasks in parallel to speed up build process
    concurrent: {
      options: {
        limit: 11
      },
      server: [
        'sass:server',
        'liquid:server',
        'newer:copy:index',
        'copy:fonts',
        'copy:nonmincsslibs',
        'copy:nonminjs',
        'newer:responsive_images',
        'newer:imagemin'
      ],
      test: [
        'copy:styles'
      ],
      live: [
        'sass:live',
        'copy:styles',
        'newer:responsive_images',
        'newer:imagemin'
      ]
    },

    wiredep: {

      main: {

        exclude: [ 'bower_components/modernizr/modernizr.js' ],

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          '<%= config.tmp %>/**/*.html',
          '<%= config.app %>/sass/main.scss'
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:

          // https://github.com/taptapship/wiredep#configuration
        }
      }
    }
  });

  // Custom tasks

  grunt.registerTask('minify', [
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'usemin',
  ]);

  // Dev builds - for local or staging
  grunt.registerTask('dev', [
    'clean:tmp',
    'clean:dev',
    'wiredep',
    'sass:dev',
    'autoprefixer:dev',
    'liquid:dev',
    'newer:responsive_images',
    'responsive_images_extender',
    'newer:imagemin',
    'newer:copy:index',
    'copy:fonts',
    'copy:nonmincsslibs',
    'copy:nonminjs',
    'copy:dev'
  ]);

  // Live builds - for web or app
  grunt.registerTask('live', [
    'clean:tmp',
    'clean:live',
    'wiredep',
    'sass:live',
    'autoprefixer:live',
    'liquid:live',
    'minify',
    // 'uglify:main',
    // 'uglify:libs',
    // 'liquid:live',
    'newer:responsive_images',
    'responsive_images_extender',
    'newer:imagemin',
    'newer:copy:index',
    'copy:fonts',
    'copy:live'
  ]);

  grunt.registerTask('server', [
    'clean:tmp',
    'clean:server',
    'concurrent:server',
    'wiredep',
    'responsive_images_extender',
    'copy:html',
    'autoprefixer:server',
    'connect:livereload',
    'watch'
  ]);

};