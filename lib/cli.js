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
const chalk = require('chalk');

const {clean, createDir, scoreReducer} = require('./helpers');
const {getScores, getChromeFlags} = require('./config');
const lighthouseReporter = require('./lighthouse-reporter');
const analizeScore = require('./score-analizer');

const spinner = ora({
  color: 'yellow',
});

const cli = meow(`
  Usage
    $ lighthouse-ci <target-url>

  Example
    $ lighthouse-ci https://example.com/
    $ lighthouse-ci -s https://example.com/
    $ lighthouse-ci https://example.com/ --score=75
    $ lighthouse-ci https://example.com/ --accessibility=90 --seo=80

  Options
    -r, --report                  Generate an HTML report inside a 'lighthouse' folder.
    -s, --silent                  Run Lighthouse without printing report log.
    --score=<threshold>           Specify a score threshold for the CI to pass.
    --performance=<threshold>     Specify a minimal performance score for the CI to pass.
    --pwa=<threshold>             Specify a minimal pwa score for the CI to pass.
    --accessibility=<threshold>   Specify a minimal accessibility score for the CI to pass.
    --best-practice=<threshold>   Specify a minimal best-practice score for the CI to pass.
    --seo=<threshold>             Specify a minimal seo score for the CI to pass.
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
    score: {type: 'string'},
    performance: {type: 'string'},
    pwa: {type: 'string'},
    accessibility: {type: 'string'},
    bestPractice: {type: 'string'},
    seo: {type: 'string'},
  }
});

function init(args, cliFlags, chromeFlags) {
  const testUrl = args[0];
  const flags = {...cliFlags};

  // Run Google Lighthouse
  return lighthouseReporter(testUrl, flags, chromeFlags)
    .then(async ({categoryReport, htmlReport}) => {
      const outputPath = path.resolve('lighthouse', 'report.html');
      const {silent} = flags;

      if (flags.report) {
        await clean();
        await createDir('./lighthouse');
        await fs.writeFileSync(outputPath, htmlReport);
      }

      return {categoryReport, silent};
    });
}

Promise
  .resolve()
  .then(() => {
    if (cli.input.length === 0) {
      return cli.showHelp();
    }

    spinner.text = `Running Lighthouse on ${cli.input} ...\n`;
    spinner.start();

    return init(cli.input, cli.flags, getChromeFlags());
  })
  .then(({categoryReport, silent}) => {
    spinner.stop();

    if (!silent) {
      for (const category in categoryReport) {
        if (!categoryReport[category]) {
          continue;
        }

        console.log(
          `${chalk.yellow(category)}: ${chalk.yellow(categoryReport[category])}`);
      }
    }

    return categoryReport;
  })
  .then(categoryReport => {
    const thresholds = scoreReducer(cli.flags, getScores());

    if (thresholds && Object.keys(thresholds).length !== 0) {
      const isScorePassing = analizeScore(categoryReport, thresholds);

      if (isScorePassing) {
        console.log(chalk.green('All checked scores are passing. 🎉\n'));
        return process.exit(0);
      }
    }

    console.log(chalk.red('Failed. ❌\n'));
    return process.exit(1);
  })
  .catch(err => {
    spinner.stop();
    console.log(chalk.red(err));
  });
