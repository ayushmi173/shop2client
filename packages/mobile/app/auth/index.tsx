import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';

// This is the auth index - redirects to login by default
export default function AuthIndex() {
  useEffect(() => {
    // Redirect to login screen
    router.replace('/auth/login');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
