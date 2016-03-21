import domready from 'domready';
import fc from 'fastclick';
// import $ from'jquery';
// var owlCarousel = require('../../node_modules/owl-carousel-2/owl.carousel.js');

function initialize() {
  console.log('DOM initialized');
}

const finalScripts = {
  init: initialize,
};

domready(() => {
  fc(document.body);
  finalScripts.init();
});
