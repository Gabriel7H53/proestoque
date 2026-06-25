const appConfig = require('./app.json');

module.exports = {
  ...appConfig,
  expo: {
    ...appConfig.expo,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://proestoque-api-production-83b9.up.railway.app/api",
      eas: {
        projectId: "3b5174db-d890-4123-9397-ea255f151d06"
      }
    }
  }
};
