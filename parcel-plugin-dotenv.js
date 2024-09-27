// parcel-plugin-dotenv.js
require('dotenv').config();

module.exports = (bundler) => {
  bundler.on('buildStart', () => {
    console.log('Environment variables loaded:', process.env);
  });
};