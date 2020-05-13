/**
 * Setup A single Trigger
 *
 * @export
 * @param {HTMLElement} trigger
 * @param {*} options
 */
export function setupTrigger(trigger, options) {
  const {
    target,
    classToTrigger,
    setFocus,
    focusDelay,
    removeOthers,
    setActive,
    media,
    maxMedia,
  } = { ...options, ...trigger.dataset };

  let matchMedia = "";

  if (media) {
    matchMedia += `(min-width: ${media})`;
  }

  if (maxMedia) {
    if (matchMedia.length) {
      matchMedia += " and ";
    }

    matchMedia += `(max-width: ${maxMedia})`;
  }

  const mediaQuery = matchMedia.length ? window.matchMedia(matchMedia) : false;

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

            Array.from(allOtherInstances).forEach((other) => {
              other.classList.remove(classToTrigger);
            });
          }

          if (setActive) {
            const allOtherTriggers = document.querySelectorAll(`[data-set-active='${setActive}']`);

            Array.from(allOtherTriggers).forEach((otherTrigger) => {
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

  trigger.addEventListener("click", clickEventHandler);
}

/**
 * Setup Triggers
 *
 * @export
 * @param {*} [{
 *   triggerTarget = '.js-class-trigger',
 *   target = '',
 *   classToTrigger = '',
 *   setFocus = false,
 *   focusDelay = 0,
 *   removeOthers = false,
 *   setActive = false,
 *   media = false,
 *   maxMedia = false,
 * }={}]
 */
export function setupTriggers({
  triggerTarget = ".js-class-trigger",
  target = ".js-class-trigger-target",
  classToTrigger = "is-visible",
  setFocus = false,
  focusDelay = 0,
  removeOthers = false,
  setActive = false,
  media = false,
  maxMedia = false,
} = {}) {
  const options = {
    target,
    classToTrigger,
    setFocus,
    focusDelay,
    removeOthers,
    setActive,
    media,
    maxMedia,
  };

  const triggers = document.querySelectorAll(triggerTarget);

  Array.from(triggers).forEach((trigger) => setupTrigger(trigger, options));
}

export default { setup: setupTriggers, setupTrigger };
