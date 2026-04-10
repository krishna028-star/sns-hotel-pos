import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.snshotels.pos',
  appName: 'SNS Hotels POS',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // For live reload during development, uncomment and set your local IP:
    // url: 'http://192.168.1.10:3000',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0F172A',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#2E5AFF',
    },
  },
  android: {
    buildOptions: {
      keystorePath: '../release.keystore',
      keystoreAlias: 'sns-pos',
    },
    minWebViewVersion: 80,
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: true,
  },
};

export default config;
