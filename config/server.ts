export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', [
      'cSHsGTm5yuGG2s3YSnedlw==',
      'JnAY+dyNZDTSwCGVdWGCQg==',
      'oeejoKsBFPAOTCMxxng6bQ==',
      'd5tLgrvTMhW2MC7P3nmHuQ=='
    ]),
  },
});