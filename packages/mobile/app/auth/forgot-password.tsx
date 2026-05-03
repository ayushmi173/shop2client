import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ForgotPasswordIllustration, AuthButton } from '../../src/components/auth';
import { useAuthStore } from '../../src/stores/auth';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight } from '../../src/theme/spacing';

export default function ForgotPasswordScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { sendOTP } = useAuthStore();

  const handleSubmit = async () => {
    if (!emailOrPhone.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // For phone-based reset, send OTP
      const phone = emailOrPhone.replace(/\D/g, '');
      if (phone.length === 10) {
        const result = await sendOTP(`+91${phone}`);
        if (result.success) {
          router.push({
            pathname: '/auth/otp',
            params: { phone: emailOrPhone, resetPassword: 'true' },
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Back button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <ForgotPasswordIllustration size={200} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Forgot{'\n'}Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! It happens. Please enter the address associated with your account.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Email/Phone Input */}
            <View style={[
              styles.inputContainer,
              focusedField === 'email' && styles.inputFocused,
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={focusedField === 'email' ? colors.primary[500] : colors.secondary[400]} 
              />
              <TextInput
                style={styles.textInput}
                placeholder="Email ID / Mobile number"
                placeholderTextColor={colors.secondary[400]}
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <AuthButton
            title="Submit"
            onPress={handleSubmit}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[200],
    gap: spacing.md,
  },
  inputFocused: {
    borderBottomColor: colors.primary[500],
  },
  textInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
