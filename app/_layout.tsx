import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import {
  useFonts,
  Mulish_400Regular,
  Mulish_600SemiBold,
  Mulish_700Bold,
} from '@expo-google-fonts/mulish';
import { theme } from '@/theme';

// Keep the splash screen visible while we load fonts / assets
SplashScreen.preventAutoHideAsync();

// Paint the JS root view with the app background colour before the first
// React frame renders — prevents the white flash between splash fade-out
// and CreatePayment appearing.
SystemUI.setBackgroundColorAsync(theme.colors.background);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Mulish_400Regular,
    Mulish_600SemiBold,
    Mulish_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {/* dark = dark icons (time, battery) visible on the light app background.
          translucent is the default with edgeToEdgeEnabled: true — no extra prop needed. */}
      <StatusBar style="dark" />
      <GestureHandlerRootView style={styles.root}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="share/[id]" />
          <Stack.Screen name="qr/[id]" />
          <Stack.Screen name="success" />
          <Stack.Screen name="selectors/fiat" />
          <Stack.Screen name="selectors/country" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
