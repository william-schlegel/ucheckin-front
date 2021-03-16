module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  debug: true,
  pages: {
    '*': ['common', 'navigation'],
    '/': ['dashboard', 'application', 'signal'],
    '/signin': ['signin', 'signup'],
    'rgx:^/application': ['application', 'license'],
    'rgx:^/signal': ['signal', 'license'],
    'rgx:^/profile': ['profile', 'application', 'license'],
  },
};
