(function( $, window, document, undefined ) {

  'use strict';

  // var html = $('html');
  // var body = $('body');
  // var winWidth = $(window).width();
  // var winHeight = $(window).height();


  function initialize() {
    console.log('DOM initialized');
  }

  //attach to the global scope
  window.finalScripts = {
    init : initialize
  };

  //after the DOM is ready call our init function
  $(function(){

    //FastClick init
    FastClick.attach(document.body);

    finalScripts.init();

  });

})( jQuery, window, document );