/**
 *  Copyright (c) 2018 AndreaSonny <andreasonny83@gmail.com> (https://github.com/andreasonny83)
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const scores = ['performance', 'pwa', 'accessibility', 'bestPractice', 'seo'];
const chromeFlags = [
  '--disable-gpu',
  '--headless',
  '--no-zygote',
  '--no-sandbox',
];

const getScores = () => scores;
const getChromeFlags = () => chromeFlags;

module.exports = {getScores, getChromeFlags};
