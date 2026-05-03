import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OTPIllustration, AuthButton } from '../../src/components/auth';
import { useAuthStore } from '../../src/stores/auth';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../src/theme/spacing';

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const params = useLocalSearchParams<{ phone?: string; name?: string; email?: string }>();
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { verifyOTP, sendOTP } = useAuthStore();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
    
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (i < OTP_LENGTH) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedOtp.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      return;
    }

    setIsLoading(true);
    try {
      const phone = params.phone ? `+91${params.phone.replace(/\D/g, '')}` : '';
      const result = await verifyOTP(phone, otpCode);
      if (result.success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    try {
      const phone = params.phone ? `+91${params.phone.replace(/\D/g, '')}` : '';
      await sendOTP(phone);
      setResendTimer(30);
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error(error);
    }
  };

  const maskedPhone = params.phone 
    ? `+91 ${params.phone.slice(0, 2)}****${params.phone.slice(-2)}`
    : '+91 ********';

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

        <View style={styles.content}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <OTPIllustration size={180} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            A {OTP_LENGTH} digit code has been sent to{'\n'}
            <Text style={styles.phoneNumber}>{maskedPhone}</Text>
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  focusedIndex === index && styles.otpInputFocused,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend */}
          <View style={styles.resendContainer}>
            {resendTimer > 0 ? (
              <Text style={styles.resendTimerText}>
                Resend code in <Text style={styles.timerValue}>{resendTimer}s</Text>
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <AuthButton
            title="Verify"
            onPress={handleVerify}
            loading={isLoading}
            disabled={otp.some((d) => !d)}
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing['2xl'],
  },
  phoneNumber: {
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 48,
    height: 54,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.secondary[200],
    fontSize: 22,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    color: colors.text.primary,
    backgroundColor: colors.secondary[50],
  },
  otpInputFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.white,
  },
  otpInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendTimerText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  timerValue: {
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
  resendLink: {
    fontSize: fontSize.base,
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
