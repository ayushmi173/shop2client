import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar, Badge, Rating, Button, CallButton } from '../../src/components/ui';
import { useWorkerStore } from '../../src/stores/worker';
import { useAuthStore } from '../../src/stores/auth';
import { api } from '../../src/lib/api';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../../src/theme/spacing';
import { getFullName, formatCurrency } from '../../src/lib/utils';

export default function WorkerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedWorker, fetchWorkerById, isLoadingDetail } = useWorkerStore();
  const { isAuthenticated } = useAuthStore();
  
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWorkerById(id);
    }
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to save favorites', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/auth') },
      ]);
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${selectedWorker?.id}`);
      } else {
        await api.post('/favorites', { workerId: selectedWorker?.id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite');
    }
  };

  if (isLoadingDetail || !selectedWorker) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  const worker = selectedWorker;
  const fullName = getFullName(worker.user.firstName, worker.user.lastName);
  const primaryProfession = worker.professions.find((p) => p.isPrimary) || worker.professions[0];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Avatar
            imageUrl={worker.user.avatarUrl}
            firstName={worker.user.firstName}
            lastName={worker.user.lastName}
            size="xl"
            showOnlineIndicator
            isOnline={worker.isAvailable}
          />
          
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{fullName}</Text>
              {worker.verificationStatus === 'VERIFIED' && (
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={colors.primary[600]}
                />
              )}
            </View>
            
            <Text style={styles.profession}>
              {primaryProfession?.name || 'Service Provider'}
            </Text>
            
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.text.tertiary} />
              <Text style={styles.location}>
                {worker.location?.city}, {worker.location?.state}
              </Text>
            </View>
          </View>

          <Pressable style={styles.favoriteButton} onPress={handleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.error[500] : colors.text.tertiary}
            />
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{worker.completedJobs}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Rating rating={worker.averageRating} size="sm" showCount={false} />
            <Text style={styles.statLabel}>{worker.totalReviews} Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{worker.experience || 0}+</Text>
            <Text style={styles.statLabel}>Years Exp</Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesRow}>
          {worker.isAvailable && (
            <Badge label="Available Now" variant="success" />
          )}
          {worker.emergencyAvailable && (
            <Badge label="Emergency Available" variant="warning" />
          )}
          {worker.verificationStatus === 'VERIFIED' && (
            <Badge label="Verified" variant="info" />
          )}
        </View>

        {/* About Section */}
        {worker.bio && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{worker.bio}</Text>
          </Card>
        )}

        {/* Services Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesList}>
            {worker.professions.map((prof) => (
              <View key={prof.id} style={styles.serviceItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.success[500]}
                />
                <Text style={styles.serviceName}>{prof.name}</Text>
                {prof.isPrimary && (
                  <Badge label="Primary" variant="info" size="sm" />
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Pricing Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingRow}>
            {worker.hourlyRate && (
              <View style={styles.priceItem}>
                <Text style={styles.priceValue}>
                  {formatCurrency(worker.hourlyRate)}
                </Text>
                <Text style={styles.priceLabel}>per hour</Text>
              </View>
            )}
            {worker.minimumCharge && (
              <View style={styles.priceItem}>
                <Text style={styles.priceValue}>
                  {formatCurrency(worker.minimumCharge)}
                </Text>
                <Text style={styles.priceLabel}>minimum charge</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Reviews Section */}
        {worker.recentReviews && worker.recentReviews.length > 0 && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Pressable>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            </View>
            
            {worker.recentReviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.authorName}</Text>
                  <Rating rating={review.rating} size="sm" showCount={false} />
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))}
          </Card>
        )}

        {/* Spacer for bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <CallButton
          phone={worker.user.phone}
          variant="primary"
          size="lg"
          label="Call Now"
          showPhone
          style={styles.callButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  profession: {
    fontSize: fontSize.base,
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  location: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  section: {
    margin: spacing.lg,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
  },
  bio: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  servicesList: {
    gap: spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  serviceName: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text.primary,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceValue: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.success[600],
  },
  priceLabel: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  reviewItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  reviewComment: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.lg,
  },
  callButton: {
    flex: 1,
  },
});
