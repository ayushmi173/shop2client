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
import { LoginIllustration, AuthButton } from '../../src/components/auth';
import { useAuthStore } from '../../src/stores/auth';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../src/theme/spacing';

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { sendOTP } = useAuthStore();

  const handleLogin = async () => {
    if (!emailOrPhone.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // For phone-based login, send OTP
      const phone = emailOrPhone.replace(/\D/g, '');
      if (phone.length === 10) {
        const result = await sendOTP(`+91${phone}`);
        if (result.success) {
          router.push({
            pathname: '/auth/otp',
            params: { phone: emailOrPhone },
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
            <LoginIllustration size={220} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Login</Text>

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
                placeholder="Email ID"
                placeholderTextColor={colors.secondary[400]}
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={[
              styles.inputContainer,
              focusedField === 'password' && styles.inputFocused,
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={focusedField === 'password' ? colors.primary[500] : colors.secondary[400]} 
              />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor={colors.secondary[400]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={colors.secondary[400]} 
                />
              </Pressable>
            </View>

            {/* Forgot Password Link */}
            <Pressable 
              style={styles.forgotPasswordContainer}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
          </View>

          {/* Login Button */}
          <View style={styles.loginButtonContainer}>
            <AuthButton
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login */}
          <Pressable style={styles.googleButton}>
            <Ionicons name="logo-google" size={20} color={colors.text.primary} />
            <Text style={styles.googleButtonText}>Login with Google</Text>
          </Pressable>
        </ScrollView>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <View style={styles.registerPrompt}>
            <Text style={styles.registerText}>New to LocalConnect? </Text>
            <Pressable onPress={() => router.push('/auth/signup')}>
              <Text style={styles.registerLink}>Register</Text>
            </Pressable>
          </View>
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  forgotPasswordText: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
  },
  loginButtonContainer: {
    marginTop: spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.secondary[200],
  },
  dividerText: {
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    fontWeight: fontWeight.medium,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.secondary[200],
    backgroundColor: colors.white,
  },
  googleButtonText: {
    fontSize: fontSize.base,
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  registerLink: {
    fontSize: fontSize.base,
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
});
