const { join } = require('path');
const fs = require('fs');
const { codechecks } = require('@codechecks/client');
const { dir } = require('tmp-promise');
const table = require('markdown-table');

const lighthouseReporter = require('../lib/lighthouse-reporter');
const { getChromeFlags } = require('../lib/config');

const ARTIFACT_ROOT = 'lighthouse-ci';

module.exports = async options => {
  const lighthouseReport = await lighthouseReporter(options.url, { report: true }, getChromeFlags(), {});

  const metrics = lighthouseReport.categoryReport;
  const { htmlReport } = lighthouseReport;

  codechecks.saveValue(`${ARTIFACT_ROOT}/metrics.json`, metrics);
  const reportLink = await uploadHtmlReport(htmlReport);

  if (!codechecks.isPr()) {
    return;
  }

  const baseBranchArtifact = await codechecks.getValue(`${ARTIFACT_ROOT}/metrics.json`);

  const artifactComparison = compareArtifacts(baseBranchArtifact, metrics);

  await codechecks.success({
    name: 'Lighthouse CI',
    shortDescription: getShortDescription(artifactComparison, baseBranchArtifact),
    longDescription: getLongDescription(artifactComparison),
    detailsUrl: reportLink,
  });
};

async function uploadHtmlReport(htmlReport) {
  const { path: randomDir } = await dir();
  const outputPath = join(randomDir, 'lighthouse-report.html');

  fs.writeFileSync(outputPath, htmlReport);
  await codechecks.saveFile(`${ARTIFACT_ROOT}/report.html`, outputPath);

  return codechecks.getArtifactLink(`${ARTIFACT_ROOT}/report.html`);
}

function compareArtifacts(base = {}, head) {
  function diffFor(key, name) {
    if (!head[key]) {
      return undefined;
    }

    return {
      name,
      value: head[key],
      diff: head[key] - (base[key] || 0),
    };
  }

  return [
    diffFor('performance', 'Performance'),
    diffFor('accessibility', 'Accessibility'),
    diffFor('best-practices', 'Best practices'),
    diffFor('seo', 'SEO'),
    diffFor('pwa', 'PWA'),
  ].filter(d => Boolean(d));
}

function getShortDescription(artifactComparison, base) {
  if (!base) {
    return 'New Lighthouse report generated!';
  }

  const decreased = artifactComparison.filter(c => c.diff < 0).length;
  const increased = artifactComparison.filter(c => c.diff > 0).length;

  if (decreased > 0) {
    return `${decreased} metrics decreased, be careful!`;
  }

  if (increased > 0) {
    return `${increased} metrics got better, good job!`;
  }

  return `No changes in metrics detected!`;
}

function getLongDescription(artifactComparison) {
  // prettier-ignore
  const rows = [
    ['Name', 'Status', 'Score'],
    ...artifactComparison.map(a => [a.name, `${getIcon(a.diff)} ${diffWithSign(a.diff)}`, a.value])
  ]

  return table(rows) + '\n';
}

function getIcon(diff) {
  if (diff > 0) {
    return '✅';
  }

  if (diff < 0) {
    return '🔴';
  }

  return '';
}

function diffWithSign(value) {
  if (value > 0) {
    return `+${value}`;
  }

  if (value < 0) {
    return value.toString();
  }

  return '-';
}
