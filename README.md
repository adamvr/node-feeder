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
* `productElement` - `String` element name to mark the start and end of a product. Usually 'product' or some variation thereof
* `extractAttrs` - `Boolean` extract all element attributes into emitted objects

## Example

`FeedStream` accepts xml of approximately the following format:

```xml
<products>
  <product>
    <name> Wintermute </name>
    <price> 2000.00 </price>
    <currency> CHF </price>
  </product>
  <product>
    <name> Neuromancer </name>
    <price> 100000.00 </price>
    <currency> BRL </currency>
  </product>
</products>
```

and produces a stringified JSON object for each product:

```javascript
{ name: 'Wintermute', price: '2000.00', currency: 'CHF' }
{ name: 'Neuromancer', price: '100000.00', currency: 'BRL'}
```

## License

MIT
