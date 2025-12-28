export default {
  routes: [
    {
      method: 'GET',
      path: '/blogs/fix-locales',
      handler: 'blog.fixLocales',
      config: {
        auth: false,
      },
    },
  ],
};
