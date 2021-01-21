# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
