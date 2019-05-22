const chalk = require('chalk');

const analyzeAudit = (audit, threshold) => {
  switch (audit.scoreDisplayMode) {
    case 'numeric':
      return audit.numericValue <= threshold;
    case 'informative':
      // if cannot be checked (NaN) - skip
      return isNaN(audit.numericValue) || audit.numericValue <= threshold;
    default:
      return audit.score === threshold;
  }
};

const analyzeAudits = (auditReport, thresholds, silent) => {
  let result = true;

  if (thresholds && Object.keys(thresholds).length) {
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
        console.log(chalk.red(`❌ ${audit} (${thresholds[audit]}): fail`));
      }

      result = result && passing;
    }

    if (!silent) {
      console.log(
        result
          ? chalk.green('Audits check passed ✔️')
          : chalk.red('Audits check failed ❌'),
      );
    }
  }

  return result;
};

module.exports = analyzeAudits;
