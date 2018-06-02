const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const clean = () => new Promise((resolve, reject) =>
  rimraf('./lighthouse/', err => err ? reject(err) : resolve()));

const createDir = () => new Promise((resolve, reject) =>
  mkdirp('./lighthouse', err => err ? reject(err) : resolve()));

module.exports = {clean, createDir};
