/**
 * Setup triggers
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function setupTriggers(options = {}) {
  const { triggerTarget = '.js-class-trigger' } = options;

  const triggers = document.querySelectorAll(triggerTarget);

  Array.from(triggers).forEach(trigger => {
    // TODO - Test the object deconstruction below in IE11 before removing
    // const target = trigger.dataset.target;
    // const classToTrigger = trigger.dataset.classToTrigger;
    // const setFocus = trigger.dataset.setFocus;
    // const focusDelay = parseInt(trigger.dataset.focusDelay, 10);
    // const removeOthers = trigger.dataset.removeOtherInstances;
    // const setActive = trigger.dataset.setActive;

    const {
      target = null,
      classToTrigger = '',
      setFocus = false,
      focusDelay = 0,
      removeOthers = false,
      setActive = false,
      media = false,
    } = trigger.dataset;

    const mediaQuery = media ? window.matchMedia(`(min-width: ${media})`) : false;

    function clickEventHandler(ev) {
      if (mediaQuery.matches || mediaQuery === false) {
        ev.preventDefault();

        const targetElement = document.querySelector(target);

        if (targetElement) {
          const targetClasses = targetElement.classList;

          if (targetClasses.contains(classToTrigger)) {
            targetClasses.remove(classToTrigger);

            if (setActive) {
              trigger.classList.remove(setActive);
            }

            if (setFocus) {
              const focusElement = document.querySelector(setFocus);

              focusElement.blur();
            }
          } else {
            if (removeOthers) {
              const allOtherInstances = document.querySelectorAll(`.${classToTrigger}`);

              Array.from(allOtherInstances).forEach(other => {
                other.classList.remove(classToTrigger);
              });
            }

            if (setActive) {
              const allOtherTriggers = document.querySelectorAll(
                `[data-set-active='${setActive}']`
              );

              Array.from(allOtherTriggers).forEach(otherTrigger => {
                otherTrigger.classList.remove(setActive);
              });

              trigger.classList.add(setActive);
            }

            targetClasses.add(classToTrigger);

            if (setFocus) {
              const focusElement = document.querySelector(setFocus);

              if (focusDelay) {
                setTimeout(() => focusElement.focus(), parseInt(focusDelay, 10));
              } else {
                focusElement.focus();
              }
            }
          }
        }
      }
    }

    trigger.addEventListener('click', clickEventHandler);
  });
}

export default { setup: setupTriggers };
