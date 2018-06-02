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

const launchChromeAndRunLighthouse = async (url, chromeFlags, flags = {}, config = null) => {
  const chrome = await chromeLauncher.launch({chromeFlags});
  flags.port = chrome.port;

  const result = await lighthouse(url, flags, config);
  await chrome.kill();

  return result;
};

const createReport = results =>
  ReportGenerator.generateReportHtml(results);

const clean = () => new Promise((resolve, reject) =>
  rimraf('./lighthouse/', err => err ? reject() : resolve()));

module.exports = async (url, flags, chromeFlags) => {
  await clean();

  const lighouseResult = await launchChromeAndRunLighthouse(url, chromeFlags, flags);

  await mkdirp('./lighthouse');

  const extension = 'html';
  const report = await createReport(lighouseResult);
  const outputPath = path.resolve('lighthouse', `report.${extension}`);

  await fs.writeFileSync(outputPath, report);

  const categoryReport = {};

  for (const categoryName of lighouseResult.lhr.categories) {
    const category = lighouseResult.lhr.categories[categoryName];

    categoryReport[category.id] = category.score;
  }

  return categoryReport;
};
