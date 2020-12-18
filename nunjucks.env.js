/**
 * Manipulate the nunjucks env here, eg. add custom filters.
 *
 * Before implementing anything wild, check/inform the back-end team.
 * They will be reading the templates which use these.
 */

const envCallback = (env) => {
  // ..
  // example usage, {{ message | shorten }} or  {{ message | shorten(20) }}
  env.addFilter('shorten', function (str, count) {
    return str.slice(0, count || 5);
  });

  // env MUST ALWAYS BE RETURNED
  return env;
};

module.exports = envCallback;
