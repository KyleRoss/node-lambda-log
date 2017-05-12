# LambdaLog Changelog

## 1.2.1 (5/11/2017)
* Fix issue with `console.debug` not existing in Lambda.

## 1.2.0 (5/4/2017)
* **Breaking Change:** `log` event now returns object containing `level`, `log` and `meta`.

## 1.1.0 (5/2/2017)
* **New:** Added `log.debug()` method for debug messages.
* **New:** Added `config.debug` to enable and disable debug log messages (default is `false`).

## 1.0.0 (4/11/2017)
* Initial release
