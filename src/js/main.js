import domready from 'domready';
import svg4everybody from 'svg4everybody';
// import $ from 'jquery';

function sit() {
  console.log('Woof!');
}

function initialize() {
  sit();
}

const finalScripts = {
  init: initialize,
};

domready(() => {
  svg4everybody();
  finalScripts.init();
});
