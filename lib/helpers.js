/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const clean = () =>
  new Promise((resolve, reject) =>
    rimraf('./lighthouse/', err => (err ? reject(err) : resolve())),
  );

const createDir = () =>
  new Promise((resolve, reject) =>
    mkdirp('./lighthouse', err => (err ? reject(err) : resolve())),
  );

const scoreReducer = (flags, scoreList) => {
  if (flags.score) {
    return flags.score;
  }

  return scoreList.reduce((scores, flag) => {
    if (Object.prototype.hasOwnProperty.call(flags, flag)) {
      const newKey = {};
      newKey[flag] = flags[flag];

      return Object.assign(
        {},
        {
          ...scores,
          ...newKey,
        },
      );
    }

    return scores;
  }, {});
};

module.exports = { clean, createDir, scoreReducer };
