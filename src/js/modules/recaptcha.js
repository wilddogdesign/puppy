const recaptchaKey = typeof window.recaptchaKey !== 'undefined' ? window.recaptchaKey : '';

/**
 * Submit the active recaptcha form, if it exists.
 *
 * @export
 */
export function recaptchaSubmit() {
  if (window.activeRecaptchaForm) {
    window.activeRecaptchaForm.submit();
  }
}

/**
 * Attach Recaptcha to forms.
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function attachRecaptcha({ target = '.js-recaptcha', validate = true } = {}) {
  const forms = Array.from(document.querySelectorAll(target));

  // console.log('attach recaptcha');

  forms.forEach(form => {
    if (!window.recaptchaForms.includes(form.id)) {
      if (!form.id) {
        // eslint-disable-next-line no-param-reassign
        form.id = `form-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      }

      window.recaptchaForms.push(form.id);

      // console.log({ recaptchaForms: window.recaptchaForms });

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
          // Using the widgetID we can have multiple forms with there own recaptcha.
          window.grecaptcha.reset(widgetID);
          window.grecaptcha.execute(widgetID);

          window.activeRecaptchaForm = form;
        }
      });
    }
  });
}

/**
 * Initial setup of recpatcha
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function setupRecaptcha() {
  // Recaptcha needs to be initiated by the recaptcha script tag in <head> - DO NOT PUT IN initialise function
  // https://developers.google.com/recaptcha/docs/invisible#examples
  window.recaptchaReadyCallback = attachRecaptcha;
  window.recaptchaForms = [];
  window.activeRecaptchaForm = null;

  // We need this for forms loaded by AJAX
  document.addEventListener('attach-recaptcha', ev => {
    attachRecaptcha({ target: ev.detail });
  });
}

export default { recaptchaSubmit, attachRecaptcha, setupRecaptcha };
