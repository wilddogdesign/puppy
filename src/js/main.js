// var $  = require('../bower_components/jquery/dist/jquery.js');
// var fc = require('fastclick');

function initialize() {
  console.log('DOM initialized');
}

//attach to the global scope
window.finalScripts = {
  init : initialize
};

document.addEventListener('DOMContentLoaded', function() {

  // fc.attach(document.body);
  finalScripts.init();

});