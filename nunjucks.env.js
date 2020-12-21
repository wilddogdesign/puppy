/**
 * Manipulate the nunjucks env here, eg. add custom filters.
 *
 * Before implementing anything wild, check/inform the back-end team.
 * They will be reading the templates which use these.
 */

// source: https://github.com/andymantell/node-wpautop
const autopNewlinePreservationHelper = (matches) => {
  return matches[0].replace('\n', '<WPPreserveNewline />');
};

const wpautop = (pee, br) => {
  if (typeof br === 'undefined') {
    br = true;
  }

  var preTags = {};
  if (pee.trim() === '') {
    return '';
  }

  pee = pee + '\n'; // just to make things a little easier, pad the end
  if (pee.indexOf('<pre') > -1) {
    var peeParts = pee.split('</pre>');
    var lastPee = peeParts.pop();
    pee = '';
    peeParts.forEach((peePart, index) => {
      var start = peePart.indexOf('<pre');

      // Malformed html?
      if (start === -1) {
        pee += peePart;
        return;
      }

      var name = '<pre wp-pre-tag-' + index + '></pre>';
      preTags[name] = peePart.substr(start) + '</pre>';
      pee += peePart.substr(0, start) + name;
    });

    pee += lastPee;
  }

  pee = pee.replace(/<br \/>\s*<br \/>/, '\n\n');

  // Space things out a little
  var allblocks =
    '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';
  pee = pee.replace(new RegExp('(<' + allblocks + '[^>]*>)', 'gmi'), '\n$1');
  pee = pee.replace(new RegExp('(</' + allblocks + '>)', 'gmi'), '$1\n\n');
  pee = pee.replace(/\r\n|\r/, '\n'); // cross-platform newlines

  if (pee.indexOf('<option') > -1) {
    // no P/BR around option
    pee = pee.replace(/\s*<option'/gim, '<option');
    pee = pee.replace(/<\/option>\s*/gim, '</option>');
  }

  if (pee.indexOf('</object>') > -1) {
    // no P/BR around param and embed
    pee = pee.replace(/(<object[^>]*>)\s*/gim, '$1');
    pee = pee.replace(/\s*<\/object>/gim, '</object>');
    pee = pee.replace(/\s*(<\/?(?:param|embed)[^>]*>)\s*/gim, '$1');
  }

  if (pee.indexOf('<source') > -1 || pee.indexOf('<track') > -1) {
    // no P/BR around source and track
    pee = pee.replace(/([<[](?:audio|video)[^>\]]*[>\]])\s*/gim, '$1');
    pee = pee.replace(/\s*([<[]\/(?:audio|video)[>\]])/gim, '$1');
    pee = pee.replace(/\s*(<(?:source|track)[^>]*>)\s*/gim, '$1');
  }

  pee = pee.replace(/\n\n+/gim, '\n\n'); // take care of duplicates

  // make paragraphs, including one at the end
  var pees = pee.split(/\n\s*\n/);
  pee = '';
  pees.forEach((tinkle) => {
    pee += '<p>' + tinkle.replace(/^\s+|\s+$/g, '') + '</p>\n';
  });

  pee = pee.replace(/<p>\s*<\/p>/gim, ''); // under certain strange conditions it could create a P of entirely whitespace
  pee = pee.replace(/<p>([^<]+)<\/(div|address|form)>/gim, '<p>$1</p></$2>');
  pee = pee.replace(
    new RegExp('<p>s*(</?' + allblocks + '[^>]*>)s*</p>', 'gmi'),
    '$1',
    pee
  ); // don't pee all over a tag
  pee = pee.replace(/<p>(<li.+?)<\/p>/gim, '$1'); // problem with nested lists
  pee = pee.replace(/<p><blockquote([^>]*)>/gim, '<blockquote$1><p>');
  pee = pee.replace(/<\/blockquote><\/p>/gim, '</p></blockquote>');
  pee = pee.replace(
    new RegExp('<p>s*(</?' + allblocks + '[^>]*>)', 'gmi'),
    '$1'
  );
  pee = pee.replace(
    new RegExp('(</?' + allblocks + '[^>]*>)s*</p>', 'gmi'),
    '$1'
  );

  if (br) {
    pee = pee.replace(
      /<(script|style)(?:.|\n)*?<\/\\1>/gim,
      autopNewlinePreservationHelper
    ); // /s modifier from php PCRE regexp replaced with (?:.|\n)
    pee = pee.replace(/(<br \/>)?\s*\n/gim, '<br />\n'); // optionally make line breaks
    pee = pee.replace('<WPPreserveNewline />', '\n');
  }

  pee = pee.replace(
    new RegExp('(</?' + allblocks + '[^>]*>)s*<br />', 'gmi'),
    '$1'
  );
  pee = pee.replace(
    /<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)/gim,
    '$1'
  );
  pee = pee.replace(/\n<\/p>$/gim, '</p>');

  if (Object.keys(preTags).length) {
    pee = pee.replace(
      new RegExp(Object.keys(preTags).join('|'), 'gi'),
      function (matched) {
        return preTags[matched];
      }
    );
  }

  return pee;
};

/**
 * Callback function which manipulates Nunjucks Env.
 *
 * @param   {Nunjucks Env}  env  Nunjucks Env
 *
 * @return  {Nunjucks Env}       Nunjucks Env
 */
const envCallback = (env) => {
  // ...
  // example usage, {{ message | shorten }} or  {{ message | shorten(20) }}
  env.addFilter('shorten', function (str, count) {
    return str.slice(0, count || 5);
  });

  // ...
  // example usage, {{ message | wpautop }} or {{ message | wpautop(true) }}
  // bool optional. If set, this will convert all remaining line-breaks after paragraphing. Default true.
  env.addFilter('wpautop', function (str, br) {
    const safe = env.getFilter('safe');
    const res = wpautop(str, br);
    return safe(res);
  });

  // env MUST ALWAYS BE RETURNED
  return env;
};

module.exports = envCallback;
