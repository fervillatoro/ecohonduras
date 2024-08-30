import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.villatoro.ecohonduras',
  appName: 'Eco Honduras',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      backgroundColor: "#2C2C2C",
      // splashImmersive: true,
      // splashFullScreen: true,
      launchAutoHide: false
    },
  },
};

export default config;
