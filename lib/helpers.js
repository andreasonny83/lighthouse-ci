/**
 *  Copyright (c) 2018-2019 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const clean = () =>
  new Promise((resolve, reject) => {
    rimraf('./lighthouse/', err => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });

const createDir = () =>
  new Promise((resolve, reject) => mkdirp('./lighthouse', err => (err ? reject(err) : resolve())));

const scoreReducer = (flags, scoreList) => {
  if (flags.score) {
    return flags.score;
  }

  return scoreList.reduce((scores, flag) => {
    if (!Object.prototype.hasOwnProperty.call(flags, flag)) {
      return scores;
    }

    return {
      ...scores,
      [flag]: flags[flag],
    };
  }, {});
};

const createDefaultConfig = config => {
  if (!config) {
    config = {
      extends: 'lighthouse:default',
      settings: {},
    };
  }

  if (!config.settings) {
    config.settings = {};
  }

  return config;
};

const getOwnProps = obj => {
  return Object.keys(obj).filter(key => Object.prototype.hasOwnProperty.call(obj, key));
};

const convertToBudgetList = obj => {
  return getOwnProps(obj)
    .filter(key => obj[key])
    .reduce((acc, key) => {
      acc.push({
        resourceType: key,
        budget: obj[key],
      });
      return acc;
    }, []);
};
const checkFlagsForPlugins = obj => {
  if (obj['plugins']) {
    obj.plugins = [obj.plugins]
  }
  return obj
}

const convertToResourceKey = key => 'resource' + key.charAt(0).toUpperCase() + key.slice(1);

module.exports = {
  clean,
  createDir,
  scoreReducer,
  createDefaultConfig,
  getOwnProps,
  convertToBudgetList,
  convertToResourceKey,
  checkFlagsForPlugins
};
