import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

// Keep the splash screen visible while we load fonts / assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Preload fonts or any async assets here, then hide splash
    async function prepare() {
      try {
        // Add any async pre-loading here (fonts, etc.)
        await Promise.resolve(); // placeholder — replace with actual font loading
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  return (
    <SafeAreaProvider>
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
          <Stack.Screen
            name="selectors/country"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
