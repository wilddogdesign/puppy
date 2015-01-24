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
    dev:  'builds/dev',
    live: 'builds/live',
    tmp:  '.tmp',
    extensions: {
      server: '.html',
      dev:    '.html',
      live:   '.html'
    }
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
        tasks: ['newer:responsive_images:server'],
      },
      images: {
        files: ['<%= config.app %>/img/site/**/*.{png,jpg,gif,svg}'],
        tasks: ['newer:imagemin:server'],
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
        tasks: ['liquid:server', 'wiredep', /*'responsive_images_extender',*/ 'copy:html']
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
        loadPath: [
          'bower_components',
          // 'bower_components/susy/sass',
          ]
        // require:  'susy'
      },
      dev: {
        options: {
          style: 'nested'
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
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass',
          src: ['*.{scss,sass}'],
          dest: '<%= config.tmp %>/assets/css',
          ext: '.css'
        }]
      },
      server: {
        options: {
          style:     'compressed',
          sourcemap: 'auto'
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
        expand: true,
        cwd:  '<%= config.tmp %>',
        src:  'assets/**/*.css',
        dest: '<%= config.tmp %>',
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
          ext: config.extensions.dev
        }],
        options: {
          MINIFIED: 'FALSE',
          BUILD: 'DEV',
          FILE_EXT: config.extensions.dev
        }
      },
      live: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/liquid',
          src: ['**/*.liquid', '!includes/*.liquid'],
          dest: '<%= config.tmp %>/html',
          ext: config.extensions.live
        }],
        options: {
          MINIFIED: 'TRUE',
          BUILD: 'LIVE',
          FILE_EXT: config.extensions.live
        }
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/liquid',
          src: ['**/*.liquid', '!includes/*.liquid'],
          dest: '<%= config.tmp %>/html',
          ext: config.extensions.server
        }],
        options: {
          MINIFIED: 'FALSE',
          BUILD: 'DEV',
          FILE_EXT: config.extensions.server
        }
      }
    },
    responsive_images: {
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
        },
        {
          rename: false,
          width: 640
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img/media/',
          src: ['**/*.{jpg,jpeg,gif,png}'],
          dest: '<%= config.dist %>/assets/img/media/'
        }]
      },
      live: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img/media/',
          src: ['**/*.{jpg,jpeg,gif,png}'],
          dest: '<%= config.live %>/assets/img/media/'
        }]
      },
    },
    responsive_images_extender: {
      complete: {
        options: {
          srcset: [{
            suffix: '-small',
            value: '480w'
          },
          {
            suffix: '-medium',
            value: '960w'
          },
          {
            suffix: '-large',
            value: '1200w'
          }],
          sizes: [{
            selector: 'figure img',
            sizeList: [{
              cond: 'max-width: 480px',
              size: 'calc(100vw - 30px)'
            },
            {
              cond: 'max-width: 768px',
              size: '50vw'
            },
            {
              cond: 'default',
              size: 'calc(66vw)'
            }]
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.{html,php}'],
          cwd: '<%= config.tmp %>/html',
          dest: '<%= config.tmp %>/html'
        }]
      }
    },
    imagemin: {
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img/site/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= config.dist %>/assets/img/site'
        }]
      },
      live: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img/site/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= config.live %>/assets/img/site'
        }]
      },
    },
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
              connect().use('/src/sass', connect.static('./src/sass')),
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
      html: '<%= config.tmp %>/html/index<%= config.extensions.live %>',
      options: {
        root: '<%= config.tmp %>',
        dest: '<%= config.live %>'
      }
    },
    usemin: {
      options: {
        dirs: ['<%= config.live %>']
      },
      html: ['<%= config.tmp %>/html/{,*/}*<%= config.extensions.live %>'],
      css: ['<%= config.live %>/assets/css/{,*/}*.css']
    },
    clean: {
      tmp: [
        '<%= config.tmp %>/*'
      ],
      dev:    [ '<%= config.dev %>/*' ],
      live:   [ '<%= config.live %>/*' ],
      server: [
        '<%= config.dist %>/assets/css/**/*',
        '<%= config.dist %>/assets/js/**/*',
        '<%= config.dist %>/assets/fonts/**/*',
        '<%= config.dist %>/*<%= config.extensions.server %>',
      ],
      images: [ '<%= config.dist %>/assets/img/*' ]
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
          cwd: '<%= config.tmp %>/html',
          src: ['**/*'],
          dest: '<%= config.live %>'
        }]
      },
      js: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/js',
          src: ['**/*'],
          dest: '<%= config.tmp %>/assets/js'
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
      fontsLive: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass/fonts',
          src: ['**/*'],
          dest: '<%= config.live %>/assets/fonts'
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
      indexLive: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/index',
          src: ['**/*'],
          dest: '<%= config.live %>'
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
        'newer:responsive_images:server',
        'newer:imagemin:server'
      ],
      test: [
        'copy:styles'
      ],
      live: [
        'sass:live',
        'liquid:live',
        'newer:copy:indexLive',
        'copy:fontsLive',
        'copy:js',
        'newer:responsive_images:live',
        'newer:imagemin:live'
      ]
    },

    wiredep: {

      main: {

        exclude: [ 'bower_components/modernizr/modernizr.js' ],

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          '<%= config.tmp %>/html/**/*.{html,php}',
          '<%= config.app %>/sass/main.scss'
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:

          // https://github.com/taptapship/wiredep#configuration
        }
      }
    },

    pagespeed: {
      options: {
        nokey: true,
        url: 'https://developers.google.com'
      },
      prod: {
        options: {
          url: 'https://developers.google.com/speed/docs/insights/v1/getting_started',
          locale: 'en_GB',
          strategy: 'desktop',
          threshold: 80
        }
      },
      paths: {
        options: {
          paths: ['<%= config.live %>'],
          locale: 'en_GB',
          strategy: 'desktop',
          threshold: 80
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
    // 'responsive_images_extender',
    'newer:imagemin',
    'newer:copy:index',
    'copy:fonts',
    'copy:nonmincsslibs',
    'copy:nonminjs',
    // 'copy:dev'
  ]);

  // Live builds - for web or app
  grunt.registerTask('live', [
    'clean:tmp',
    'clean:live',
    'concurrent:live',
    'wiredep',
    'autoprefixer:live',
    'minify',
    // 'responsive_images_extender',
    'copy:live',
    // 'pagespeed'
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