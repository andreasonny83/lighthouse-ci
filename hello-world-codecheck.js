const { codechecks } = require('@codechecks/client');

module.exports = () => {
  codechecks.success({
    name: 'Hello world!',
    shortDescription: 'It works!',
  });
};
