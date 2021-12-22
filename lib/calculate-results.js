/**
 *  Copyright (c) 2018-2021 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { scoreReducer } = require('./helpers.js');
const analyzeScore = require('./score-analyzer.js');
const analyzeBudgets = require('./budgets-analyzer.js');
const { getScores } = require('./config.js');

const calculateResults = (flags, categoryReport, budgetsReport, failOnBudgets) => {
  let thresholds = scoreReducer(flags, getScores());
  thresholds =
    Object.keys(thresholds).length === 0
      ? {
          score: 100,
        }
      : thresholds;

  if (thresholds && Object.keys(thresholds).length > 0) {
    const isScorePassing = analyzeScore(categoryReport, thresholds);
    const areBudgetsPassing = analyzeBudgets(budgetsReport, failOnBudgets);

    if (isScorePassing && areBudgetsPassing) {
      return {
        passed: true,
      };
    }

    return {
      passed: false,
      score: isScorePassing,
      budget: areBudgetsPassing,
    };
  }

  return {
    passed: false,
  };
};

module.exports = {
  calculateResults,
};
