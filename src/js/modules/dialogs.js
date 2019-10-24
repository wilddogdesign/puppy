import A11yDialog from 'a11y-dialog';

/**
 * Setup dialog components
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function setupDialogs(options = {}) {
  const {
    target = '.js-dialog',
    bodyClass = 'is-visible--dialog',
    onShowCallback = null,
    onHideCallback = null,
  } = options;

  const dialogs = document.querySelectorAll(target);

  Array.from(dialogs).forEach(el => {
    const dialog = new A11yDialog(el);
    const bodyClasses = document.body.classList;

    dialog.on('show', () => {
      bodyClasses.add(bodyClass);

      if (typeof onShowCallback === 'function') {
        onShowCallback(dialog);
      }
    });

    dialog.on('hide', () => {
      bodyClasses.remove(bodyClass);

      if (typeof onHideCallback === 'function') {
        onHideCallback(dialog);
      }
    });
  });
}

export default { setup: setupDialogs };
