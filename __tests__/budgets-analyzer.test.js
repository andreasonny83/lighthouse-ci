const analyzeBudgets = require('../lib/budgets-analyzer');

describe('budgets-analyzer', () => {
  const processExit = process.exit;

  beforeEach(() => {
    process.exit = jest.fn();
  });

  afterEach(() => {
    process.exit = processExit;
  });

  it('should return `false` if any over-budget reported and `--fail-on-budgets` set to `true`', () => {
    const mockBudgetsReport = {
      'total-count': '323 requests',
      'total-size': '12677kb',
    };

    const result = analyzeBudgets(mockBudgetsReport, true);

    expect(result).toEqual(false);
  });

  it('should return `true` if no over-budget reported and `--fail-on-budgets` set to `true`', () => {
    const mockBudgetsReport = {};

    const result = analyzeBudgets(mockBudgetsReport, true);

    expect(result).toEqual(true);
  });

  it('should return `true` if any over-budget reported and `--fail-on-budgets` set to `false`', () => {
    const mockBudgetsReport = {
      'total-count': '323 requests',
      'total-size': '12677kb',
    };

    const result = analyzeBudgets(mockBudgetsReport, true);

    expect(result).toEqual(false);
  });
});
