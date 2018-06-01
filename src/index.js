#!/usr/bin/env node

/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

 'use strict';
const meow = require('meow');
const minimist = require('minimist');
const writeReport = require('./write-report');

const chromeFlags = [
  '--disable-gpu',
  '--headless',
  '--no-zygote',
  '--no-sandbox',
  '--single-process',
];

const flags = {
  output: 'json',
};

const cli = meow(`
  Usage
    $ lighthouse-ci <target-url>

  Example
    $ lighthouse-ci https://example.com/
    ┌────────────────┬────────┐
    │    (index)     │ Values │
    ├────────────────┼────────┤
    │  performance   │   1    │
    │      pwa       │  0.45  │
    │ accessibility  │  0.88  │
    │ best-practices │  0.94  │
    │      seo       │  0.89  │
    └────────────────┴────────┘
`);

const testUrl = cli.input[0];

// Run Google Lighthouse
writeReport(testUrl, flags, chromeFlags)
  .then(result => {
    console.table(result);
  });