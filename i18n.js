module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  debug: true,
  pages: {
    '*': ['common', 'navigation'],
    '/': ['dashboard', 'signal', 'license', 'application'],
    '/signin': ['signin', 'signup'],
    'rgx:^/application': ['application', 'license'],
    'rgx:^/signal': ['signal', 'license'],
    'rgx:^/profile': ['profile', 'license'],
    'rgx:^/license': ['license'],
  },
};
