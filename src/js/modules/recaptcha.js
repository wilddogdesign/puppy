// https://github.com/jonathantneal/closest - For IE11 support
// Can be be removed if you don't want to support IE11
import elementClosest from 'element-closest';

elementClosest(window);

const recaptchaKey = typeof window.recaptchaKey !== 'undefined' ? window.recaptchaKey : '';

/**
 * Create a Recaptcha div element.
 *
 * @export
 * @returns
 */
export function createRecaptchaElement() {
  const recaptcha = document.createElement('div');

  recaptcha.classList.add('g-recaptcha');

  recaptcha.setAttribute('data-sitekey', recaptchaKey);
  recaptcha.setAttribute('data-size', 'invisible');
  recaptcha.setAttribute('data-callback', 'recaptchaSubmit');

  return recaptcha;
}

/**
 * Get the forms for recaptcha.
 *
 * @export
 * @param {string} [target='.js-recaptcha']
 * @param {boolean} [lookForGRecaptcha=true]
 * @returns
 */
export function getForms(target = '.js-recaptcha', lookForGRecaptcha = true) {
  const forms = Array.from(document.querySelectorAll(target));

  // Also look for forms with recaptcha div el
  // https://developers.google.com/recaptcha/docs/invisible#programmatic_execute
  if (lookForGRecaptcha) {
    const recaptchas = document.querySelectorAll('div.g-recaptcha');

    Array.from(recaptchas).forEach(recaptcha => {
      const form = recaptcha.closest('form');

      if (!form.classList.contains(target.substr(1, target.length))) {
        forms.push(form);
      }
    });
  }

  return forms;
}

/**
 * Setup Recaptcha on forms
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function setupRecaptcha({
  target = '.js-recaptcha',
  validate = true,
  lookForGRecaptcha = true,
} = {}) {
  window.activeRecaptchaForm = null;

  window.recaptchaSubmit = () => {
    if (window.activeRecaptchaForm) {
      window.activeRecaptchaForm.submit();
    }
  };

  const forms = getForms(target, lookForGRecaptcha);

  Array.from(forms).forEach((form, index) => {
    const recaptcha = form.querySelector('.g-recaptcha');

    if (recaptcha) {
      if (typeof recaptcha.dataset.callback === 'undefined') {
        recaptcha.setAttribute('data-callback', 'recaptchaSubmit');
      }
    } else {
      form.appendChild(createRecaptchaElement());
    }

    form.addEventListener('submit', ev => {
      ev.preventDefault();

      // this could be modified to use a form validation library, but by default uses standard API
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity
      if ((validate && form.checkValidity()) || !validate) {
        // Using the index we can have multiple forms with there own recaptcha.
        window.grecaptcha.reset(index);
        window.grecaptcha.execute(index);

        window.activeRecaptchaForm = form;
      }
    });
  });
}

export default { createRecaptchaElement, getForms, setup: setupRecaptcha };
