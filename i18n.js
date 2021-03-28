module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  debug: true,
  pages: {
    '*': ['common', 'navigation'],
    '/': ['dashboard', 'signal', 'license', 'application', 'user', 'order'],
    'rgx:^/sdk': ['sdk'],
    'rgx:^/application': ['application', 'license'],
    'rgx:^/signal': ['signal', 'license'],
    'rgx:^/profile': ['user', 'license'],
    'rgx:^/account': ['user', 'license'],
    'rgx:^/user': ['user', 'license'],
    'rgx:^/compte': ['user', 'license'],
    'rgx:^/license': ['license'],
    'rgx:^/price': ['license'],
    'rgx:^/order': ['order'],
  },
};
