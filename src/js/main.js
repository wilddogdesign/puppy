import domready from 'domready';
import setupScrollTo from './modules/scroll-to';

import { setupTriggers } from './modules/triggers';
import { setupDialogs } from './modules/dialogs';
import { setupRecaptcha } from './modules/recaptcha';

function onShowDialog(dialog) {
  console.log('dialog shown', dialog);
}

function onHideDialog(dialog) {
  console.log('dialog hidden', dialog);
}

function initialise() {
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
