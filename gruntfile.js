module.exports = function(grunt) {

  // REQUIRE

  // measure the time
  require('time-grunt')(grunt);
  // require serve-static
  var serveStatic = require('serve-static');
  // load the tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  var config = {
    // Minify the scripts and css for production
    minifyScripts: grunt.option('no-minification') ? false : true,
    // Inline critical css
    inlineCss: grunt.option('no-critical-css') ? false : true
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
              connect().use('/bower_components', serveStatic('./bower_components')),
              connect().use('/src', serveStatic('./src')),
              connect().use('/partials', serveStatic('./src/css/partials')),
              serveStatic('dist')
            ];
          }
        }
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
          minify: config.minifyScripts,
          critical: config.inlineCss
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
      critical: {
        options: {
          outputStyle: 'compressed',
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: 'src/css',
          src: 'critical.scss',
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

    modernizr: {
      dev: {
        options: [
          "setClasses",
          "testAllProps"
        ],
        dest: 'dist/assets/js/libs/modernizr-custom.js',
        extra: {
          'shiv' :       false,
          'printshiv' :  false,
          'load' :       true,
          'mq' :         false,
          'cssclasses' : true
        },
        extensibility: {
          'addtest':      true,
          'prefixed':     false,
          'teststyles':   false,
          'testprops':    false,
          'testallprops': false,
          'hasevents':    false,
          'prefixes':     false,
          'domprefixes':  false
        },
        crawl: false,
        excludeTests: ['hidden'],
        tests: ( function() {
          var tests = grunt.file.readJSON('./node_modules/modernizr/lib/config-all.json')['feature-detects'];
          var actualTests = [];
          tests.forEach(function(str) {
            var temp     = str,
                newTests = [];
            if (str.indexOf('-') > -1) {
              temp = temp.replace('-','');
            }
            if (str.indexOf('/') > -1) {
              var subs = temp.split('/');
              newTests.push(subs[0] + subs[1]);
              newTests.push(subs[1] + subs[0]);
              newTests.push(subs[1]);
            } else {
              newTests.push(temp)
            }
            actualTests.push(newTests);
          });
          // return tests.map(function(str) {
          //   var temp = str;
          //   if (~~str.indexOf('-')) {
          //     temp = temp.replace('-','');
          //   }
          //   if (~~str.indexOf('/')) {
          //     var subs = temp.split('/');
          //     temp = subs[0] + subs[1] + ', '
          //            subs[1] + subs[0] + ', '
          //            subs[1]
          //   }
          //   return str.replace('-','');
          // });
          grunt.log.ok(actualTests);
          return actualTests;
        }() )
      },
      prod: {
        cache: true,
        options: [
          "setClasses"
        ],
        dest: 'dist/assets/js/libs/modernizr-custom.js',
        // devFile: 'dist/assets/js/libs/modernizr.min.js',
        // outputFile: 'dist/assets/js/libs/modernizr.js',
        extra: {
          'shiv' :       false,
          'printshiv' :  false,
          'load' :       true,
          'mq' :         false,
          'cssclasses' : true
        },
        extensibility: {
          'addtest':      true,
          'prefixed':     false,
          'teststyles':   false,
          'testprops':    false,
          'testallprops': false,
          'hasevents':    false,
          'prefixes':     false,
          'domprefixes':  false
        },
        files: {
          src: [
            'dist/assets/js/{,*/}*.js',
            'dist/assets/css/{,*/}*.css'
          ]
        },
        uglify: true,
        excludeTests: ['hidden'],
        tests: ['pointerevents']
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'ie 10']})
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
      critical: {
        expand: true,
        cwd:  'dist',
        src:  'assets/css/critical.css',
        dest: 'dist'
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

    browserify: {
      dist: {
        options: {
          transform: ['babelify']
        },
        files: [{
          expand: true,
          flatten: true,
          cwd:  'src/js',
          src:  '*.js',
          dest: 'dist/assets/js'
        }]
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'critical',
              replacement: 'bar'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['dist/*.html'],
            dest: 'dist/'
          }
        ]
      }
    },

    inline: {
      dist: {
        src: 'dist/**/*.html'
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

        // exclude: [
        //   'bower_components/modernizr/modernizr.js'
        // ],

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

    eslint: {
      target: ['src/js/main.js']
    },

    concat: {
      options: {
        separator: ';',
      }
    },

    clean: {
      dist: [ 'dist/' ],
      tmp:  [ '.tmp/ '],
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
        'dist/assets/js/main.min.js'
      ],
      intermediate: [
        'dist/assets/css/plaque.*',
        'dist/assets/css/critical.*',
        'dist/assets/css/styles.*',
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
      // scripts: {
      //   expand: true,
      //   cwd: 'src',
      //   src: 'js/main.js',
      //   dest: 'dist/assets/',
      // },
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
      },
      unminifiedStyles: {
        expand: true,
        cwd: '.tmp/concat/assets/css',
        src: '**/*',
        dest: 'dist/assets/css',
      },
      unminifiedScripts: {
        expand: true,
        cwd: '.tmp/concat/assets/js',
        src: '**/*',
        dest: 'dist/assets/js',
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
        dirs: ['dist'],
        blockReplacements: {
          js: function (block) {
              return '<script src="' + block.dest + '" async></script>';
          }
        }
      },
      html: ['dist/**/*.html'],
      css:  ['dist/assets/css/*.css'],
      js:   ['dist/assets/js/*.js']
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

    favicons: {
      options: {
        tileBlackWhite: false,
        html: 'src/liquid/includes/_favicons.liquid'
      },
      icons: {
        src: 'src/misc/favicon.png',
        dest: 'dist/'
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
          css: function() {
            return config.minifyScripts ? [
              '../assets/css/main.min.css',
              'css/styleguide.css'
            ] : [
              '../assets/css/main.css',
              'css/styleguide.css'
            ];
          }(),
          js: function() {
            return config.minifyScripts ? [
              '../assets/js/libs/modernizr.min.js',
              '../assets/js/main.min.js'
            ] : [
              '../assets/js/libs/modernizr.min.js',
              '../assets/js/main.js'
            ];
          }(),
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
        // 'copy:scripts',
        'browserify',
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
        files: ['src/js/main.js'],
        tasks: ['eslint', 'browserify']
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
        tasks: ['sass:dev', 'postcss:dev', 'sass:critical', 'postcss:critical']
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
    } else {
      grunt.task.run('useminPrepare');
      grunt.task.run('concat:generated');
      grunt.task.run('usemin');
      grunt.task.run('copy:unminifiedStyles');
      // grunt.task.run('copy:unminifiedScripts');
      // grunt.task.run('clean:unminified');
      grunt.log.ok('Minification is switched off. Skipping');
    }
    grunt.task.run('clean:unrevved');
    grunt.task.run('clean:intermediate');
  });

  // Custom task to inline CSS
  grunt.registerTask('inlineCss', function() {
    var mainScript, cssToLoad;

    if ( config.minifyScripts ) {
      mainScript   = grunt.filerev.summary['dist/assets/css/main.min.css'];
      cssToLoad =
        [{
          match:   "critical",
          replace: "loadCSS('" + mainScript.replace('dist', '') + "', document.getElementById('criticalCss') );"
        }];
    } else {
      cssToLoad =
        [{
          match:   "critical",
          replace: "loadCss('/assets/css/main.js', document.getElementById('criticalCss') );"
        }];
    }

    if (config.inlineCss) {
      // grunt.verbose.write( JSON.stringify(grunt.filerev.summary, null, 2) );
      grunt.config('replace.dist.options.patterns', cssToLoad);
      grunt.task.run('replace');
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
    'eslint',
    'clean:tmp',
    'clean:dist',
    'modernizr:dev',
    'sass:dev',
    'postcss:dev',
    'sass:critical',
    'postcss:critical',
    'browserify',
    'svgstore',
    'favicons',
    'liquid:dev',
    'eol',
    'wiredep',
    'copy:index',
    'copy:fonts',
    'copy:images'
  ]);

  grunt.registerTask('prod', [
    'eslint',
    'clean:tmp',
    'clean:dist',
    'svgstore',
    'favicons',
    'concurrent:prod',
    'eol',
    'wiredep',
    'styleguide',
    'postcss:prod',
    'sass:critical',
    'postcss:critical',
    'inline',
    'minify',
    'modernizr:prod',
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