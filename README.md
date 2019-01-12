# add-matchers

> Write useful test matchers compatible with Jest and Jasmine.

[![NPM version](http://img.shields.io/npm/v/add-matchers.svg?style=flat-square)](https://www.npmjs.com/package/add-matchers)
[![NPM downloads](http://img.shields.io/npm/dm/add-matchers.svg?style=flat-square)](https://www.npmjs.com/package/add-matchers)
[![Build Status](http://img.shields.io/travis/JamieMason/add-matchers/master.svg?style=flat-square)](https://travis-ci.org/JamieMason/add-matchers)
[![Maintainability](https://api.codeclimate.com/v1/badges/b724d1eb54706d0752f4/maintainability)](https://codeclimate.com/github/JamieMason/add-matchers/maintainability)
[![Gitter Chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/JamieMason/add-matchers)
[![Donate via PayPal](https://img.shields.io/badge/donate-paypal-blue.svg)](https://www.paypal.me/foldleft)
[![Backers](https://opencollective.com/fold_left/backers/badge.svg)](https://opencollective.com/fold_left#backer)
[![Sponsors](https://opencollective.com/fold_left/sponsors/badge.svg)](https://opencollective.com/fold_left#sponsors)
[![Analytics](https://ga-beacon.appspot.com/UA-45466560-5/add-matchers?flat&useReferer)](https://github.com/igrigorik/ga-beacon)
[![Follow JamieMason on GitHub](https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow)](https://github.com/JamieMason)
[![Follow fold_left on Twitter](https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow)](https://twitter.com/fold_left)

**What**: A JavaScript library to write test Matchers compatible with all
versions of [Jest](http://facebook.github.io/jest/) and
[Jasmine](https://jasmine.github.io/).

**Why**: The way you write tests in Jasmine and Jest is _extremely_ similar, but
the APIs for adding custom matchers vary wildly between Jasmine 1.x, Jasmine
2.x, and Jest. This library aims to remove those obstacles and encourage
Developers to share useful matchers they've created with the community.

**How**: Developers use the API from this library, which converts them to be
compatible with whichever test framework is running.

## Contents

- [Installation](#installation)
- [API](#api)
- [Writing Matchers](#writing-matchers)
  - [Examples](#examples)
- [Related Projects](#related-projects)

## Installation

```
npm install --save-dev add-matchers
```

Include add-matchers after your test framework but before your tests, and
register your matchers before your tests as well.

## API

### Add Custom Matchers

```js
import { addMatchers } from 'add-matchers';

addMatchers({
  toBeFoo(value) {
    return value === 'foo';
  },
  toInclude(other, value) {
    return value.includes(other);
  }
});
```

```js
expect('foo').toBeFoo();
expect('jamie').toInclude('jam');
```

### Add Custom Asymmetric Matchers

```js
import { addMatchers } from 'add-matchers';

addMatchers.asymmetric({
  toBeFoo(value) {
    return value === 'foo';
  },
  toInclude(other, value) {
    return value.includes(other);
  }
});
```

```js
expect({ key: 'foo', prop: 'bar' }).toEqual({
  key: any.toBeFoo(),
  prop: any.toInclude('ar')
});
```

## Writing Matchers

The argument passed to `expect` is always the last argument passed to your
Matcher, with any other arguments appearing before it in the order they were
supplied.

This means that, in the case of
`expect(received).toBeAwesome(arg1, arg2, arg3)`, your function will be called
with `fn(arg1, arg2, arg3, received)`.

Arguments are ordered in this way to support
[partial application](http://ejohn.org/blog/partial-functions-in-javascript/)
and increase re-use of matchers.

### Examples

If we wanted to use the following Matchers in our tests;

```js
// matcher with 0 arguments
expect(4).toBeEvenNumber();

// matcher with 1 argument
expect({}).toBeOfType('Object');

// matcher with Many arguments
expect([100, 14, 15, 2]).toContainItems(2, 15, 100);
```

We would create them as follows;

```js
import { addMatchers } from 'add-matchers';

addMatchers({
  // matcher with 0 arguments
  toBeEvenNumber: function(received) {
    // received : 4
    return received % 2 === 0;
  },
  // matcher with 1 argument
  toBeOfType: function(type, received) {
    // type     : 'Object'
    // received : {}
    return Object.prototype.toString.call(received) === '[object ' + type + ']';
  },
  // matcher with many arguments
  toContainItems: function(arg1, arg2, arg3, received) {
    // arg1     : 2
    // arg2     : 15
    // arg3     : 100
    // received : [100, 14, 15, 2]
    return (
      received.indexOf(arg1) !== -1 &&
      received.indexOf(arg2) !== -1 &&
      received.indexOf(arg3) !== -1
    );
  }
});
```

For more examples, see
[Jasmine Matchers](https://github.com/JamieMason/Jasmine-Matchers/tree/master/src)
which is built using this library.

## Related Projects

- [Jasmine Matchers](https://github.com/JamieMason/Jasmine-Matchers): A huge
  library of test assertion matchers to improve readability.
- [karma-benchmark](https://github.com/JamieMason/karma-benchmark): A Karma
  plugin to run [Benchmark.js](https://benchmarkjs.com/) over multiple browsers,
  with CI compatible output.
- [karma-jasmine-matchers](https://github.com/JamieMason/karma-jasmine-matchers):
  A Karma plugin to inject Jasmine Matchers.
- [karma-nested-reporter](https://github.com/JamieMason/karma-nested-reporter):
  Easy to read test output with nested `describe` and `it` blocks.
