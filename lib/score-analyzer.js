/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const chalk = require('chalk');

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

function analyzeScore(categoryReport, thresholds, silent) {
  let result;

  if (thresholds && Object.keys(thresholds).length !== 0) {
    if (!silent) {
      console.log('\n');
    }

    if (!thresholds || thresholds.length === 0) {
      throw new Error('Invalid threshold score.');
    }

    if (typeof thresholds === 'object') {
      result = analyzeScores(thresholds, categoryReport);
    } else {
      result = analyzeTotalScore(thresholds, categoryReport);
    }

    if (!silent) {
      console.log(
        result ? chalk.green('Scores check passed ✔️') : chalk.red('Scores check failed ❌'),
      );
    }
  }

  return result;
}

module.exports = analyzeScore;
