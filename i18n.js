module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  debug: true,
  pages: {
    '*': ['common', 'navigation'],
    '/': ['dashboard'],
    '/signin': ['signin', 'signup'],
    'rgx:^/application': ['application'],
    'rgx:^/signal': ['signal'],
    'rgx:^/profile': ['profile', 'application'],
  },
};
