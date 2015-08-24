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
    minifyScripts: true,
    inlineCss: true
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
        pages: grunt.file.readJSON('data/pages.json'),
        dateNow: '<%= grunt.template.date( Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT" ) %>',
        yearNow: '<%= grunt.template.date( Date.now(), "yyyy" ) %>',
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

    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['> 1%', 'last 2 versions', 'ie 9']})
        ]
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

    svgstore: {
      options: {
        prefix : 'icon-', // This will prefix each ID
        svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
          viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg',
          style: 'display: none'
        }
      },
      default: {
        files: {
          'src/liquid/includes/_icons.liquid': ['src/svg/*.svg'],
        }
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
      }() ),
      unrevved: [
        'dist/assets/css/main.min.css',
        'dist/assets/css/vendor.min.css',
        'dist/assets/js/main.min.js',
        'dist/assets/js/vendor.min.js'
      ]
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
      index: {
        dot: true,
        expand: true,
        cwd: 'src/index',
        src: '**/*',
        dest: 'dist',
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

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      prod: {
        expand: true,
        cwd: 'dist/assets',
        src: ['js/*.js','css/*.css'],
        dest: 'dist/assets'
      }
    },

    usemin: {
      options: {
        dirs: ['dist']
      },
      html: ['dist/**/*.html'],
      css:  ['dist/assets/css/**/*.css'],
      js:   ['dist/assets/js/**/*.js']
    },

    critical: {
      index: {
        options:  {
          base: './',
          css: [],
          ignore: ['@font-face'],
          pathPrefix: '/',
          minify: true,
          width: 1099,
          height: 300
        },
        src: 'dist/index.html',
        dest: 'dist/index.html'
      }
    },

    eol: {
      to_lf_replace: {
        options: {
          eol: 'lf',
          replace: true
        },
        files: {
          src: [
            'dist/*.html'
          ]
        }
      }
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
        'copy:index',
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
      index: {
        files: ['src/index/**'],
        tasks: ['newer:copy:index']
      },
      styles: {
        files: ['src/css/**'],
        tasks: ['sass:dev', 'postcss:dev']
      },
      liquid: {
        files: ['src/liquid/**'],
        tasks: ['liquid:dev', 'wiredep']
      },
      images: {
        files: ['src/img/**'],
        tasks: ['newer:copy:images']
      },
      svg: {
        files: ['src/svg/**'],
        tasks: ['svgstore']
      }
    },

  });


  // TASKS

  grunt.registerTask('minify', function() {
    if (config.minifyScripts) {
      grunt.task.run('useminPrepare');
      grunt.task.run('concat:generated');
      grunt.task.run('cssmin:generated');
      grunt.task.run('uglify:generated');
      grunt.task.run('filerev');
      grunt.task.run('usemin');
      grunt.task.run('cleanUnminified');
      grunt.task.run('clean:unrevved');
    } else {
      grunt.task.run('useminPrepare');
      grunt.task.run('concat:generated');
      grunt.task.run('cssmin:generated');
      grunt.task.run('uglify:generated');
      grunt.task.run('usemin');
      grunt.log.ok('Minification is switched off. Skipping');
    }
  });

  // Custom task to inline CSS
  // We need this to run after filerev to get revved files summary
  // If minification is switched off, unminified styles are inlined
  grunt.registerTask('inlineCss', function() {
    var cssToInline = config.minifyScripts ? [
      grunt.filerev.summary['dist/assets/css/main.min.css']
    ] : [
      'dist/assets/css/main.css'
    ];

    if (config.inlineCss) {
      // grunt.verbose.write( JSON.stringify(grunt.filerev.summary, null, 2) );
      grunt.config('critical.index.options.css', cssToInline);
      grunt.task.run('critical');
    } else {
      grunt.log.ok('CSS inline is switched off. Skipping');
    }
  });

  // Custom unminified files cleaning
  // We need to get the revved files' names
  // and run the clean:unminified task
  grunt.registerTask('cleanUnminified', function() {
    var unminifiedAndRevved = [
      'dist/assets/css/main.css',
      'dist/assets/js/main.js',
      grunt.filerev.summary['dist/assets/css/main.css'],
      grunt.filerev.summary['dist/assets/js/main.js']
    ];

    grunt.config('clean.unminified', unminifiedAndRevved);
    grunt.task.run('clean:unminified');
  });

  grunt.registerTask('server', [
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'jshint',
    'clean:dist',
    'sass:dev',
    'postcss:dev',
    'concat',
    'svgstore',
    'liquid:dev',
    'eol',
    'wiredep',
    'copy'
  ]);

  grunt.registerTask('prod', [
    'jshint',
    'clean:dist',
    'svgstore',
    'concurrent:prod',
    'eol',
    'wiredep',
    'styleguide',
    'postcss:prod',
    'minify',
    'inlineCss'
  ]);


  // Styleguide compilation task
  grunt.registerTask('styleguide', [
    'styledown',
    'sass:styleguide',
    'postcss:styleguide',
    'copy:styleguide'
  ]);

};