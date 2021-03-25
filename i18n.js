module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  debug: true,
  pages: {
    '*': ['common', 'navigation'],
    '/': ['dashboard', 'signal', 'license', 'application', 'user'],
    'rgx:^/application': ['application', 'license'],
    'rgx:^/signal': ['signal', 'license'],
    'rgx:^/profile': ['profile', 'license'],
    'rgx:^/user': ['profile', 'license'],
    'rgx:^/compte': ['profile', 'license'],
    'rgx:^/license': ['license'],
    'rgx:^/price': ['license'],
  },
};
