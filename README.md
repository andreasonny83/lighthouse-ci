# Lighthouse CI
[![Build Status](https://travis-ci.com/andreasonny83/lighthouse-ci.svg?branch=master)](https://travis-ci.com/andreasonny83/lighthouse-ci)
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors)
[![npm version](https://badge.fury.io/js/lighthouse-ci.svg)](https://badge.fury.io/js/lighthouse-ci)
[![npm](https://img.shields.io/npm/dt/lighthouse-ci.svg)](https://www.npmjs.com/package/lighthouse-ci)
[![Known Vulnerabilities](https://snyk.io/test/github/andreasonny83/lighthouse-ci/badge.svg?targetFile=package.json)](https://snyk.io/test/github/andreasonny83/lighthouse-ci?targetFile=package.json)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

> A useful wrapper around Google Lighthouse CLI

<img alt="Lighthouse CI logo" src="https://raw.githubusercontent.com/andreasonny83/lighthouse-ci/master/logo.png" width="800px">

<img src="https://raw.githubusercontent.com/andreasonny83/lighthouse-ci/master/lighthouse-cli.gif" width="700">

## Install

```
$ npm install -g lighthouse-ci
```

## Table of Contents

- [Lighthouse CI](#lighthouse-ci)
  - [Install](#install)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
  - [CLI](#cli)
  - [Lighthouse flags](#lighthouse-flags)
    - [Chrome flags](#chrome-flags)
  - [Configuration](#configuration)
  - [Performance Budget](#performance-budget)
      - [Option 1.](#option-1)
      - [Option 2.](#option-2)
      - [Option 3.](#option-3)
  - [Codechecks](#codechecks)
  - [Demo App](#demo-app)
  - [How to](#how-to)
    - [Test a page that requires authentication](#test-a-page-that-requires-authentication)
    - [Wait for post-load JavaScript to execute before ending a trace](#wait-for-post-load-javascript-to-execute-before-ending-a-trace)
  - [Contributors](#contributors)
  - [License](#license)

## Usage

```sh
lighthouse-ci --help
```

## CLI

```
$ lighthouse-ci --help

  Usage
    $ lighthouse-ci <target-url>

  Example
    $ lighthouse-ci https://example.com
    $ lighthouse-ci https://example.com -s
    $ lighthouse-ci https://example.com --score=75
    $ lighthouse-ci https://example.com --accessibility=90 --seo=80
    $ lighthouse-ci https://example.com --accessibility=90 --seo=80 --report=folder
    $ lighthouse-ci https://example.com --report=folder --config-path=configs.json

  Options
    -s, --silent                  Run Lighthouse without printing report log
    --report=<path>               Generate an HTML report inside a specified folder
    --filename=<filename>         Specify the name of the generated HTML report file (requires --report)
    -json, --jsonReport           Generate JSON report in addition to HTML (requires --report)
    --config-path                 The path to the Lighthouse config JSON (read more here: https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)
    --budget-path                 The path to the Lighthouse budgets config JSON (read more here: https://developers.google.com/web/tools/lighthouse/audits/budgets)
    --score=<threshold>           Specify a score threshold for the CI to pass
    --performance=<threshold>     Specify a minimal performance score for the CI to pass
    --pwa=<threshold>             Specify a minimal pwa score for the CI to pass
    --accessibility=<threshold>   Specify a minimal accessibility score for the CI to pass
    --best-practice=<threshold>   [DEPRECATED] Use best-practices instead
    --best-practices=<threshold>  Specify a minimal best-practice score for the CI to pass
    --seo=<threshold>             Specify a minimal seo score for the CI to pass
    --budget.<counts|sizes>.<type>    Specify individual budget threshold (if --budget-path not set)
    --chromium-fallback           If no Chrome installations are found download and use Chromium browser instead
    --chromium-force              Always download and use Chromium browser.
```

## Lighthouse flags

In addition to listed `lighthouse-ci` configuration flags, it is also possible to pass any native `lighthouse` flags.

To see the full list of available flags, please refer to the official [Google Lighthouse documentation](https://github.com/GoogleChrome/lighthouse#cli-options).

eg.

```sh
# Launches browser, collects artifacts, saves them to disk (in `./test-report/`) and quits
$ lighthouse-ci --gather-mode=test-report https://my.website.com
# skips browser interaction, loads artifacts from disk (in `./test-report/`), runs audits on them, generates report
$ lighthouse-ci --audit-mode=test-report https://my.website.com
```

### Chrome flags

In addition of the lighthouse flags, you can also specify extra chrome flags
comma separated.

eg.

```sh
$ lighthouse-ci --chrome-flags=--cellular-only,--force-ui-direction=rtl https://my.website.com
```

eg.

```sh
$ lighthouse-ci --emulated-form-factor desktop --seo 92 https://my.website.com
```

## Configuration

Lighthouse CI allows you to pass a custom Lighthouse configuration file.
Read [Lighthouse Configuration](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)
to learn more about the configuration options available.

Just generate your configuration file. For example this `config.json`

```json
{
  "extends": "lighthouse:default",
  "audits": [
    "user-timings",
    "critical-request-chains"
  ],

  "categories": {
    "performance": {
      "name": "Performance Metrics",
      "description": "Sample description",
      "audits": [
        {"id": "user-timings", "weight": 1},
        {"id": "critical-request-chains", "weight": 1}
      ]
    }
  }
}
```

Then run Lighthouse CI with the `--config-path` flag

```sh
$ lighthouse-ci https://example.com --report=reports --config-path=config.json
```

The generated report inside `reports` folder will follow the custom configuration listed under the `config.json` file.

## Performance Budget

Lighthouse CI allows you to pass a performance budget configuration file (see [Lighthouse Budgets](https://developers.google.com/web/tools/lighthouse/audits/budgets)).
There are several options to pass performance budget configs:

#### Option 1.
Add configurations to your `config.json` file like and use instructions above.
``` json
{
  "extends": "lighthouse:default",
  "settings": {
    "budgets": [
      {
        "resourceCounts": [
          { "resourceType": "total", "budget": 10 },
          ...
        ],
        "resourceSizes": [
          { "resourceType": "total", "budget": 100 },
          ...
        ]
      }
    ]
  }
}
```
#### Option 2.
Generate `budget.json` with content like:
``` json
[
  {
    "resourceCounts": [
      { "resourceType": "total", "budget": 10 },
      ...
    ],
    "resourceSizes": [
      { "resourceType": "total", "budget": 100 },
      ...
    ]
  }
]
```

Then run Lighthouse CI with the `--budget-path` flag

```sh
$ lighthouse-ci https://example.com --report=reports --budget-path=budget.json
```

#### Option 3.
Pass individual parameters via CLI

```sh
$ lighthouse-ci https://example.com --report=reports --budget.counts.total=20  --budget.sizes.fonts=100000
```

## Codechecks

You can now easily integrate Lighthouse-CI as part of your automated CI with [codechecks.io](https://codechecks.io/).

<img src="https://raw.githubusercontent.com/andreasonny83/lighthouse-ci/master/codechecks-01.png" width="48%"> <img src="https://raw.githubusercontent.com/andreasonny83/lighthouse-ci/master/codechecks-02.png" width="48%">

**Running Lighthouse-CI with Codechecks**

```sh
$ npm install --save-dev @codechecks/client @codechecks/lighthouse-keeper
```

Now, create a `codechecks.yml` (json is supported as well) file required for codechecks to automatically run against your project.

`codechecks.yml:`

```yml
checks:
  - name: lighthouse-keeper
    options:
      # just provide path to your build
      buildPath: ./build
      # or full url
      # url: https://google.com
  # ...
```

Read more from the official documentation from [https://github.com/codechecks/lighthouse-keeper](https://github.com/codechecks/lighthouse-keeper).

Read more about Codechecks on the [official project website](https://codechecks.io/)

## Demo App

This project contains a demo folder where a project as been created for demo purposes only.
Once inside the `demo` folder, if you have Docker installed on your machine, you can simply launch the demo app inside a Docker container with `make demo`.

If you just want to run the demo locally, make sure to install the node dependencies first with `npm install`,
then run the demo with:

```
$ npm start
```

## How to

### Test a page that requires authentication

By default `lighthouse-cli` is just creating the report against a specific URL without letting the engineer to interact with the browser.
Sometimes, however, the page for which you want to generate the report, requires the user to be authenticated.
Depending on the authentication mechanism, you can inject extra header information into the page.

```sh
lighthouse-ci https://example.com --extra-headers=./extra-headers.js
```

Where `extra-headers.json` contains:

```js
module.exports = {
  Authorization: 'Bearer MyAccessToken',
  Cookie: "user=MySecretCookie;"
};
```

### Wait for post-load JavaScript to execute before ending a trace

Your website might require extra time to load and execute all the JavaScript logic.
It is possible to let LightHouse wait for a certain amount of time, before ending a trace,
by providing a `pauseAfterLoadMs` value to a custom configuration file.

eg.

```sh
lighthouse-ci https://example.com --config-path ./config.json
```

Where `config.json` contains:

```json
{
  "extends": "lighthouse:default",
  "passes": [{
    "recordTrace": true,
    "pauseAfterLoadMs": 5000,
    "networkQuietThresholdMs": 5000
  }]
}
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://about.me/andreasonny83"><img src="https://avatars0.githubusercontent.com/u/8806300?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrea Sonny</b></sub></a><br /><a href="#question-andreasonny83" title="Answering Questions">💬</a> <a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=andreasonny83" title="Code">💻</a> <a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=andreasonny83" title="Documentation">📖</a></td>
    <td align="center"><a href="https://snap-ci.com"><img src="https://avatars1.githubusercontent.com/u/1007970?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Celso Santa Rosa</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=celsosantarosa" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/BenAHammond"><img src="https://avatars3.githubusercontent.com/u/3516389?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ben Hammond</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/issues?q=author%3ABenAHammond" title="Bug reports">🐛</a> <a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=BenAHammond" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/alexecus"><img src="https://avatars1.githubusercontent.com/u/12739106?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Tenepere</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/issues?q=author%3Aalexecus" title="Bug reports">🐛</a> <a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=alexecus" title="Code">💻</a></td>
    <td align="center"><a href="https://ikigeg.com"><img src="https://avatars0.githubusercontent.com/u/8846301?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Griffiths</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=ikigeg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/cmarkwell"><img src="https://avatars0.githubusercontent.com/u/23330646?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Connor Markwell</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=cmarkwell" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Juuro"><img src="https://avatars2.githubusercontent.com/u/559017?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sebastian Engel</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/issues?q=author%3AJuuro" title="Bug reports">🐛</a> <a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=Juuro" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://asmagin.com/"><img src="https://avatars3.githubusercontent.com/u/1803342?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Smagin</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=asmagin" title="Code">💻</a> <a href="#ideas-asmagin" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/marcschaller"><img src="https://avatars2.githubusercontent.com/u/31402947?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marc Schaller</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/issues?q=author%3Amarcschaller" title="Bug reports">🐛</a> <a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=marcschaller" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Remi-p"><img src="https://avatars3.githubusercontent.com/u/6367611?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rémi Perrot</b></sub></a><br /><a href="https://github.com/andreasonny83/lighthouse-ci/issues?q=author%3ARemi-p" title="Bug reports">🐛</a> <a href="https://github.com/andreasonny83/lighthouse-ci/commits?author=Remi-p" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

MIT

---

Created with 🦄 by [andreasonny83](https://about.me/andreasonny83)
