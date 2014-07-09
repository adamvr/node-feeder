# feeder

## Introduction

This project is a simple xml to json converter for the most common types of ecommerce product feeds.

## Dependencies

* [node-expat](http://github.com/node-xmpp/node-expat)
* [debug](http://github.com/visionmedia/debug)
* [nomnom](http://github.com/harthur/nomnom)

## Usage

```javascript
var FeedStream = require('feeder')
  , fs = require('fs');

fs.createReadStream('feed.xml')
  .pipe(new FeedStream())
  .pipe(process.stdout);
```
## Options

* `newlines` - `Boolean` print each product on a new line
* `trim` - `Boolean` trim element text
* `blacklist` - `Array` blacklist keys from being emitted
* `rename` - `Object` rename keys e.g. `{"before": "after"}`
* `lowercaseKeys` - `Boolean` lower case keys

## License

MIT
