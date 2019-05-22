/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const readFile = util.promisify(fs.readFile);

const launchChromeAndRunLighthouse = async (
  url,
  chromeFlags,
  lighthouseFlags,
  configPath,
) => {
  const chrome = await chromeLauncher.launch({
    chromeFlags,
  });
  const flags = {
    port: chrome.port,
    output: 'json',
    ...lighthouseFlags,
  };
  let config;

  if (flags.extraHeaders) {
    let extraHeadersStr = flags.extraHeaders;
    if (extraHeadersStr.substr(0, 1) !== '{') {
      extraHeadersStr = await readFile(extraHeadersStr, 'UTF-8');
    }

    flags.extraHeaders = JSON.parse(extraHeadersStr);
  }

  if (configPath) {
    try {
      const configJson = await readFile(path.resolve(configPath), 'UTF-8');
      config = JSON.parse(configJson);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  const result = await lighthouse(url, flags, config);
  await chrome.kill();

  return result;
};

const createReport = results => ReportGenerator.generateReportHtml(results);

async function writeReport(
  url,
  flags = {},
  defaultChromeFlags,
  lighthouseFlags,
) {
  const { chromeFlags, configPath, ...extraLHFlags } = lighthouseFlags;
  const customChromeFlags = chromeFlags ? chromeFlags.split(',') : [];

  const lighouseResult = await launchChromeAndRunLighthouse(
    url,
    [...defaultChromeFlags, ...customChromeFlags],
    extraLHFlags,
    configPath,
  );
  let htmlReport;

  if (flags.report) {
    htmlReport = await createReport(lighouseResult.lhr);
  }

  const categoryReport = {};

  for (const categoryName in lighouseResult.lhr.categories) {
    if (
      !Object.prototype.hasOwnProperty.call(
        lighouseResult.lhr.categories,
        categoryName,
      )
    ) {
      continue;
    }

    const category = lighouseResult.lhr.categories[categoryName];
    categoryReport[category.id] = Math.round(category.score * 100);
  }

  const auditReport = {};

  for (const auditName in lighouseResult.lhr.audits) {
    if (
      !Object.prototype.hasOwnProperty.call(
        lighouseResult.lhr.audits,
        auditName,
      )
    ) {
      continue;
    }

    const scoreDisplayMode =
      lighouseResult.lhr.audits[auditName].scoreDisplayMode;

    // filter out metrics that cannot be used for threshold validations
    if (scoreDisplayMode === 'notApplicable' || scoreDisplayMode === 'manual') {
      continue;
    }

    const {
      id,
      displayValue,
      numericValue,
      scoreDisplayMode,
      score,
      title,
    } = lighouseResult.lhr.audits[auditName];

    auditReport[id] = {
      id,
      displayValue,
      numericValue,
      scoreDisplayMode,
      score,
      title,
    };
  }

  return { categoryReport, auditReport, htmlReport };
}

module.exports = writeReport;
