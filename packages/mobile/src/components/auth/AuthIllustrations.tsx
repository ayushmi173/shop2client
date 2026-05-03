import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface IllustrationProps {
  size?: number;
}

// Floating geometric shapes for decoration
const GeometricShapes = ({ style }: { style?: any }) => {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(float1, { toValue: -8, duration: 2000, useNativeDriver: true }),
          Animated.timing(float1, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(float2, { toValue: 8, duration: 2500, useNativeDriver: true }),
          Animated.timing(float2, { toValue: 0, duration: 2500, useNativeDriver: true }),
        ]),
        Animated.timing(rotate, { toValue: 1, duration: 8000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.shapesContainer, style]}>
      <Animated.View 
        style={[
          styles.shape, 
          styles.circle, 
          { transform: [{ translateY: float1 }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.shape, 
          styles.square, 
          { transform: [{ translateY: float2 }, { rotate: spin }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.shape, 
          styles.triangle,
          { transform: [{ translateY: float1 }] }
        ]} 
      />
    </View>
  );
};

// Sign Up Illustration - Two people handshake
export const SignUpIllustration: React.FC<IllustrationProps> = ({ size = 200 }) => {
  const scale = size / 200;
  
  return (
    <View style={[styles.illustrationContainer, { height: size }]}>
      <GeometricShapes style={styles.shapesLeft} />
      
      {/* Main illustration circle */}
      <View style={[styles.mainCircle, { transform: [{ scale }] }]}>
        <View style={styles.personLeft}>
          <View style={[styles.personHead, { backgroundColor: '#FFD4A3' }]} />
          <View style={[styles.personBody, { backgroundColor: colors.primary[500] }]} />
          <View style={styles.personArm} />
        </View>
        
        <View style={styles.handshake}>
          <Ionicons name="hand-right" size={24} color={colors.primary[600]} />
        </View>
        
        <View style={styles.personRight}>
          <View style={[styles.personHead, { backgroundColor: '#C4A77D' }]} />
          <View style={[styles.personBody, { backgroundColor: '#2DD4BF' }]} />
          <View style={styles.personBag} />
        </View>
      </View>
      
      <GeometricShapes style={styles.shapesRight} />
    </View>
  );
};

// Login Illustration - Person with plant
export const LoginIllustration: React.FC<IllustrationProps> = ({ size = 200 }) => {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -6, duration: 2000, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.illustrationContainer, { height: size }]}>
      <GeometricShapes style={styles.shapesLeft} />
      
      <Animated.View style={[styles.loginMain, { transform: [{ translateY: float }] }]}>
        <View style={styles.personContainer}>
          {/* Person */}
          <View style={styles.loginPerson}>
            <View style={[styles.personHead, styles.loginHead]} />
            <View style={[styles.personBody, styles.loginBody]} />
          </View>
          
          {/* Plant box */}
          <View style={styles.plantBox}>
            <View style={styles.plant}>
              <Ionicons name="leaf" size={20} color="#22C55E" />
            </View>
            <View style={styles.pot} />
          </View>
          
          {/* Watering can */}
          <View style={styles.wateringCan}>
            <Ionicons name="water" size={16} color={colors.primary[400]} />
          </View>
        </View>
      </Animated.View>
      
      <GeometricShapes style={styles.shapesRight} />
    </View>
  );
};

// OTP Illustration - Phone with code
export const OTPIllustration: React.FC<IllustrationProps> = ({ size = 180 }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.illustrationContainer, { height: size }]}>
      <View style={styles.otpContainer}>
        {/* Phone */}
        <View style={styles.phone}>
          <View style={styles.phoneScreen}>
            <View style={styles.otpDots}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Animated.View 
                  key={i} 
                  style={[
                    styles.otpDot, 
                    { transform: [{ scale: pulse }] }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>
        
        {/* Decorative elements */}
        <View style={styles.otpDecoLeft}>
          <Ionicons name="sparkles" size={20} color={colors.primary[400]} />
        </View>
        <View style={styles.otpDecoRight}>
          <Ionicons name="mail" size={24} color={colors.warning[500]} />
        </View>
      </View>
    </View>
  );
};

// Forgot Password Illustration - Person thinking
export const ForgotPasswordIllustration: React.FC<IllustrationProps> = ({ size = 200 }) => {
  const float = useRef(new Animated.Value(0)).current;
  const lockBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(float, { toValue: -5, duration: 2000, useNativeDriver: true }),
          Animated.timing(float, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(lockBounce, { toValue: -10, duration: 1500, useNativeDriver: true }),
          Animated.timing(lockBounce, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.illustrationContainer, { height: size }]}>
      <Animated.View style={[styles.forgotMain, { transform: [{ translateY: float }] }]}>
        {/* Person thinking */}
        <View style={styles.thinkingPerson}>
          <View style={styles.thinkingHead}>
            <View style={styles.hair} />
            <View style={styles.face} />
          </View>
          <View style={styles.thinkingBody} />
          <View style={styles.thinkingArm} />
        </View>
        
        {/* Lock icons floating */}
        <Animated.View style={[styles.lockFloat, styles.lockFloat1, { transform: [{ translateY: lockBounce }] }]}>
          <Ionicons name="lock-closed" size={28} color={colors.warning[500]} />
        </Animated.View>
        <Animated.View style={[styles.lockFloat, styles.lockFloat2, { transform: [{ translateY: lockBounce }] }]}>
          <View style={styles.lockBadge}>
            <Ionicons name="alert" size={12} color={colors.white} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// Reset Password Illustration - Lock
export const ResetPasswordIllustration: React.FC<IllustrationProps> = ({ size = 160 }) => {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, { toValue: 0.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: -0.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <View style={[styles.illustrationContainer, { height: size }]}>
      <Animated.View style={[styles.resetLock, { transform: [{ rotate: spin }] }]}>
        <View style={styles.lockCircle}>
          <Ionicons name="lock-open" size={40} color={colors.warning[500]} />
        </View>
        <View style={styles.lockShine} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shapesContainer: {
    position: 'absolute',
    width: 60,
    height: 100,
  },
  shapesLeft: {
    left: 20,
    top: 20,
  },
  shapesRight: {
    right: 20,
    bottom: 20,
  },
  shape: {
    position: 'absolute',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[200],
    top: 0,
    left: 10,
  },
  square: {
    width: 16,
    height: 16,
    backgroundColor: colors.warning[100],
    borderWidth: 2,
    borderColor: colors.warning[400],
    top: 40,
    left: 0,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.error[200],
    top: 70,
    left: 20,
  },
  
  // Sign Up styles
  mainCircle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  personLeft: {
    alignItems: 'center',
  },
  personRight: {
    alignItems: 'center',
  },
  personHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  personBody: {
    width: 40,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  personArm: {
    position: 'absolute',
    right: -10,
    top: 45,
    width: 20,
    height: 8,
    backgroundColor: colors.primary[400],
    borderRadius: 4,
  },
  personBag: {
    position: 'absolute',
    left: -8,
    bottom: 10,
    width: 16,
    height: 24,
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  handshake: {
    marginBottom: 30,
  },
  
  // Login styles
  loginMain: {
    alignItems: 'center',
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  loginPerson: {
    alignItems: 'center',
  },
  loginHead: {
    backgroundColor: '#FFD4A3',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  loginBody: {
    backgroundColor: colors.primary[500],
    width: 50,
    height: 70,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  plantBox: {
    alignItems: 'center',
  },
  plant: {
    marginBottom: 4,
  },
  pot: {
    width: 40,
    height: 30,
    backgroundColor: '#D4A574',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  wateringCan: {
    position: 'absolute',
    top: 20,
    right: -20,
  },
  
  // OTP styles
  otpContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  phone: {
    width: 100,
    height: 160,
    backgroundColor: colors.secondary[800],
    borderRadius: 16,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      },
    }),
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDots: {
    flexDirection: 'row',
    gap: 6,
  },
  otpDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[500],
  },
  otpDecoLeft: {
    position: 'absolute',
    left: -30,
    top: 20,
  },
  otpDecoRight: {
    position: 'absolute',
    right: -30,
    bottom: 40,
  },
  
  // Forgot Password styles
  forgotMain: {
    alignItems: 'center',
    position: 'relative',
  },
  thinkingPerson: {
    alignItems: 'center',
  },
  thinkingHead: {
    width: 50,
    height: 50,
    position: 'relative',
  },
  hair: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 30,
    backgroundColor: colors.secondary[800],
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  face: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: 35,
    backgroundColor: '#FFD4A3',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  thinkingBody: {
    width: 70,
    height: 80,
    backgroundColor: colors.primary[500],
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -5,
  },
  thinkingArm: {
    position: 'absolute',
    top: 60,
    right: -15,
    width: 30,
    height: 12,
    backgroundColor: colors.primary[400],
    borderRadius: 6,
    transform: [{ rotate: '-30deg' }],
  },
  lockFloat: {
    position: 'absolute',
  },
  lockFloat1: {
    top: -10,
    right: -50,
  },
  lockFloat2: {
    top: 30,
    right: -70,
  },
  lockBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Reset Password styles
  resetLock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.warning[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.warning[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(245, 158, 11, 0.2)',
      },
    }),
  },
  lockShine: {
    position: 'absolute',
    top: 15,
    right: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});

export default {
  SignUpIllustration,
  LoginIllustration,
  OTPIllustration,
  ForgotPasswordIllustration,
  ResetPasswordIllustration,
};
