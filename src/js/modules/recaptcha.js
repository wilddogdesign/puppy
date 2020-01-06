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
 * Setup Recaptcha on forms.
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function setupRecaptcha({ target = '.js-recaptcha', validate = true } = {}) {
  window.activeRecaptchaForm = null;

  const forms = Array.from(document.querySelectorAll(target));

  forms.forEach(form => {
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
  });
}

export default { recaptchaSubmit, setup: setupRecaptcha };
