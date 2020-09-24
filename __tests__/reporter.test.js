const writeReport = require('../lib/lighthouse-reporter');

describe('Reporter', () => {
  it('should launch Chrome and generate a report', async () => {
    jest.setTimeout(60000); // Allows more time to run all tests
    const result = await writeReport('http://www.google.com', { chromiumFallback: true });
    expect(result).toEqual(
      expect.objectContaining({
        categoryReport: {
          performance: expect.any(Number),
          accessibility: expect.any(Number),
          'best-practices': expect.any(Number),
          seo: expect.any(Number),
          pwa: expect.any(Number),
        },
        budgetsReport: expect.any(Object),
        htmlReport: expect.any(Object),
        jsonReport: expect.any(Object),
      }),
    );
  });
});
