import domready from 'domready';
import setupScrollTo from './modules/scroll-to';

function hi() {
  console.log('Hi there!');

  const arr = [1, 2, 3];

  arr.forEach(item => {
    console.log(item);
  });
}

function initialise() {
  hi();
  setupScrollTo();
}

const finalScripts = {
  init: initialise,
};

domready(() => {
  finalScripts.init();
});
