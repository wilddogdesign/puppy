import domready from 'domready';

function hi() {
  console.log('Hi there!');

  const arr = [1, 2, 3];

  arr.forEach(item => {
    console.log(item);
  });
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
