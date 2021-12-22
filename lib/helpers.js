/**
 *  Copyright (c) 2018-2021 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const clean = () =>
  new Promise((resolve, reject) => {
    rimraf('./lighthouse/', (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });

const createDir = () =>
  new Promise((resolve, reject) => {
    mkdirp('./lighthouse', (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });

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

const createDefaultConfig = (config) => {
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

const getOwnProps = (object) => {
  return Object.keys(object).filter((key) => Object.prototype.hasOwnProperty.call(object, key));
};

const convertToBudgetList = (object) => {
  return getOwnProps(object)
    .filter((key) => object[key])
    .reduce((acc, key) => {
      acc.push({
        resourceType: key,
        budget: object[key],
      });
      return acc;
    }, []);
};

const convertToResourceKey = (key) => 'resource' + key.charAt(0).toUpperCase() + key.slice(1);

module.exports = {
  clean,
  createDir,
  scoreReducer,
  createDefaultConfig,
  getOwnProps,
  convertToBudgetList,
  convertToResourceKey,
};
