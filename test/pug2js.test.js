var expect = require('expect.js');
var pug2js = require('../lib/pug2js');
var LOGGER_STUB = {
  create: function () {
    return {
      debug: function () {}
    };
  }
};
var BASE_PATH_STUB = 'foo';

describe('pug2js', function() {
  var FILE_STUB;

  before(function() {
    FILE_STUB = {
      originalPath: '/tmp/original/path.pug',
      path: '/tmp/new/path.pug'
    };
  });

  describe('default behavior (no config)', function() {
    var compileFn = pug2js(LOGGER_STUB, BASE_PATH_STUB);
    var html;

    before(function(done) {
      var PUG_SNIPPET = 'h1 This is a bland message';
      compileFn(PUG_SNIPPET, FILE_STUB, function(result) {
        html = result;
        done();
      });
    });

    it('should succeed', function() {
      expect(html).to.contain('/tmp/original/path.html');
      expect(html).to.contain('window.__html__ = window.__html__ || {};');
      expect(html).to.contain('__html__[');
    });

  });

  describe('with cache name', function() {
    var compileFn = pug2js(LOGGER_STUB, BASE_PATH_STUB, {
      cacheName: 'foo',
    });
    var html;

    before(function(done) {
      var PUG_SNIPPET = 'h1 This is a bland message';
      compileFn(PUG_SNIPPET, FILE_STUB, function(result) {
        html = result;
        done();
      });
    });

    it('should succeed', function() {
      expect(html).to.contain('/tmp/original/path.html');
      expect(html).to.contain('window.foo = window.foo || {};');
      expect(html).to.contain('foo[');
    });

  });

  describe('pug locals', function() {

    var LOCALS_CONFIG = {
      locals: {
        message: 'Hello world'
      }
    };

    var compileFn = pug2js(LOGGER_STUB, BASE_PATH_STUB, LOCALS_CONFIG);
    var html;

    before(function(done) {
      var PUG_SNIPPET = 'h1= message';
      compileFn(PUG_SNIPPET, FILE_STUB, function(result) {
        html = result;
        done();
      });
    });

    it('should contain the `locals` data', function() {
      expect(html).to.contain('Hello world');
    });

  });

  describe('extension transform function', function() {

    var TRANSFORM_CONFIG = {
      cacheIdFromPath: function (path) {
        return path.replace('.jst.pug', '.html');
      }
    };

    var TRANSFORM_FILE_STUB = {
      originalPath: '/tmp/original/path.jst.pug',
      path: '/tmp/new/path'
    };

    var compileFn = pug2js(LOGGER_STUB, BASE_PATH_STUB, TRANSFORM_CONFIG);
    var html;

    before(function(done) {
      var PUG_SNIPPET = 'h1 Hello World';
      compileFn(PUG_SNIPPET, TRANSFORM_FILE_STUB, function(result) {
        html = result;
        done();
      });
    });

    it('should apply the transform function', function() {
      expect(html).to.contain('/tmp/original/path.html');
    });

  });

  describe('Pug config object', function() {
    var pug = require('pug');
    var originalCompile;
    var callOptions;

    before(function() {
      originalCompile = pug.compile;
      pug.compile = function(template, options) {
        callOptions = options;
        return function() { return ''; };
      };
    });

    after(function() {
      pug.compile = originalCompile;
      callOptions = null;
    });

    it('should pass Pug config object to Pug compile function', function(done) {
      var config = {
        // lib: 'pug',
        pugOptions: {
          a: 1,
          b: 2
        }
      };
      var compileFn = pug2js(LOGGER_STUB, BASE_PATH_STUB, config);
      compileFn('h1', FILE_STUB, function() {
        expect(callOptions).to.eql(config.pugOptions);
        done();
      });
    });
  });

  describe('Filepath', function() {
    var compileFn;

    before(function() {
      compileFn = pug2js(LOGGER_STUB, BASE_PATH_STUB);
      compileFn('h1', FILE_STUB, function() {});
      compileFn('h1', FILE_STUB, function() {});
    });

    it('should rename filepath extension to .html.js', function() {
      expect(FILE_STUB.path).to.eql('/tmp/new/path.html.js');
    });
  });
});

