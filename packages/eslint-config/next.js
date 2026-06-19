/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require('./index'),
  extends: [
    ...require('./index').extends,
    'next/core-web-vitals',
  ],
  env: {
    ...require('./index').env,
    browser: true,
  },
};
