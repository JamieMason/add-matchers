# add-matchers

> Write useful test matchers compatible with Jest and Jasmine.

[![NPM version](http://img.shields.io/npm/v/add-matchers.svg?style=flat-square)](https://www.npmjs.com/package/add-matchers) [![NPM downloads](http://img.shields.io/npm/dm/add-matchers.svg?style=flat-square)](https://www.npmjs.com/package/add-matchers) [![Build Status](http://img.shields.io/travis/JamieMason/add-matchers/master.svg?style=flat-square)](https://travis-ci.org/JamieMason/add-matchers) [![Maintainability](https://api.codeclimate.com/v1/badges/b724d1eb54706d0752f4/maintainability)](https://codeclimate.com/github/JamieMason/add-matchers/maintainability)

## Table of Contents

-   [🌩 Installation](#-installation)
-   [📝 API](#-api)
-   [➕ Writing Matchers](#-writing-matchers)
-   [🙋🏽‍♂️ Getting Help](#♂️-getting-help)
-   [👀 Other Projects](#-other-projects)
-   [🤓 Author](#-author)

## 🌩 Installation

    npm install --save-dev add-matchers

Include add-matchers after your test framework but before your tests, and register your matchers before your tests as well.

## 📝 API

### Add Custom Matchers

```js
import { addMatchers } from "add-matchers";

addMatchers({
  toBeFoo(value) {
    return value === "foo";
  },
  toInclude(other, value) {
    return value.includes(other);
  }
});
```

```js
expect("foo").toBeFoo();
expect("jamie").toInclude("jam");
```

### Add Custom Asymmetric Matchers

```js
import { addMatchers } from "add-matchers";

addMatchers.asymmetric({
  toBeFoo(value) {
    return value === "foo";
  },
  toInclude(other, value) {
    return value.includes(other);
  }
});
```

```js
expect({ key: "foo", prop: "bar" }).toEqual({
  key: any.toBeFoo(),
  prop: any.toInclude("ar")
});
```

## ➕ Writing Matchers

The argument passed to `expect` is always the last argument passed to your Matcher, with any other arguments appearing before it in the order they were supplied.

This means that, in the case of `expect(received).toBeAwesome(arg1, arg2, arg3)`, your function will be called with `fn(arg1, arg2, arg3, received)`.

Arguments are ordered in this way to support [partial application](http://ejohn.org/blog/partial-functions-in-javascript/) and increase re-use of matchers.

### Examples

If we wanted to use the following Matchers in our tests;

```js
// matcher with 0 arguments
expect(4).toBeEvenNumber();

// matcher with 1 argument
expect({}).toBeOfType("Object");

// matcher with Many arguments
expect([100, 14, 15, 2]).toContainItems(2, 15, 100);
```

We would create them as follows;

```js
import { addMatchers } from "add-matchers";

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
    return Object.prototype.toString.call(received) === "[object " + type + "]";
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

For more examples, see [Jasmine Matchers](https://github.com/JamieMason/Jasmine-Matchers/tree/master/src) which is built using this library.

## 🙋🏽‍♂️ Getting Help

Get help with issues by creating a [Bug Report] or discuss ideas by opening a [Feature Request].

[bug report]: https://github.com/JamieMason/add-matchers/issues/new?template=bug_report.md

[feature request]: https://github.com/JamieMason/add-matchers/issues/new?template=feature_request.md

## 👀 Other Projects

If you find my Open Source projects useful, please share them ❤️

-   [**eslint-formatter-git-log**](https://github.com/JamieMason/eslint-formatter-git-log)<br>ESLint Formatter featuring Git Author, Date, and Hash
-   [**eslint-plugin-move-files**](https://github.com/JamieMason/eslint-plugin-move-files)<br>Move and rename files while keeping imports up to date
-   [**eslint-plugin-prefer-arrow-functions**](https://github.com/JamieMason/eslint-plugin-prefer-arrow-functions)<br>Convert functions to arrow functions
-   [**ImageOptim-CLI**](https://github.com/JamieMason/ImageOptim-CLI)<br>Automates ImageOptim, ImageAlpha, and JPEGmini for Mac to make batch optimisation of images part of your automated build process.
-   [**Jasmine-Matchers**](https://github.com/JamieMason/Jasmine-Matchers)<br>Write Beautiful Specs with Custom Matchers
-   [**karma-benchmark**](https://github.com/JamieMason/karma-benchmark)<br>Run Benchmark.js over multiple Browsers, with CI compatible output
-   [**self-help**](https://github.com/JamieMason/self-help#readme)<br>Interactive Q&A Guides for Web and the Command Line
-   [**syncpack**](https://github.com/JamieMason/syncpack#readme)<br>Manage multiple package.json files, such as in Lerna Monorepos and Yarn Workspaces

## 🤓 Author

<img src="https://www.gravatar.com/avatar/acdf106ce071806278438d8c354adec8?s=100" align="left">

I'm [Jamie Mason] from [Leeds] in England, I began Web Design and Development in 1999 and have been Contracting and offering Consultancy as Fold Left Ltd since 2012. Who I've worked with includes [Sky Sports], [Sky Bet], [Sky Poker], The [Premier League], [William Hill], [Shell], [Betfair], and Football Clubs including [Leeds United], [Spurs], [West Ham], [Arsenal], and more.

<div align="center">

[![Follow JamieMason on GitHub][github badge]][github]      [![Follow fold_left on Twitter][twitter badge]][twitter]

</div>

<!-- images -->

[github badge]: https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow

[twitter badge]: https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow

<!-- links -->

[arsenal]: https://www.arsenal.com

[betfair]: https://www.betfair.com

[github]: https://github.com/JamieMason

[jamie mason]: https://www.linkedin.com/in/jamiemasonleeds

[leeds united]: https://www.leedsunited.com/

[leeds]: https://www.instagram.com/visitleeds

[premier league]: https://www.premierleague.com

[shell]: https://www.shell.com

[sky bet]: https://www.skybet.com

[sky poker]: https://www.skypoker.com

[sky sports]: https://www.skysports.com

[spurs]: https://www.tottenhamhotspur.com

[twitter]: https://twitter.com/fold_left

[west ham]: https://www.whufc.com

[william hill]: https://www.williamhill.com
