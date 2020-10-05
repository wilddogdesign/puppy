const recaptchaKey =
  (typeof window.recaptchaKey !== 'undefined' ? window.recaptchaKey : '') ||
  (Array.from(document.getElementsByName('_recaptcha')).length
    ? document.getElementsByName('_recaptcha')[0].getAttribute('content')
    : false);

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
 * This function is called when the google recaptcha script is ready,
 * and can then be called manually when for example new forms have been added to the page via dialogs.
 *
 * @export
 * @param {*} [options={}] The setup options
 */
export function attachRecaptcha({
  target = '.js-recaptcha',
  validate = true,
  size = 'invisible', // options = 'normal', 'compact', 'invisible'
  theme = 'light', // options = 'light', 'dark'
} = {}) {
  const forms = Array.from(document.querySelectorAll(target));

  forms.forEach((form) => {
    if (!window.recaptchaForms.includes(form.id)) {
      if (!form.id) {
        // eslint-disable-next-line no-param-reassign
        form.id = `form-${Math.random().toString(36).substr(2, 9)}`;
      }

      window.recaptchaForms.push(form.id);

      const recaptcha = document.createElement('div');

      form.appendChild(recaptcha);

      // The recaptcha render method returns an id that we can target further down.
      const widgetID = window.grecaptcha.render(recaptcha, {
        sitekey: recaptchaKey,
        size,
        callback: recaptchaSubmit,
        theme,
      });

      form.addEventListener('submit', (ev) => {
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
export function setupRecaptcha(options) {
  if (recaptchaKey) {
    window.recaptchaReadyCallback = () => attachRecaptcha(options);

    window.recaptchaForms = [];
    window.activeRecaptchaForm = null;

    const existingScript = document.getElementById('google-recaptcha');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src =
        'https://www.google.com/recaptcha/api.js?onload=recaptchaReadyCallback';
      script.id = 'google-recaptcha';
      document.body.appendChild(script);

      setTimeout(() => {
        window.recaptchaLoaded = true;
      }, 0);
    }
  }
}

export default { recaptchaSubmit, attachRecaptcha, setupRecaptcha };
