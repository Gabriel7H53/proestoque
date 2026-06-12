const appConfig = require('./app.json');

module.exports = {
  ...appConfig,
  expo: {
    ...appConfig.expo,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333/api",
    }
  }
};
