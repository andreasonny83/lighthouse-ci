/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const launchChromeAndRunLighthouse = async(url, chromeFlags, flags = {}, config = null) => {
  const chrome = await chromeLauncher.launch({ chromeFlags });
  flags.port = chrome.port;

  console.log(`Running Lighthouse against ${url}\nThis may take a while.`);

  const result = await lighthouse(url, flags, config);
  await chrome.kill();

  return result;
}

const createReport = results =>
  ReportGenerator.generateReportHtml(results);

const clean = () => new Promise((resolve, reject) =>
    rimraf('./lighthouse/', err => err ? reject() : resolve()));

module.exports = async(url, flags, chromeFlags) => {
  await clean();

  const lighouseResult = await launchChromeAndRunLighthouse(url, chromeFlags, flags);

  await mkdirp('./lighthouse');

  const resolvedPath = path.join(__dirname, 'reports');
  const extension = 'html';
  const report = await createReport(lighouseResult);
  const outputPath = path.resolve('lighthouse', `report.${extension}`);

  console.log('preparing to write the report');

  await fs.writeFileSync(outputPath, report);

  console.log(`report written to ${outputPath}`);

  const categoryReport = {};

  for (let categoryName in lighouseResult.lhr.categories) {
    const category = lighouseResult.lhr.categories[categoryName];

    categoryReport[category.id] = category.score;
  }

  return categoryReport;
};
