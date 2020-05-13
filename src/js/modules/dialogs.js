// https://github.com/edenspiekermann/a11y-dialog
import A11yDialog from "a11y-dialog";
import { attachRecaptcha } from "./recaptcha";

/**
 * Setup dialog components
 *
 * Functions can be assigned to the onHideCallback and onShowCallback options.
 *
 * @export
 * @param {*} {
 *   target = '.js-dialog',
 *   bodyClass = 'is-visible--dialog',
 *   onShowCallback = null,
 *   onHideCallback = null,
 * }
 */
export function setupDialogs({
  target = ".js-dialog",
  bodyClass = "is-visible--dialog",
  onShowCallback = null,
  onHideCallback = null,
} = {}) {
  const dialogs = document.querySelectorAll(target);

  Array.from(dialogs).forEach(el => {
    const dialog = new A11yDialog(el);
    const bodyClasses = document.body.classList;

    dialog.on("show", () => {
      bodyClasses.add(bodyClass);

      if (typeof onShowCallback === "function") {
        onShowCallback(dialog);
      }

      // call attachRecpatcha function incase the dialog contains a form requiring recaptcha.
      attachRecaptcha();
    });

    dialog.on("hide", () => {
      bodyClasses.remove(bodyClass);

      if (typeof onHideCallback === "function") {
        onHideCallback(dialog);
      }
    });
  });
}

export default { setup: setupDialogs };
