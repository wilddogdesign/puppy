import domready from 'domready';
import setupScrollTo from './modules/scroll-to';

import { setupTriggers } from './modules/triggers';
import { setupDialogs } from './modules/dialogs';
import { setupRecaptcha } from './modules/recaptcha';

// Recaptcha needs to be initiated by the recaptcha script tag in <head> - DO NOT PUT IN initialise function
// https://developers.google.com/recaptcha/docs/invisible#examples
window.recaptchaReadyCallback = setupRecaptcha;

// We need this for forms loaded by AJAX
document.addEventListener('setup-recaptcha', ev => {
  setupRecaptcha({
    target: ev.detail,
    lookForGRecaptcha: false,
  });
});

function isJsAvailable() {
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
}

function onShowDialog(dialog) {
  console.log('dialog shown', dialog);
}

function onHideDialog(dialog) {
  console.log('dialog hidden', dialog);
}

function initialise() {
  isJsAvailable();
  setupScrollTo();
  setupTriggers();
  setupDialogs({
    onShowCallback: onShowDialog,
    onHideCallback: onHideDialog,
  });
}

const finalScripts = {
  init: initialise,
};

domready(() => {
  finalScripts.init();
});
