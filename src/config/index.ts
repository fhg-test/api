const config = {
  host: process.env.HOST ?? 'localhost',
  port: process.env.PORT ? +process.env.PORT : 5000,
  session: {
    name: process.env.SESSION_NAME ?? 'fhg-test.sid',
    secret: process.env.SESSION_SECRET ?? 'fhg-test',
    cookie: {
      maxAge: process.env.SESSION_COOKIE_MAX_AGE
        ? +process.env.SESSION_COOKIE_MAX_AGE
        : 24 * 60 * 60 * 1000, // 24 hours
    },
  },
};

export default config;
