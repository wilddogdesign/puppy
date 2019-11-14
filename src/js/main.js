import domready from 'domready';
import setupScrollTo from './modules/scroll-to';

import { setupTriggers } from './modules/triggers';
import { setupDialogs } from './modules/dialogs';
import { setupRecaptcha } from './modules/recaptcha';

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
  setupRecaptcha();

  document.addEventListener('setup-recaptcha', ev => {
    setupRecaptcha({
      target: ev.detail,
      lookForGRecaptcha: false,
    });
  });
}

const finalScripts = {
  init: initialise,
};

domready(() => {
  finalScripts.init();
});
