const scores = ['performance', 'pwa', 'accessibility', 'bestPractice', 'seo'];
const chromeFlags = [
  '--disable-gpu',
  '--headless',
  '--no-zygote',
  '--no-sandbox',
  '--single-process',
];

const getScores = () => scores;
const getChromeFlags = () => chromeFlags;

module.exports = {getScores, getChromeFlags};
