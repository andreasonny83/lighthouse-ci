/**
 *  Copyright (c) 2018-2021 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function analyzeScores(thresholds, categoryReport) {
  for (const category in categoryReport) {
    if (!Object.prototype.hasOwnProperty.call(thresholds, category)) {
      continue;
    }

    if (Number(categoryReport[category]) < Number(thresholds[category])) {
      return false;
    }
  }

  return true;
}

function analyzeTotalScore(threshold, categoryReport) {
  for (const category in categoryReport) {
    if (Number(categoryReport[category]) < Number(threshold)) {
      return false;
    }
  }

  return true;
}

function analyzeScore(categoryReport, thresholds) {
  if (!thresholds || thresholds.length === 0) {
    throw new Error('Invalid threshold score.');
  }

  return typeof thresholds === 'object'
    ? analyzeScores(thresholds, categoryReport)
    : analyzeTotalScore(thresholds, categoryReport);
}

module.exports = analyzeScore;
