import domready from 'domready';
import setupScrollTo from './modules/scroll-to';

import { setupTriggers } from './modules/triggers';
import { setupDialogs } from './modules/dialogs';
import { setupRecaptcha } from './modules/recaptcha';

function isJsAvailable() {
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
}

// Example - Remove if not using
function onShowDialog(dialog) {
  // eslint-disable-next-line no-console
  console.log('dialog shown', dialog);
}

// Example - Remove if not using
function onHideDialog(dialog) {
  // eslint-disable-next-line no-console
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
}

const finalScripts = {
  init: initialise,
};

domready(() => {
  finalScripts.init();
});
