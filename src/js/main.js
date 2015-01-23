 /*
  <<< Puppy Boilerplate Scripts >>>
  Core Javascript

  January 2015
*/

/*global jQuery:false, Modernizr:false */
'use strict';

/* Initialisers
-------------------------------*/

(function($) {

  /* Global vars */

  /* MEDIA QUERIES */
  var
  bpXLarge = '(min-width: 1200px)',
  bpLarge  = '(min-width: 980px) and (max-width: 1199px)',
  bpMedium = '(min-width: 768px) and (max-width: 979px)',
  bpSmall  = '(max-width: 767px)',
  bpXSmall = '(max-width: 480px)';

  // set 'Large' as default
  var
  bpXLargeCheck = false,
  bpLargeCheck  = true,
  bpMediumCheck = false,
  bpSmallCheck  = false,
  bpXSmallCheck = false;

  /* animation speed */
  var animationSpeed = 400;

  /* FIND SLIDERS */
  var sliderEl = $('.slider');

  /* SET UP HEADER SEARCH FIELD */
  var headerSearch = $('header .search-wrap');

  /* FIND FORMS */
  var forms = $('form');

  /* Functions
  -------------------------------*/

  function initSelects() {

    var
    selectEls = $('select'),
    selectPickerOptions = {
      'default':    true,
      'selected':   true
    };

    selectEls.each(function (){

      var
      $this = $(this),
      wrap = $('<div />', {
        'class': 'styled-select'
      });

      // wrap
      $this.wrap(wrap);

      // invoke bootstrap-select plugin
      $this.selectpicker(selectPickerOptions);

    });

  }

  // initalises enhanced mobile navigation
  function initNav(){

    var
    nav = $('#main-nav');

    $('body').on('click', '.nav-trigger .closed', function(e){

      e.preventDefault();

      $(this).removeClass('closed').addClass('open');
      nav.fadeIn( animationSpeed );
    });

    $('body').on('click', '.nav-trigger .open', function(e){

      e.preventDefault();

      $(this).removeClass('open').addClass('closed');
      nav.fadeOut( animationSpeed );
    });

  }

  function initResponsiveSlider() {

    sliderEl.each( function() {

      var
      $this = $(this),
      thisInitalised = false,
      thisSliderOps = {
        mode:          'fade',
        auto:          'true',
        captions:      false,
        pager:         false,
        slideMargin:   0,
        infiniteLoop:  true,
        controls:      true
      };

      $(window).resize( function() {
        waitForFinalEvent( function() {
            reInitSlider();
          },
          animationSpeed,
          'hero slider'
        );
      });

      function reInitSlider(){

        // This is necessary because without it, if going
        // from mobile to a larger viewport the slider stops working

        if ( thisInitalised ) {
          thisInitalised.reloadSlider(thisSliderOps);
        } else {
          thisInitalised = $this.responsiveSlider(thisSliderOps);
        }

        showControls();
      }

      function showControls(){
        $('.slider-controls').show();
      }

      thisInitalised = $this.responsiveSlider(thisSliderOps);
      showControls();

    });

  }

  // initalises forms, standardises cross-device behaviours

  function initForms() {

  }

  function initHeaderSearch() {

  }

  /* Utility
  -------------------------------*/
  // fired on window orientation or size change
  function sizeOrientationChange() {
    checkMQs();

    // if google map on page, re-center it on resize
    if( window.initMap !== undefined ){ window.initMap(); }
  }

  // check media query support,
  // if supported, set variables
  function checkMQs() {
    // returns 'true' if MQs are supported
    if(Modernizr.mq('only all')){
      bpXLargeCheck  = Modernizr.mq(bpXLarge);
      bpLargeCheck   = Modernizr.mq(bpLarge);
      bpMediumCheck  = Modernizr.mq(bpMedium);
      bpSmallCheck   = Modernizr.mq(bpSmall);
      bpXSmallCheck  = Modernizr.mq(bpXSmall);
    }
  }

  //Check device features
  function checkFeatures(){

    //touch devices

    //Firefox returns 'true' for touch events even though it doesn't support them so have to check against both
    var isFirefox = window.mozInnerScreenX !== null,
        modernizrTouch = Modernizr.touch;

    var touchEnabled = (modernizrTouch && !isFirefox);

    // trigger MQ detect
    checkMQs();

    if(touchEnabled){
      //ensures that touch devices are still able to scroll up/down smoothly
      $('html, body').removeClass('no-touch').addClass('touch-mod');
    }

  }

  // waits for final event to avoid multi-firing (ie: using window.resize)
  // originally from: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed
  var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = 'Don\'t call this twice without a uniqueId';
      }
      if (timers[uniqueId]) {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();


  /* PRELIMINARY SET-UPS */
  checkMQs();
  checkFeatures();
  initNav();
  initSelects();

  if ( sliderEl.length )     { initResponsiveSlider(); }
  if ( headerSearch.length ) { initHeaderSearch(); }
  if ( forms.length ) {
      initForms();
      initSelects();
  }

  $(window).resize( function() {
    waitForFinalEvent( function() {
        sizeOrientationChange();
      },
      200,
      'main resize'
    );
  });

  if (!window.addEventListener) {
    window.attachEvent('orientationchange', sizeOrientationChange);
  } else {
    window.addEventListener('orientationchange', sizeOrientationChange, false);
  }

})(jQuery);