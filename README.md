# karma-pug2js-preprocessor

> Preprocessor for converting pug template files to javascript.

Forked from [karma-ng-jade2js-preprocessor](https://github.com/chmanie/karma-ng-jade2js-preprocessor)

<!-- [![Build Status](https://travis-ci.org/chmanie/karma-jade2js-preprocessor.svg)](https://travis-ci.org/chmanie/karma-jade2js-preprocessor) -->

<!-- ## Installation

```bash
npm install karma-pug2js-preprocessor --save-dev
``` -->

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.jade': ['pug2js']
    },

    files: [
      '*.js',
      '*.jade',
      // if you wanna load template files in nested directories, you must use this
      '**/*.jade'
    ],

    pug2JsPreprocessor: {
      // Can be pug or jade (defaults to pug_. Used for file extensions and require.
      lib: 'jade',

      // strip this from the file path
      stripPrefix: 'public/',

      // prepend this to the
      prependPrefix: 'served/',

      // By default, Jade/Pug files are added to template cache with '.html' extension.
      // Set this option to change it.
      templateExtension: 'html',

      // or define a custom transform function
      cacheIdFromPath: function(filepath) {
        return filepath.replace(/\.jade$/, '.html');
      },

      // Support for pug locals to render at compile time
      locals: {
        foo: 'bar'
      },

      // set the global cache name for the templates (defaults to templateCache)
      cacheName: 'foo',

      // Jade/Pug compiler options. For a list of possible options, consult Jade/Pug documentation.
      pugOptions: {
        doctype: 'xml'
      },
    }
  });
};
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
