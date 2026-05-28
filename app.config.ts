import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'challenge-bitnovo',
  slug: 'challenge-bitnovo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'challengebitnovo',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
  },
  android: {
    package: 'com.maurorojas.challengebitnovo',
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      backgroundColor: '#035AC5',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    // Required for useAnimatedKeyboard() — in 'pan' mode the OS does not
    // resize the window; the keyboard height is tracked as an inset by
    // Reanimated and applied as animated paddingBottom. Do NOT change to
    // 'resize' or the footer will be double-padded.
    softwareKeyboardLayoutMode: 'pan',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#035AC5',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    wsUrl: process.env.EXPO_PUBLIC_WS_URL,
    deviceId: process.env.EXPO_PUBLIC_DEVICE_ID,
    eas: {
      projectId: '0a79550b-b8f3-459c-8b82-dbb70cffcfee',
    },
  },
  owner: 'maurorojas',
});
