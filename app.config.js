const appConfig = require('./app.json');

module.exports = {
  ...appConfig,
  expo: {
    ...appConfig.expo,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://proestoque-api-production-83b9.up.railway.app/api",
    }
  }
};
