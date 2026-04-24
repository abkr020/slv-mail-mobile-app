export const CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL!,
  AUTH_URL: process.env.EXPO_PUBLIC_API_AUTH_URL!,
  MODE: __DEV__ ? "dev" : "prod", // ✅ dynamic
};