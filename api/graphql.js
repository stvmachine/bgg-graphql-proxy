// This file is deprecated - use dist/handler.js instead
// The Vercel configuration now points to the built handler in dist/

const handler = require('../dist/handler.js').default;

module.exports = handler;
