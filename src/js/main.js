var domready = require('domready');
var fc = require('fastclick');
// var $  = global.jQuery  = require('jquery');
// var owlCarousel = require('../../node_modules/owl-carousel-2/owl.carousel.js');

function initialize() {
  console.log('DOM initialized');
}

//attach to the global scope
window.finalScripts = {
  init : initialize
};

domready( () => {
  fc(document.body);
  finalScripts.init();
});