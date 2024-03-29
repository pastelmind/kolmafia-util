# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.3.0](https://github.com/pastelmind/kolmafia-util/compare/v0.2.2...v0.3.0) (2021-07-20)


### ⚠ BREAKING CHANGES

* export `assert` as single namespace object

### Features

* add `notifyProjectMaintainer()` ([a02ba06](https://github.com/pastelmind/kolmafia-util/commit/a02ba06b00033e6d051af22c3b44db70b932bed4))
* export `assert` as single namespace object ([28de966](https://github.com/pastelmind/kolmafia-util/commit/28de966b941d8ba59f3c0b85b5b43e1095dc087d))

### [0.2.2](https://github.com/pastelmind/kolmafia-util/compare/v0.2.1...v0.2.2) (2021-07-16)


### Bug Fixes

* prevent `sendToPlayer()` from swallowing all exceptions ([2519b41](https://github.com/pastelmind/kolmafia-util/commit/2519b410a96625232d86e2e6b36e9496e6b25769))

### [0.2.1](https://github.com/pastelmind/kolmafia-util/compare/v0.2.0...v0.2.1) (2021-07-16)


### Features

* add kmail & gift functions ([054aebd](https://github.com/pastelmind/kolmafia-util/commit/054aebd6ce1a1e6d00fa5cf784208897cc38ec19))

## [0.2.0](https://github.com/pastelmind/kolmafia-util/compare/v0.1.3...v0.2.0) (2021-07-12)


### ⚠ BREAKING CHANGES

* To export two entrypoints, use the `exports` and `typesVersions` fields
in `package.json`. This requires Node.js >= 12.16.0 || >= 13.7.0.

### Features

* add assert submodule ([7c5354d](https://github.com/pastelmind/kolmafia-util/commit/7c5354d842da11ef42e979660c8cec58fb721eb5))


### Bug Fixes

* withFamiliarIfOwned() always restores the original familiar ([865b6da](https://github.com/pastelmind/kolmafia-util/commit/865b6da75d6db0d3318cc04bea9b30000b9fc4ff))

### [0.1.3](https://github.com/pastelmind/kolmafia-util/compare/v0.1.2...v0.1.3) (2021-06-30)


### Features

* Add context manager functions ([8471323](https://github.com/pastelmind/kolmafia-util/commit/8471323e574241d7106b2d83a471fd60e1d24305))


### Bug Fixes

* Add `skipLibCheck` to tsconfig ([a4095c1](https://github.com/pastelmind/kolmafia-util/commit/a4095c14c23225a3158b706a5b7c75f3dfb4ad20))

## [0.1.2] - 2021-01-21

### Changed

- Use kolmafia-types instead of kolmafia-js.
  Also, this is now a dev-only dependency. (#2)

## [0.1.1] - 2020-12-24

### Fixed

- Remove warning message about "don't call this script directly". The warning was accidentally leaking into downstream scripts that bundled kolmafia-us using Rollup.

## [0.1.0] - 2020-12-24

### Added

- Initial release

[unreleased]: https://github.com/pastelmind/kolmafia-util/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/pastelmind/kolmafia-util/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/pastelmind/kolmafia-util/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/pastelmind/kolmafia-util/releases/tag/v0.1.0
