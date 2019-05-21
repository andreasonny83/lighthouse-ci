/**
 *  Copyright (c) 2018 Alex Smagin <me@asmagin.com> (https://github.com/asmagin)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const chalk = require('chalk');

const analyzeAudit = (audit, threshold) => {
  switch (audit.scoreDisplayMode) {
    case 'numeric':
      return Number(audit.numericValue) <= Number(threshold);
    default:
      return !!audit.score === !!threshold;
  }
};

const analyzeAudits = (auditReport, thresholds, silent) => {
  let result = true;

  if (thresholds && Object.keys(thresholds).length !== 0) {
    if (!silent) {
      console.log('\n');
    }

    for (const audit in thresholds) {
      if (!Object.prototype.hasOwnProperty.call(thresholds, audit)) {
        continue;
      }

      if (
        !Object.prototype.hasOwnProperty.call(auditReport, audit) &&
        !silent
      ) {
        console.log(
          chalk.red(
            `⚠️ Audit "${audit}" was either not applicable or not found in the report`,
          ),
        );
        continue;
      }

      const passing = analyzeAudit(auditReport[audit], thresholds[audit]);

      if (!passing && !silent) {
        console.log(chalk.red(`❌ ${audit}: fail`));
      }

      result = result && passing;
    }

    if (!silent) {
      console.log(
        result ? chalk.green('Audits check passed ✔️') : chalk.red('Audits check failed ❌'),
      );
    }
  }

  return result;
};

module.exports = analyzeAudits;
