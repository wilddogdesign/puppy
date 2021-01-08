/**
 * Check if an element is in the viewport
 *
 * @param {HTMLElement} el
 * @param {Boolean} partiallyVisible
 * @returns {Boolean}
 */
export function elementIsVisible(el, partiallyVisible = false) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
}

/**
 * Get the current url parameters and return all found or the first match if a param is set
 * @param {string} param - an optional parameter to search for
 * @return string || array
 */
export const getUrlParams = (param = null) => {
  const query = decodeURIComponent(window.location.search.substring(1));

  if (query.length) {
    const urlParams = query.split('&');
    const params = {};

    for (let i = 0; i < urlParams.length; i += 1) {
      const pair = urlParams[i].split('=', 2);
      let val = pair[1];
      // check if value is a boolean and convert if it is
      if (['true', 'false'].indexOf(val) !== -1) val = JSON.parse(val);

      if (pair[0].includes('[]')) {
        const key = pair[0].replace('[]', '');
        if (params[key]) {
          params[key].push(val);
        } else {
          params[key] = [val];
        }
      } else {
        params[pair[0]] = val;
      }
    }

    if (param) return param in params ? params[param] : false;

    return params;
  }

  return null;
};

export default { elementIsVisible, getUrlParams };
