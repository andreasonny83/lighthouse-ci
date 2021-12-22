/**
 *  Copyright (c) 2018-2021 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const analyzeScore = require('../lib/score-analyzer.js');

describe('score-analyzer', () => {
  const processExit = process.exit;

  beforeEach(() => {
    process.exit = jest.fn();
  });

  afterEach(() => {
    process.exit = processExit;
  });

  it('a threshold must be specified', () => {
    const mockCategoryReport = {
      performance: 0.07,
      pwa: 0.36,
      accessibility: 0.57,
      'best-practices': 0.69,
      seo: 0.73,
    };

    expect(() => analyzeScore(mockCategoryReport)).toThrowError('Invalid threshold score.');
  });

  it('should return `false` if one or more category index is below the threshold', () => {
    const threshold = 75;
    const mockCategoryReport = {
      performance: 7,
      pwa: 36,
      accessibility: 57,
      'best-practices': 69,
      seo: 73,
    };

    const result = analyzeScore(mockCategoryReport, threshold);

    expect(result).toEqual(false);
  });

  it('should return `true` if all the category indexes are above the threshold', () => {
    const threshold = 70;
    const mockCategoryReport = {
      performance: 70,
      pwa: 90,
      accessibility: 87,
      'best-practices': 79,
      seo: 73,
    };

    const result = analyzeScore(mockCategoryReport, threshold);

    expect(result).toEqual(true);
  });

  describe('category thresholds', () => {
    const mockCategoryReport = {
      performance: 70,
      pwa: 90,
      accessibility: 10,
      'best-practices': 10,
      seo: 10,
    };

    it('should return `true` if the target categories indexes are above the thresholds', () => {
      const threshold = {
        performance: 70,
        pwa: 80,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(true);
    });

    it('should pass if the target categories indexes are above the "best-practices" thresholds', () => {
      const threshold = {
        'best-practices': 10,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(true);
    });

    it('should pass if the target categories indexes are above the "seo" thresholds', () => {
      const threshold = {
        seo: 10,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(true);
    });

    it('should pass if the target categories indexes are above the "performance" thresholds', () => {
      const threshold = {
        performance: 70,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(true);
    });

    it('should pass if the target categories indexes are above the "pwa" thresholds', () => {
      const threshold = {
        pwa: 90,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(true);
    });

    it('should pass if the target categories indexes are above the "accessibility" thresholds', () => {
      const threshold = {
        accessibility: 10,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(true);
    });

    it('should fail if the target categories indexes are above the "best-practices" thresholds', () => {
      const threshold = {
        'best-practices': 11,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(false);
    });

    it('should fail if the target categories indexes are above the "seo" thresholds', () => {
      const threshold = {
        seo: 11,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(false);
    });

    it('should fail if the target categories indexes are above the "performance" thresholds', () => {
      const threshold = {
        performance: 71,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(false);
    });

    it('should fail if the target categories indexes are above the "pwa" thresholds', () => {
      const threshold = {
        pwa: 91,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(false);
    });

    it('should fail if the target categories indexes are above the "accessibility" thresholds', () => {
      const threshold = {
        accessibility: 11,
      };

      const result = analyzeScore(mockCategoryReport, threshold);

      expect(result).toEqual(false);
    });
  });

  it('should return `false` if one or more target category index is below the thresholds', () => {
    const threshold = {
      performance: 70,
      pwa: 80,
    };
    const mockCategoryReport = {
      performance: 70,
      pwa: 79,
      accessibility: 10,
      'best-practices': 10,
      seo: 10,
    };

    const result = analyzeScore(mockCategoryReport, threshold);

    expect(result).toEqual(false);
  });
});
