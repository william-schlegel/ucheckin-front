module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'navigation'],
    '/': ['dashboard'],
    '/signin': ['signin', 'signup'],
    '/application': ['application'],
  },
};
