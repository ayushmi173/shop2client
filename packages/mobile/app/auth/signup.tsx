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
import { SignUpIllustration, AuthButton } from '../../src/components/auth';
import { useAuthStore } from '../../src/stores/auth';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight } from '../../src/theme/spacing';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { sendOTP } = useAuthStore();

  const handleContinue = async () => {
    if (!mobile.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOTP(`+91${mobile.replace(/\D/g, '')}`);
      if (result.success) {
        router.push({
          pathname: '/auth/otp',
          params: { phone: mobile, name: fullName, email },
        });
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
            <SignUpIllustration size={220} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Sign up</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
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
                placeholder="alex.pinto@gmail.com"
                placeholderTextColor={colors.secondary[400]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Full Name Input */}
            <View style={[
              styles.inputContainer,
              focusedField === 'name' && styles.inputFocused,
            ]}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={focusedField === 'name' ? colors.primary[500] : colors.secondary[400]} 
              />
              <TextInput
                style={styles.textInput}
                placeholder="Full name"
                placeholderTextColor={colors.secondary[400]}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="words"
              />
            </View>

            {/* Mobile Input */}
            <View style={[
              styles.inputContainer,
              focusedField === 'mobile' && styles.inputFocused,
            ]}>
              <Ionicons 
                name="call-outline" 
                size={20} 
                color={focusedField === 'mobile' ? colors.primary[500] : colors.secondary[400]} 
              />
              <TextInput
                style={styles.textInput}
                placeholder="Mobile"
                placeholderTextColor={colors.secondary[400]}
                value={mobile}
                onChangeText={setMobile}
                onFocus={() => setFocusedField('mobile')}
                onBlur={() => setFocusedField(null)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By signing up, you're agree to our{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text>
              {'\n'}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <AuthButton
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Joined us before? </Text>
            <Pressable onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Login</Text>
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
  termsText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  termsLink: {
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: fontSize.base,
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
});
