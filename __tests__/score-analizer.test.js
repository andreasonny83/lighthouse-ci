/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const analizeScore = require('../lib/score-analizer');

describe('score-analizer', () => {
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

    expect(() => analizeScore(mockCategoryReport))
      .toThrowError('Invalid threshold score.');
  });

  it('should return false if one or more category index is below the ' +
    'threshold', () => {
    const threshold = 75;
    const mockCategoryReport = {
      performance: 7,
      pwa: 36,
      accessibility: 57,
      'best-practices': 69,
      seo: 73,
    };

    const result = analizeScore(mockCategoryReport, threshold);

    expect(result).toEqual(false);
  });

  it('should return true if all the category indexes are above the threshold',
    () => {
      const threshold = 70;
      const mockCategoryReport = {
        performance: 70,
        pwa: 90,
        accessibility: 87,
        'best-practices': 79,
        seo: 73,
      };

      const result = analizeScore(mockCategoryReport, threshold);

      expect(result).toEqual(true);
    });

  it('should return true if the target categories indexes are above ' +
    'the thresholds', () => {
    const threshold = {
      performance: 70,
      pwa: 80,
    };
    const mockCategoryReport = {
      performance: 70,
      pwa: 90,
      accessibility: 10,
      'best-practices': 10,
      seo: 10,
    };

    const result = analizeScore(mockCategoryReport, threshold);

    expect(result).toEqual(true);
  });

  it('should return false if one or more target category index is below ' +
    'the thresholds', () => {
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

    const result = analizeScore(mockCategoryReport, threshold);

    expect(result).toEqual(false);
  });
});
