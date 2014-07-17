/**
 * Module dependencies
 */
var expat = require('node-expat')
  , util = require('util')
  , debug = require('debug')('feed-stream')
  , stream = require('stream');

// Default options
var defaults = {
  blacklist: [],
  rename: {},
  productElement: 'product',
  newlines: false,
  lowercaseKeys: false,
  trim: false,
  json: false
}

var FeedStream = module.exports = function (opts) {
  // Grab opts
  opts = this.opts = opts || {};

  // Set default options
  for (var k in defaults) {
    if (!opts[k]) opts[k] = defaults[k];
  }

  // In progress object
  this.obj = {};
  // In progress key and value
  this.key = this.val = '';

  // Initialize state
  this.state = 'none';

  // Setup parser
  var parser = this.parser = new expat.Parser('UTF-8');

  // Handle element start
  parser.on('startElement', this._handleStart.bind(this));

  // Handle text
  parser.on('text', this._handleText.bind(this));

  // Handle element end
  parser.on('endElement', this._handleEnd.bind(this));


  // Inherit from duplex stream
  stream.Duplex.call(this, opts);
};
util.inherits(FeedStream, stream.Duplex);

FeedStream.prototype._handleStart = function (name, attrs) {
  var opts = this.opts
    , state = this.state;

  debug('start state: %s, name: %s', this.state, name);
  if (state === 'none') {
    if (name === opts.productElement) this.state = 'product';
  } else if (state === 'product') {
    this.state = 'item', this.key = name;
  }
};

FeedStream.prototype._handleText = function (text) {
  debug('text state: %s, text: %s', this.state, text);
  if (this.state === 'item') {
    this.val += text;
  }
};

FeedStream.prototype._handleEnd = function (name) {
  var opts = this.opts
    , state = this.state
    , product = opts.productElement
    , rename = opts.rename
    , blacklist = opts.blacklist
    , newlines = opts.newlines
    , lowercase = opts.lowercaseKeys
    , trim = opts.trim;

  debug('end state: %s, name: %s', this.state, name);
  if (state === 'product' && name === product) {
    // Finished a product, pass it on to consumers
    this.push(JSON.stringify(this.obj) + (newlines ? '\n' : ''));

    // Reset state and object
    this.state = 'none', this.obj = {};
  } else if (state === 'item') {
    // Rename key, if applicable
    if (rename[this.key]) this.key = rename[this.key];

    // Lowercase keys, if applicable
    if (lowercase) this.key = this.key.toLowerCase();

    // Trim value, if applicable
    if (trim) this.val = this.val.trim();

    // Add key to object, if allowed
    if (!~blacklist.indexOf(this.key)) {
      this.obj[this.key] = this.val;
    }

    // Finished a key-value pair, move back into the product state
    this.state = 'product';

    // Reset key and val
    this.key = this.val = '';
  }
};

FeedStream.prototype._write = function (chunk, encoding, cb) {
  this.parser.write(chunk);
  cb();
};

FeedStream.prototype._read = function () {
  return;
};
