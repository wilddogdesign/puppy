import { getUrlParams } from './utils';

/**
 * Setup the form fields and populate with values from URL if parameters passed through
 */
export function setupUTMInputs() {
  const params = getUrlParams();

  if (params) {
    const inputs = {
      utm_source: 'utm_source',
      utm_medium: 'utm_medium',
      utm_campaign: 'utm_campaign',
      utm_term: 'utm_term',
      utm_content: 'utm_content',
      gclid: 'gclid',
      gclsrc: 'gclsrc',
      dclid: 'dclid',
      fbclid: 'fbclid',
    };

    const paramKeys = Object.keys(params);

    Object.keys(inputs).forEach((name) => {
      let val = null;
      if (paramKeys.includes(name)) {
        val = params[name];
      } else if (paramKeys.includes(inputs[name])) {
        val = params[inputs[name]];
      }
      if (val) {
        const matches = Array.from(
          document.querySelectorAll(`form input[data-utm="${name}"]`)
        );
        if (matches.length) {
          // eslint-disable-next-line
          matches.forEach((i) => (i.value = val));
        }
      }
    });
  }
}

export default { setupUTMInputs };
