// https://github.com/jonathantneal/closest - For IE11 support
// Can be be removed if you don't want to support IE11
import elementClosest from 'element-closest';

elementClosest(window);

const recaptchaKey = typeof window.recaptchaKey !== 'undefined' ? window.recaptchaKey : '';

/**
 * Get the forms for recaptcha.
 *
 * @export
 * @param {string} [target='.js-recaptcha']
 * @param {boolean} [lookForGRecaptcha=true]
 * @returns
 */
// export function getForms(target = '.js-recaptcha', lookForGRecaptcha = true) {
//   const forms = Array.from(document.querySelectorAll(target));

//   // Also look for forms with recaptcha div el
//   // https://developers.google.com/recaptcha/docs/invisible#programmatic_execute
//   if (lookForGRecaptcha) {
//     const recaptchas = document.querySelectorAll('div.g-recaptcha');

//     Array.from(recaptchas).forEach(recaptcha => {
//       const form = recaptcha.closest('form');

//       if (!form.classList.contains(target.substr(1, target.length))) {
//         forms.push(form);
//       }
//     });
//   }

//   return forms;
// }

/**
 *Submit the active recaptcha form.
 *
 * @export
 */
export function recaptchaSubmit() {
  if (window.activeRecaptchaForm) {
    window.activeRecaptchaForm.submit();
  }
}

/**
 * Setup Recaptcha on forms
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function setupRecaptcha({ target = '.js-recaptcha', validate = true } = {}) {
  window.activeRecaptchaForm = null;

  const forms = Array.from(document.querySelectorAll(target));

  Array.from(forms).forEach(form => {
    const recaptcha = document.createElement('div');
    form.appendChild(recaptcha);

    // The recaptcha render method returns an id that we can target further down.
    const widgetID = window.grecaptcha.render(recaptcha, {
      sitekey: recaptchaKey,
      size: 'invisible',
      callback: recaptchaSubmit,
    });

    form.addEventListener('submit', ev => {
      ev.preventDefault();

      // this could be modified to use a form validation library, but by default uses standard API
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity
      if ((validate && form.checkValidity()) || !validate) {
        // Using the index we can have multiple forms with there own recaptcha.
        window.grecaptcha.reset(widgetID);
        window.grecaptcha.execute(widgetID);

        window.activeRecaptchaForm = form;
      }
    });
  });
}

export default { recaptchaSubmit, setup: setupRecaptcha };
