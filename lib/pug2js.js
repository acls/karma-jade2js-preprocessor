var util = require('util');

var TEMPLATE = [
  '(function() {',
  '  window.%s = window.%s || {};',
  '  %s[\'%s\'] = \'%s\';',
  '})();'
].join('\n');

var escapeContent = function(content) {
  return content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n\' +\n    \'');
};

var createPug2jsPreprocessor = function(logger, basePath, config) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.pug2js');
  var lib = config.lib || 'pug';
  var pug = require(lib);
  var fileExtRegx = new RegExp('\\.' + lib + '$'); // eg: /\.jade$/
  var cacheName = config.cacheName || '__html__';
  var locals = config.locals;
  var templateExtension = config.templateExtension || 'html';
  var stripPrefix = new RegExp('^' + (config.stripPrefix || ''));
  var prependPrefix = config.prependPrefix || '';
  var pugOptions = config.pugOptions || {};
  var cacheIdFromPath = config && config.cacheIdFromPath || function(filepath) {
    return prependPrefix +
      filepath
        .replace(stripPrefix, '')
        .replace(fileExtRegx, '.' + templateExtension);
  };

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    try {
      pugOptions.filename = file.originalPath;
      var processed = pug.compile(content, pugOptions);
      content = processed(locals);
    } catch (e) {
      log.error('%s\n  at %s', e.message, file.originalPath);
    }

    file.path = file.path.replace(fileExtRegx, '.html.js');

    var name = cacheIdFromPath(file.originalPath.replace(basePath + '/', ''));
    done(util.format(TEMPLATE, cacheName, cacheName, cacheName, name, escapeContent(content)));
  };
};

createPug2jsPreprocessor.$inject = ['logger', 'config.basePath', 'config.pug2jsPreprocessor'];
module.exports = createPug2jsPreprocessor;
