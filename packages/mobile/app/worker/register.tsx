import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Card, Button, Input } from '../../src/components/ui';
import { useWorkerStore } from '../../src/stores/worker';
import { useAuthStore } from '../../src/stores/auth';
import { api } from '../../src/lib/api';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../src/theme/spacing';
import { Profession } from '../../src/types';

type Step = 'services' | 'profile' | 'location' | 'verification' | 'review';

interface StepConfig {
  key: Step;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STEPS: StepConfig[] = [
  { key: 'services', title: 'Services', subtitle: 'What do you offer?', icon: 'construct' },
  { key: 'profile', title: 'Profile', subtitle: 'Tell us about you', icon: 'person' },
  { key: 'location', title: 'Location', subtitle: 'Where do you work?', icon: 'location' },
  { key: 'verification', title: 'Verify', subtitle: 'Identity verification', icon: 'shield-checkmark' },
  { key: 'review', title: 'Review', subtitle: 'Confirm details', icon: 'checkmark-circle' },
];

// Step indicator component
const StepIndicator = ({ 
  steps, 
  currentIndex, 
  onStepPress 
}: { 
  steps: StepConfig[]; 
  currentIndex: number;
  onStepPress: (index: number) => void;
}) => {
  return (
    <View style={stepStyles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stepStyles.scrollContent}>
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isClickable = index <= currentIndex;

          return (
            <React.Fragment key={step.key}>
              <Pressable
                onPress={() => isClickable && onStepPress(index)}
                style={stepStyles.stepWrapper}
              >
                <View
                  style={[
                    stepStyles.circle,
                    isActive && stepStyles.circleActive,
                    isCompleted && stepStyles.circleCompleted,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  ) : (
                    <Text style={[stepStyles.stepNumber, isActive && stepStyles.stepNumberActive]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    stepStyles.label,
                    isActive && stepStyles.labelActive,
                    isCompleted && stepStyles.labelCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {step.title}
                </Text>
              </Pressable>
              {index < steps.length - 1 && (
                <View style={[stepStyles.line, isCompleted && stepStyles.lineCompleted]} />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

const stepStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 50,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondary[200],
  },
  circleActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  circleCompleted: {
    backgroundColor: colors.success[500],
    borderColor: colors.success[500],
  },
  stepNumber: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[400],
  },
  stepNumberActive: {
    color: colors.white,
  },
  label: {
    fontSize: 10,
    color: colors.secondary[400],
    fontWeight: fontWeight.medium,
  },
  labelActive: {
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
  labelCompleted: {
    color: colors.success[600],
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: colors.secondary[200],
    marginHorizontal: spacing.xs,
    marginBottom: spacing.lg,
  },
  lineCompleted: {
    backgroundColor: colors.success[500],
  },
});

// Icon mapping for professions
const getProfessionIcon = (name: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'plumber': 'water',
    'electrician': 'flash',
    'carpenter': 'hammer',
    'painter': 'color-palette',
    'mechanic': 'car',
    'maid': 'home',
    'cook': 'restaurant',
    'cleaner': 'sparkles',
    'ac': 'snow',
    'gardener': 'leaf',
    'driver': 'car-sport',
    'security': 'shield',
    'tailor': 'cut',
    'teacher': 'school',
    'nurse': 'medkit',
    'babysitter': 'happy',
  };
  
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) return icon;
  }
  return 'construct';
};

// Service card for grid layout
const ServiceCard = ({
  profession,
  isSelected,
  onPress,
}: {
  profession: Profession;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const icon = getProfessionIcon(profession.name);
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        serviceStyles.card,
        isSelected && serviceStyles.cardSelected,
        pressed && serviceStyles.cardPressed,
      ]}
    >
      <View style={[serviceStyles.iconBg, isSelected && serviceStyles.iconBgSelected]}>
        <Ionicons
          name={icon}
          size={26}
          color={isSelected ? colors.primary[600] : colors.secondary[500]}
        />
      </View>
      <Text style={[serviceStyles.name, isSelected && serviceStyles.nameSelected]} numberOfLines={2}>
        {profession.name}
      </Text>
      {isSelected && (
        <View style={serviceStyles.checkmark}>
          <Ionicons name="checkmark" size={10} color={colors.white} />
        </View>
      )}
    </Pressable>
  );
};

const serviceStyles = StyleSheet.create({
  card: {
    width: '31%',
    aspectRatio: 0.9,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconBgSelected: {
    backgroundColor: colors.primary[100],
  },
  name: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.primary[700],
    fontWeight: fontWeight.semibold,
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary[600],
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Verification card component
const VerificationCard = ({
  title,
  description,
  icon,
  imageUri,
  onCapture,
  isCompleted,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  imageUri: string | null;
  onCapture: () => void;
  isCompleted: boolean;
}) => (
  <Card style={verifyStyles.card}>
    <View style={verifyStyles.header}>
      <View style={[verifyStyles.iconContainer, isCompleted && verifyStyles.iconCompleted]}>
        <Ionicons
          name={isCompleted ? 'checkmark' : icon}
          size={24}
          color={isCompleted ? colors.white : colors.primary[600]}
        />
      </View>
      <View style={verifyStyles.headerText}>
        <Text style={verifyStyles.title}>{title}</Text>
        <Text style={verifyStyles.description}>{description}</Text>
      </View>
    </View>
    
    {imageUri ? (
      <View style={verifyStyles.imageContainer}>
        <Image source={{ uri: imageUri }} style={verifyStyles.image} />
        <Pressable style={verifyStyles.retakeButton} onPress={onCapture}>
          <Ionicons name="refresh" size={16} color={colors.white} />
          <Text style={verifyStyles.retakeText}>Retake</Text>
        </Pressable>
      </View>
    ) : (
      <Pressable style={verifyStyles.captureButton} onPress={onCapture}>
        <Ionicons name="camera" size={32} color={colors.primary[600]} />
        <Text style={verifyStyles.captureText}>Tap to capture</Text>
      </Pressable>
    )}
  </Card>
);

const verifyStyles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCompleted: {
    backgroundColor: colors.success[500],
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  captureButton: {
    height: 150,
    backgroundColor: colors.secondary[50],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  captureText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.lg,
  },
  retakeButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  retakeText: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: fontWeight.medium,
  },
});

export default function WorkerRegisterScreen() {
  const { professions, fetchProfessions } = useWorkerStore();
  const { user, isAuthenticated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<Step>('services');
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Form state
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [serviceRadius, setServiceRadius] = useState('5');
  
  // Verification state
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [aadhaarFrontUri, setAadhaarFrontUri] = useState<string | null>(null);
  const [aadhaarBackUri, setAadhaarBackUri] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to register as a worker', [
        { text: 'Cancel', onPress: () => router.back() },
        { text: 'Login', onPress: () => router.push('/auth') },
      ]);
      return;
    }
    fetchProfessions();
  }, [isAuthenticated]);

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 150);
  };

  const handleProfessionToggle = (profId: string) => {
    if (selectedProfessions.includes(profId)) {
      setSelectedProfessions(selectedProfessions.filter((id) => id !== profId));
    } else if (selectedProfessions.length < 5) {
      setSelectedProfessions([...selectedProfessions, profId]);
    } else {
      Alert.alert('Limit Reached', 'You can select up to 5 services');
    }
  };

  const pickImage = async (type: 'selfie' | 'aadhaar-front' | 'aadhaar-back') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed for verification');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'selfie' ? [1, 1] : [16, 10],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      switch (type) {
        case 'selfie':
          setSelfieUri(uri);
          break;
        case 'aadhaar-front':
          setAadhaarFrontUri(uri);
          break;
        case 'aadhaar-back':
          setAadhaarBackUri(uri);
          break;
      }
    }
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 'services':
        if (selectedProfessions.length === 0) {
          Alert.alert('Required', 'Please select at least one service');
          return false;
        }
        return true;
      case 'profile':
        if (!bio.trim()) {
          Alert.alert('Required', 'Please write a short bio');
          return false;
        }
        if (!experience.trim()) {
          Alert.alert('Required', 'Please enter your years of experience');
          return false;
        }
        return true;
      case 'location':
        if (!city.trim() || !state.trim()) {
          Alert.alert('Required', 'Please enter your city and state');
          return false;
        }
        return true;
      case 'verification':
        if (!selfieUri) {
          Alert.alert('Required', 'Please take a selfie for verification');
          return false;
        }
        if (!aadhaarFrontUri || !aadhaarBackUri) {
          Alert.alert('Required', 'Please capture both sides of your Aadhaar card');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    
    const stepIndex = STEPS.findIndex((s) => s.key === currentStep);
    if (stepIndex < STEPS.length - 1) {
      animateTransition(() => setCurrentStep(STEPS[stepIndex + 1].key));
    }
  };

  const handleBack = () => {
    const stepIndex = STEPS.findIndex((s) => s.key === currentStep);
    if (stepIndex > 0) {
      animateTransition(() => setCurrentStep(STEPS[stepIndex - 1].key));
    } else {
      router.back();
    }
  };

  const handleStepPress = (index: number) => {
    if (index < currentStepIndex) {
      animateTransition(() => setCurrentStep(STEPS[index].key));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await api.post('/workers/register', {
        professionIds: selectedProfessions,
        bio,
        experience: parseInt(experience) || 0,
        hourlyRate: parseInt(hourlyRate) || null,
        serviceRadius: parseInt(serviceRadius),
        location: {
          address,
          city,
          state,
        },
        verification: {
          selfieUri,
          aadhaarFrontUri,
          aadhaarBackUri,
        },
      });

      if (response.success) {
        Alert.alert(
          'Registration Successful!',
          'Your profile is under review. We\'ll notify you once verified.',
          [{ text: 'Go to Home', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.error?.message || 'Please try again later'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedProfessionNames = () => {
    return professions
      .filter((p) => selectedProfessions.includes(p.id))
      .map((p) => p.name)
      .join(', ');
  };

  // Filter professions based on search query
  const filteredProfessions = professions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'services':
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <Ionicons name="briefcase" size={28} color={colors.primary[600]} />
              </View>
              <View style={styles.stepHeaderText}>
                <Text style={styles.stepTitle}>What services do you offer?</Text>
                <Text style={styles.stepSubtitle}>
                  Select up to 5 services you're skilled in
                </Text>
              </View>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <View style={styles.searchIconWrapper}>
                <Ionicons name="search" size={18} color={colors.secondary[500]} />
              </View>
              <TextInput
                placeholder="Search services..."
                placeholderTextColor={colors.secondary[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchTextInput}
              />
              {searchQuery.length > 0 && (
                <Pressable 
                  onPress={() => setSearchQuery('')} 
                  hitSlop={8}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color={colors.secondary[400]} />
                </Pressable>
              )}
            </View>

            {/* Selected services preview */}
            {selectedProfessions.length > 0 && (
              <View style={styles.selectedPreview}>
                <Text style={styles.selectedPreviewLabel}>Selected:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedChips}>
                  {professions
                    .filter((p) => selectedProfessions.includes(p.id))
                    .map((p) => (
                      <Pressable
                        key={p.id}
                        style={styles.selectedChip}
                        onPress={() => handleProfessionToggle(p.id)}
                      >
                        <Text style={styles.selectedChipText}>{p.name}</Text>
                        <Ionicons name="close" size={14} color={colors.primary[600]} />
                      </Pressable>
                    ))}
                </ScrollView>
              </View>
            )}

            {/* Services Grid */}
            <View style={styles.servicesGrid}>
              {filteredProfessions.length > 0 ? (
                filteredProfessions.map((profession) => (
                  <ServiceCard
                    key={profession.id}
                    profession={profession}
                    isSelected={selectedProfessions.includes(profession.id)}
                    onPress={() => handleProfessionToggle(profession.id)}
                  />
                ))
              ) : (
                <View style={styles.noResults}>
                  <Ionicons name="search-outline" size={48} color={colors.secondary[300]} />
                  <Text style={styles.noResultsText}>No services found</Text>
                  <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                </View>
              )}
            </View>
            
            {selectedProfessions.length > 0 && (
              <View style={styles.selectionInfo}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success[600]} />
                <Text style={styles.selectionText}>
                  {selectedProfessions.length} service{selectedProfessions.length > 1 ? 's' : ''} selected
                </Text>
              </View>
            )}
          </View>
        );

      case 'profile':
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <Ionicons name="person-circle" size={28} color={colors.primary[600]} />
              </View>
              <View style={styles.stepHeaderText}>
                <Text style={styles.stepTitle}>Tell us about yourself</Text>
                <Text style={styles.stepSubtitle}>
                  Help customers know you better
                </Text>
              </View>
            </View>
            
            <Card style={styles.formCard}>
              <Input
                label="About You"
                placeholder="Share your experience, skills, and what makes you stand out..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Input
                    label="Years of Experience"
                    placeholder="e.g., 5"
                    value={experience}
                    onChangeText={setExperience}
                    keyboardType="numeric"
                    leftIcon="time-outline"
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Input
                    label="Hourly Rate (₹)"
                    placeholder="e.g., 500"
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                    keyboardType="numeric"
                    leftIcon="cash-outline"
                  />
                </View>
              </View>
              
              <View style={styles.tipBox}>
                <Ionicons name="bulb-outline" size={18} color={colors.warning[600]} />
                <Text style={styles.tipText}>
                  A detailed bio helps customers understand your expertise better
                </Text>
              </View>
            </Card>
          </View>
        );

      case 'location':
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <Ionicons name="location" size={28} color={colors.primary[600]} />
              </View>
              <View style={styles.stepHeaderText}>
                <Text style={styles.stepTitle}>Where do you work?</Text>
                <Text style={styles.stepSubtitle}>
                  Help customers find you in their area
                </Text>
              </View>
            </View>
            
            <Card style={styles.formCard}>
              <Input
                label="Street Address"
                placeholder="e.g., 123 Main Street, Sector 15"
                value={address}
                onChangeText={setAddress}
                leftIcon="home-outline"
              />
              
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Input
                    label="City"
                    placeholder="e.g., New Delhi"
                    value={city}
                    onChangeText={setCity}
                    leftIcon="business-outline"
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Input
                    label="State"
                    placeholder="e.g., Delhi"
                    value={state}
                    onChangeText={setState}
                    leftIcon="map-outline"
                  />
                </View>
              </View>
              
              <Input
                label="Service Radius"
                placeholder="e.g., 10"
                value={serviceRadius}
                onChangeText={setServiceRadius}
                keyboardType="numeric"
                leftIcon="navigate-circle-outline"
                hint="Distance in km you're willing to travel for work"
              />
            </Card>
            
            <View style={styles.infoCard}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="shield-checkmark" size={20} color={colors.success[600]} />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Your privacy matters</Text>
                <Text style={styles.infoCardText}>
                  Your exact address is never shared. Customers only see your service area.
                </Text>
              </View>
            </View>
          </View>
        );

      case 'verification':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Verify your identity</Text>
            <Text style={styles.stepSubtitle}>
              This helps build trust with customers
            </Text>
            
            <VerificationCard
              title="Face Verification"
              description="Take a clear selfie of your face"
              icon="person"
              imageUri={selfieUri}
              onCapture={() => pickImage('selfie')}
              isCompleted={!!selfieUri}
            />

            <VerificationCard
              title="Aadhaar Card - Front"
              description="Capture the front side of your Aadhaar"
              icon="card"
              imageUri={aadhaarFrontUri}
              onCapture={() => pickImage('aadhaar-front')}
              isCompleted={!!aadhaarFrontUri}
            />

            <VerificationCard
              title="Aadhaar Card - Back"
              description="Capture the back side of your Aadhaar"
              icon="card-outline"
              imageUri={aadhaarBackUri}
              onCapture={() => pickImage('aadhaar-back')}
              isCompleted={!!aadhaarBackUri}
            />

            <View style={styles.privacyNote}>
              <Ionicons name="lock-closed" size={16} color={colors.secondary[500]} />
              <Text style={styles.privacyText}>
                Your documents are encrypted and stored securely. We never share your personal information.
              </Text>
            </View>
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review your details</Text>
            <Text style={styles.stepSubtitle}>
              Make sure everything looks good
            </Text>
            
            <Card style={styles.reviewCard}>
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Ionicons name="construct" size={20} color={colors.primary[600]} />
                  <Text style={styles.reviewLabel}>Services</Text>
                </View>
                <Text style={styles.reviewValue}>{getSelectedProfessionNames()}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Ionicons name="person" size={20} color={colors.primary[600]} />
                  <Text style={styles.reviewLabel}>Profile</Text>
                </View>
                <Text style={styles.reviewValue}>{bio}</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewMeta}>
                    {experience} years experience
                  </Text>
                  {hourlyRate && (
                    <Text style={styles.reviewMeta}>₹{hourlyRate}/hour</Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Ionicons name="location" size={20} color={colors.primary[600]} />
                  <Text style={styles.reviewLabel}>Location</Text>
                </View>
                <Text style={styles.reviewValue}>
                  {[address, city, state].filter(Boolean).join(', ')}
                </Text>
                <Text style={styles.reviewMeta}>
                  Service radius: {serviceRadius} km
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Ionicons name="shield-checkmark" size={20} color={colors.primary[600]} />
                  <Text style={styles.reviewLabel}>Verification</Text>
                </View>
                <View style={styles.verificationPreview}>
                  {selfieUri && (
                    <Image source={{ uri: selfieUri }} style={styles.previewImage} />
                  )}
                  {aadhaarFrontUri && (
                    <Image source={{ uri: aadhaarFrontUri }} style={styles.previewImage} />
                  )}
                  {aadhaarBackUri && (
                    <Image source={{ uri: aadhaarBackUri }} style={styles.previewImage} />
                  )}
                </View>
              </View>
            </Card>

            <View style={styles.termsNote}>
              <Ionicons name="information-circle" size={16} color={colors.secondary[500]} />
              <Text style={styles.termsText}>
                By registering, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Step indicator */}
        <StepIndicator
          steps={STEPS}
          currentIndex={currentStepIndex}
          onStepPress={handleStepPress}
        />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {renderStepContent()}
          </Animated.View>
        </ScrollView>

        {/* Bottom actions */}
        <View style={styles.bottomActions}>
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={styles.backButton}
          />
          {currentStep === 'review' ? (
            <Button
              title="Submit"
              variant="primary"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.nextButton}
            />
          ) : (
            <Button
              title="Continue"
              variant="primary"
              onPress={handleNext}
              style={styles.nextButton}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  stepContent: {
    padding: spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHeaderText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.warning[50],
    borderRadius: borderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning[500],
    marginTop: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.warning[600],
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.success[50],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.success[100],
  },
  infoCardIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.success[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.success[700],
    marginBottom: spacing.xs,
  },
  infoCardText: {
    fontSize: fontSize.sm,
    color: colors.success[600],
    lineHeight: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.secondary[200],
  },
  searchIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      },
    }),
  },
  searchTextInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text.primary,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
  },
  clearButton: {
    padding: spacing.sm,
  },
  selectedPreview: {
    marginBottom: spacing.lg,
  },
  selectedPreviewLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  selectedChips: {
    flexDirection: 'row',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  selectedChipText: {
    fontSize: fontSize.sm,
    color: colors.primary[700],
    fontWeight: fontWeight.medium,
  },
  noResults: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  noResultsText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  noResultsSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'flex-start',
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.success[50],
    borderRadius: borderRadius.lg,
  },
  selectionText: {
    fontSize: fontSize.sm,
    color: colors.success[700],
    fontWeight: fontWeight.medium,
  },
  formGroup: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.secondary[50],
    borderRadius: borderRadius.lg,
  },
  privacyText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  reviewCard: {
    marginBottom: spacing.lg,
  },
  reviewSection: {
    gap: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewValue: {
    fontSize: fontSize.base,
    color: colors.text.primary,
    lineHeight: 22,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  reviewMeta: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.lg,
  },
  verificationPreview: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
  },
  termsNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.secondary[50],
    borderRadius: borderRadius.lg,
  },
  termsText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  backButton: {
    flex: 0.35,
  },
  nextButton: {
    flex: 0.65,
  },
});
