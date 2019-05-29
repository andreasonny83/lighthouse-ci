function analyzeBudgets(budgetsReport, failOnBudgets) {
  if (!failOnBudgets) {
    return true;
  }

  for (const budget in budgetsReport) {
    // If at least one "over-budget" reported - fail.
    if (budget.includes('-size') || budget.includes('-count')) {
      return false;
    }
  }

  return true;
}

module.exports = analyzeBudgets;
