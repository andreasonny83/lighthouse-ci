/**
 *  Copyright (c) 2018-2021 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function analyzeBudgets(budgetsReport, failOnBudgets) {
  if (!failOnBudgets) {
    return true;
  }

  const budgetLength = Object.keys(budgetsReport || {}).length;

  return budgetLength === 0;
}

module.exports = analyzeBudgets;
