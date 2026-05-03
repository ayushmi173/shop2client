import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/stores/auth';
import { colors } from '../src/theme/colors';

// Prevent splash screen from auto-hiding (only on native)
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  const { initialize } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initialize();
      } catch (e) {
        console.error('Init error:', e);
      } finally {
        setIsReady(true);
        if (Platform.OS !== 'web') {
          try {
            await SplashScreen.hideAsync();
          } catch {}
        }
      }
    }
    
    // Add a small delay for web to ensure window is available
    if (Platform.OS === 'web') {
      setTimeout(init, 100);
    } else {
      init();
    }
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background.secondary,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="worker/[id]"
          options={{
            title: 'Worker Profile',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="worker/register"
          options={{
            title: 'Become a Worker',
            headerBackTitle: 'Back',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
