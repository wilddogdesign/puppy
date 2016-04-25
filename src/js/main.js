import domready from 'domready';
import fc from 'fastclick';
import svg4everybody from 'svg4everybody';
// import $ from 'jquery';
// import 'slick-carousel';

// function setupCarousels() {
//   $('.js-carousel').slick();
// }

function initialize() {
  console.log('Hello woof');
  // setupCarousels();
}

const finalScripts = {
  init: initialize,
};

domready(() => {
  fc(document.body);
  svg4everybody();
  finalScripts.init();
});
