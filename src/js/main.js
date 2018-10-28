import domready from 'domready';

function hi() {
  console.log('Hi there!');
}

function initialise() {
  hi();
}

const finalScripts = {
  init: initialise,
};

domready(() => {
  finalScripts.init();
});
