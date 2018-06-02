#!/usr/bin/env node

/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

'use strict';
const fs = require('fs');
const path = require('path');
const meow = require('meow');
const ora = require('ora');

const {clean, createDir} = require('./helpers');
const writeReport = require('./write-report');

const cli = meow(`
  Usage
    $ lighthouse-ci <target-url>

  Options
	  --report, -r  Generate an HTML report inside a 'lighthouse' folder.
	  --silent, -s  Run Lighthouse without printing report log.

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

    $ lighthouse-ci -s https://example.com/
`, {
  flags: {
    report: {
      type: 'boolean',
      alias: 'r',
      default: false,
    },
    silent: {
      type: 'boolean',
      alias: 's',
      default: false,
    },
  }
});

const chromeFlags = [
  '--disable-gpu',
  '--headless',
  '--no-zygote',
  '--no-sandbox',
  '--single-process',
];

function init(args, cliFlags, chromeFlags) {
  if (args.length === 0) {
    return cli.showHelp(1);
  }

  const testUrl = args[0];
  const flags = {...cliFlags};
  const msg = `Running Lighthouse on ${testUrl} ...\n`;
  const spinner = ora(msg).start();

  // Run Google Lighthouse
  writeReport(testUrl, flags, chromeFlags)
    .then(async ({categoryReport, htmlReport}) => {
      const outputPath = path.resolve('lighthouse', 'report.html');
      const {silent} = flags;

      if (flags.report) {
        await clean();
        await createDir('./lighthouse');
        await fs.writeFileSync(outputPath, htmlReport);
      }

      spinner.stop();

      return {categoryReport, silent};
    })
    .then(({categoryReport, silent}) =>
      silent ? false : console.table(categoryReport))
    .catch(err => {
      spinner.stop();
      console.error(err);
    });
}

init(cli.input, cli.flags, chromeFlags);
