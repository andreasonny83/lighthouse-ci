/**
 *  Copyright (c) 2018-2020 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function analyzeBudgets (budgetsReport, failOnBudgets) {
  if (!failOnBudgets) {
    return true
  }

  for (const budget in budgetsReport) {
    return false
  }

  return true
}

module.exports = analyzeBudgets
