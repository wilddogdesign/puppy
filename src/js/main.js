import domready from 'domready';
import setupScrollTo from './modules/scroll-to';
import { setupSliders } from './modules/setup-sliders';

import { setupUTMInputs } from './modules/utms';
import { setupTriggers } from './modules/triggers';
import { setupDialogs } from './modules/dialogs';
import { setupRecaptcha } from './modules/recaptcha';

// Lazysizes
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/respimg/ls.respimg';

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
  setupUTMInputs();
  setupScrollTo();
  setupTriggers();
  setupSliders();
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
