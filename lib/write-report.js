/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const launchChromeAndRunLighthouse = async (url, chromeFlags, config = null) => {
  const chrome = await chromeLauncher.launch({chromeFlags});
  const flags = {
    port: chrome.port,
    output: 'json',
  };

  const result = await lighthouse(url, flags, config);
  await chrome.kill();

  return result;
};

const createReport = results =>
  ReportGenerator.generateReportHtml(results);

async function writeReport(url, flags = {}, chromeFlags) {
  const lighouseResult = await launchChromeAndRunLighthouse(url, chromeFlags);
  let htmlReport;

  if (flags.report) {
    htmlReport = await createReport(lighouseResult);
  }

  const categoryReport = {};

  for (const categoryName in lighouseResult.lhr.categories) {
    if (!Object.prototype.hasOwnProperty.call(lighouseResult.lhr.categories, categoryName)) {
      continue;
    }

    const category = lighouseResult.lhr.categories[categoryName];
    categoryReport[category.id] = category.score;
  }

  return {categoryReport, htmlReport};
}

module.exports = writeReport;
