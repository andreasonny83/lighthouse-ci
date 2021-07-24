#!/usr/bin/env node

/**
 *  Copyright (c) 2018-2021 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const fs = require('fs');
const path = require('path');
const meow = require('meow');
const ora = require('ora');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

const { getChromeFlags } = require('../lib/config');
const lighthouseReporter = require('../lib/lighthouse-reporter');
const { calculateResults } = require('../lib/calculate-results');

const spinner = ora({
  color: 'yellow',
});

const cli = meow(
  `
  Usage
    $ lighthouse-ci <target-url>

  Example
    $ lighthouse-ci https://example.com
    $ lighthouse-ci https://example.com -s
    $ lighthouse-ci https://example.com --score=75
    $ lighthouse-ci https://example.com --accessibility=90 --seo=80
    $ lighthouse-ci https://example.com --accessibility=90 --seo=80 --report=folder
    $ lighthouse-ci https://example.com -report=folder --config-path=configs.json

  Options
    -s, --silent                    Run Lighthouse without printing report log
    --report=<path>                 Generate an HTML report inside a specified folder
    --filename=<filename>           Specify the name of the generated HTML report file (requires --report)
    -json, --jsonReport             Generate JSON report in addition to HTML (requires --report)
    --config-path                   The path to the Lighthouse config JSON (read more here: https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)
    --budget-path                   The path to the Lighthouse budgets config JSON (read more here: https://developers.google.com/web/tools/lighthouse/audits/budgets)
    --score=<threshold>             Specify a score threshold for the CI to pass
    --performance=<threshold>       Specify a minimal performance score for the CI to pass
    --pwa=<threshold>               Specify a minimal pwa score for the CI to pass
    --accessibility=<threshold>     Specify a minimal accessibility score for the CI to pass
    --best-practice=<threshold>     [DEPRECATED] Use best-practices instead
    --best-practices=<threshold>    Specify a minimal best-practice score for the CI to pass
    --seo=<threshold>               Specify a minimal seo score for the CI to pass
    --fail-on-budgets               Specify CI should fail if budgets are exceeded
    --budget.<counts|sizes>.<type>  Specify individual budget threshold (if --budget-path not set)

  In addition to listed "lighthouse-ci" configuration flags, it is also possible to pass any native "lighthouse" flag
  To see the full list of available flags, please refer to the official Google Lighthouse documentation at https://github.com/GoogleChrome/lighthouse#cli-options
`,
  {
    flags: {
      report: {
        type: 'string',
      },
      filename: {
        type: 'string',
        alias: 'f',
        default: 'report.html',
      },
      jsonReport: {
        type: 'boolean',
        alias: 'json',
        default: false,
      },
      silent: {
        type: 'boolean',
        alias: 's',
        default: false,
      },
      score: {
        type: 'string',
      },
      performance: {
        type: 'string',
      },
      pwa: {
        type: 'string',
      },
      accessibility: {
        type: 'string',
      },
      bestPractice: {
        type: 'string',
      },
      bestPractices: {
        type: 'string',
      },
      seo: {
        type: 'string',
      },
      failOnBudgets: {
        type: 'boolean',
        default: false,
      },
      budget: {
        type: 'string',
      },
    },
  },
);

const {
  report,
  filename,
  json,
  jsonReport,
  silent,
  s,
  score,
  performance,
  pwa,
  accessibility,
  bestPractice,
  bestPractices,
  seo,
  failOnBudgets,
  ...lighthouseFlags
} = cli.flags;

const calculatedBestPractices = bestPractice || bestPractices;
const flags = {
  report,
  filename,
  jsonReport: json || jsonReport,
  silent,
  s,
  score,
  performance,
  pwa,
  accessibility,
  ...(calculatedBestPractices && {
    'best-practices': calculatedBestPractices,
  }),
  seo,
  failOnBudgets,
};

async function init(args, chromeFlags) {
  const testUrl = args[0];

  // Run Google Lighthouse
  const { categoryReport, budgetsReport, htmlReport, jsonReport } = await lighthouseReporter(
    testUrl,
    flags,
    chromeFlags,
    lighthouseFlags,
  );
  const { silent } = flags;

  if (flags.report) {
    const outputPath = path.resolve(flags.report, flags.filename);
    await fs.writeFileSync(outputPath, htmlReport);

    if (flags.jsonReport && jsonReport) {
      const jsonReportPath = outputPath.replace(/\.[^.]+$/, '.json');
      await fs.writeFileSync(jsonReportPath, jsonReport);
    }
  }

  return {
    categoryReport,
    budgetsReport,
    silent,
  };
}

Promise.resolve()
  .then(() => {
    updateNotifier({ pkg }).notify();

    if (cli.input.length === 0) {
      return cli.showHelp();
    }

    spinner.text = `Running Lighthouse on ${cli.input} ...\n`;
    spinner.start();

    return init(cli.input, getChromeFlags());
  })
  .then(({ categoryReport, budgetsReport, silent }) => {
    spinner.stop();

    if (!silent) {
      for (const category in categoryReport) {
        if (typeof categoryReport[category] === 'undefined') {
          continue;
        }

        console.log(`${chalk.yellow(category)}: ${chalk.yellow(categoryReport[category])}`);
      }

      for (const budget in budgetsReport) {
        if (!budgetsReport[budget]) {
          continue;
        }

        if (budgetsReport[budget]) {
          console.log(`Budget '${chalk.yellow(budget)}' exceeded by ${chalk.yellow(budgetsReport[budget])}`);
        }
      }
    }

    return { categoryReport, budgetsReport };
  })
  .then(({ categoryReport, budgetsReport }) => {
    const result = calculateResults(flags, categoryReport, budgetsReport, failOnBudgets);

    if (result.passed) {
      console.log(chalk.green('\nAll checks are passing. 🎉\n'));
      return process.exit(0);
    }

    console.log(chalk.red('\nFailed. ❌'));

    if (result.score === false) {
      throw new Error('Target score not reached.');
    }

    if (result.budget === false) {
      throw new Error('Target budget not reached.');
    }

    throw new Error('lighthouse-ci test failed.');
  })
  .catch((error) => {
    spinner.stop();
    console.log(chalk.red(error), '\n');
    return process.exit(1);
  });
