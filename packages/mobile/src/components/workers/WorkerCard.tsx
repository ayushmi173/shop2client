import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card, Avatar, Badge, Rating, CallButton } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, fontSize, fontWeight } from '../../theme/spacing';
import { WorkerListItem } from '../../types';
import { getFullName, formatDistance } from '../../lib/utils';

interface WorkerCardProps {
  worker: WorkerListItem;
  showCallButton?: boolean;
}

export function WorkerCard({ worker, showCallButton = true }: WorkerCardProps) {
  const fullName = getFullName(worker.user.firstName, worker.user.lastName);
  const primaryProfession = worker.professions.find((p) => p.isPrimary) || worker.professions[0];

  const handlePress = () => {
    router.push(`/worker/${worker.id}`);
  };

  return (
    <Card onPress={handlePress} style={styles.card}>
      <View style={styles.header}>
        <Avatar
          imageUrl={worker.user.avatarUrl}
          firstName={worker.user.firstName}
          lastName={worker.user.lastName}
          size="lg"
          showOnlineIndicator
          isOnline={worker.isAvailable}
        />
        
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {fullName}
            </Text>
            {worker.verificationStatus === 'VERIFIED' && (
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={colors.primary[600]}
              />
            )}
          </View>
          
          <Text style={styles.profession} numberOfLines={1}>
            {primaryProfession?.name || 'Service Provider'}
          </Text>
          
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.text.tertiary}
            />
            <Text style={styles.location} numberOfLines={1}>
              {worker.location?.city || 'Location not set'}
              {worker.distance && ` • ${formatDistance(worker.distance)}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Rating
          rating={worker.averageRating}
          totalReviews={worker.totalReviews}
          size="sm"
        />
        
        <View style={styles.statDivider} />
        
        <View style={styles.stat}>
          <Ionicons name="briefcase-outline" size={14} color={colors.text.tertiary} />
          <Text style={styles.statText}>{worker.completedJobs} jobs</Text>
        </View>
        
        {worker.experience && worker.experience > 0 && (
          <>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statText}>{worker.experience}+ yrs</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.tagsRow}>
        {worker.isAvailable && (
          <Badge label="Available Now" variant="success" size="sm" />
        )}
        {worker.emergencyAvailable && (
          <Badge label="Emergency" variant="warning" size="sm" />
        )}
        {worker.hourlyRate && (
          <Badge label={`₹${worker.hourlyRate}/hr`} variant="info" size="sm" />
        )}
      </View>

      {showCallButton && (
        <View style={styles.footer}>
          <CallButton
            phone={worker.user.phone}
            variant="secondary"
            size="md"
            label="Call Now"
            showPhone
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  profession: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  location: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
});
