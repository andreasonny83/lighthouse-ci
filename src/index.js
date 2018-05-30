const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const lighthouse = require('lighthouse');
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator');

const chromeFlags = [
  '--disable-gpu',
  '--headless',
  '--no-zygote',
  '--no-sandbox',
  '--single-process'
];

const config = { output: 'json' };

const launchChromeAndRunLighthouse = async(url, flags = {}, config = null) => {
  const chrome = await chromeLauncher.launch({ chromeFlags });
  flags.port = chrome.port;

  console.log(`Running Lighthouse against ${url}\nThis may take a while.`);

  const result = await lighthouse(url, flags, config);
  await chrome.kill();

  return result;
}

const createReport = results =>
  new ReportGenerator().generateReportHtml(results);

const clean = () => new Promise((resolve, reject) =>
    rimraf('./lighthouse/', (err) => {
      if (err) {
        return reject();
      }

      return resolve();
    }));

const writeReport = async(url) => {
  await clean();

  const lighouseResult = await launchChromeAndRunLighthouse(url, config);

  const resolvedPath = path.join(__dirname, 'reports');
  const extension = 'html';
  const report = createReport(lighouseResult);
  const outputPath = path.resolve('lighthouse', `report.${extension}`);

  await mkdirp('./lighthouse');

  fs.writeFile(outputPath, report, (err) => {
    if (err) {
      console.warn('Ops! Something went wrong.');
    }

    console.log(`report written to ${outputPath}`);
  });
};

const args = process.argv.slice(2);
const argv = minimist(args, {
  boolean: ['comment', 'help'],
  default: {comment: true},
  alias: {help: 'h'}
});
const testUrl = argv._[0];

writeReport(testUrl);