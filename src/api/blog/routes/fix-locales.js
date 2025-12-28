module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/blogs/fix-locales',
      handler: 'fix-locales.fixLocales',
      config: {
        auth: false, // Temporary - remove after use
      },
    },
  ],
};
