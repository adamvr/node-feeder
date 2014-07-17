#!/usr/bin/env node

/**
 * Dependencies
 */
var FeedStream = require('./')
  , fs = require('fs')
  , nomnom = require('nomnom');

var opts = nomnom
  .script('feeder')
  .option('productElement', {
    abbr: 'p',
    full: 'product',
    help: 'Product key, usually "product" or some variation',
    default: 'product'
  })
  .option('rename', {
    abbr: 'r',
    help: 'Give key rename pairs in the form k1:k2,k3:k4',
    default: {},
    transform: function (r) {
      var obj = {};

      for (var p = r.split(','), i = 0; i < p.length; i++) {
        var split = p[i].split(':')
          , before = split[0]
          , after = split[1];

        // Ignore invalid pairs
        if (!before || !after) continue;

        // Add pair to object
        obj[before] = after;
      }

      return obj;
    }
  })
  .option('blacklist', {
    abbr: 'b',
    help: 'Specify keys to blacklist, comma separated',
    default: [],
    transform: function (r) {
      return r.split(',').map(function (x) { return x.trim() });
    }
  })
  .option('trim', {
    flag: true,
    abbr: 't',
    help: 'Trim values',
    default: true
  })
  .option('json', {
    flag: true,
    abbr: 'j',
    help: 'Json mode',
    default: false
  })
  .parse();

// Always separate with newlines
opts.newlines = true;

if (opts[0]) {
  // If a file was specified, read it in
  fs.createReadStream(opts[0])
    .pipe(new FeedStream(opts))
    .pipe(process.stdout);
} else {
  // Otherwise, just read from stdin
  process.stdin
    .pipe(new FeedStream(opts))
    .pipe(process.stdout);
}
