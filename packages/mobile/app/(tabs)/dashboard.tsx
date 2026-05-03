import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar, Badge, Toggle, Button } from '../../src/components/ui';
import { JobRequestCard } from '../../src/components/workers';
import { useAuthStore } from '../../src/stores/auth';
import { useWorkerStore } from '../../src/stores/worker';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../../src/theme/spacing';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const {
    dashboardData,
    pendingRequests,
    fetchDashboard,
    isLoadingDashboard,
    updateAvailability,
    acceptRequest,
    rejectRequest,
  } = useWorkerStore();

  const [refreshing, setRefreshing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(dashboardData?.isAvailable ?? true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      setIsAvailable(dashboardData.isAvailable);
    }
  }, [dashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  const handleAvailabilityToggle = async (value: boolean) => {
    setIsAvailable(value);
    const success = await updateAvailability(value);
    if (!success) {
      setIsAvailable(!value); // Revert on failure
    }
  };

  const stats = dashboardData?.stats || {
    todayJobs: 0,
    totalEarnings: 0,
    completedJobs: 0,
    pendingRequests: 0,
    averageRating: 0,
    totalReviews: 0,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Avatar
              imageUrl={user?.avatarUrl}
              firstName={user?.firstName || 'W'}
              size="lg"
              showOnlineIndicator
              isOnline={isAvailable}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Hello, {user?.firstName}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={colors.primary[500]} />
                <Text style={styles.locationText}>Delhi, India</Text>
              </View>
            </View>
            <Pressable style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
              {pendingRequests.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {pendingRequests.length}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Availability Toggle */}
          <Card style={styles.availabilityCard}>
            <Toggle
              value={isAvailable}
              onValueChange={handleAvailabilityToggle}
              label="Available for Work"
              description={isAvailable ? "You're visible to customers" : "You won't receive new requests"}
            />
          </Card>
        </View>

        {/* New Job Request Alert */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <Ionicons name="briefcase" size={24} color={colors.primary[600]} />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>New Job Request</Text>
                <Text style={styles.alertSubtitle}>
                  {pendingRequests[0].user.firstName}, {pendingRequests[0].user.location?.address || 'nearby'}
                </Text>
              </View>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>
                  ₹{pendingRequests[0].estimatedPrice || '---'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Today's Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary[50] }]}>
                <Ionicons name="briefcase-outline" size={20} color={colors.primary[600]} />
              </View>
              <Text style={styles.statValue}>{stats.todayJobs}</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.success[50] }]}>
                <Ionicons name="cash-outline" size={20} color={colors.success[600]} />
              </View>
              <Text style={styles.statValue}>₹{stats.totalEarnings}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.warning[50] }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.warning[600]} />
              </View>
              <Text style={styles.statValue}>{stats.completedJobs}</Text>
              <Text style={styles.statLabel}>Work Completed</Text>
            </Card>
          </View>
        </View>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              <Badge
                label={`${pendingRequests.length} new`}
                variant="warning"
              />
            </View>
            
            {pendingRequests.map((request) => (
              <JobRequestCard
                key={request.id}
                request={request}
                variant="pending"
                onAccept={acceptRequest}
                onReject={rejectRequest}
              />
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary[50] }]}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary[600]} />
              </View>
              <Text style={styles.actionLabel}>Schedule</Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.success[50] }]}>
                <Ionicons name="wallet-outline" size={24} color={colors.success[600]} />
              </View>
              <Text style={styles.actionLabel}>Earnings</Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.warning[50] }]}>
                <Ionicons name="star-outline" size={24} color={colors.warning[600]} />
              </View>
              <Text style={styles.actionLabel}>Reviews</Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary[100] }]}>
                <Ionicons name="settings-outline" size={24} color={colors.secondary[600]} />
              </View>
              <Text style={styles.actionLabel}>Settings</Text>
            </Pressable>
          </View>
        </View>

        {/* Empty State for no requests */}
        {pendingRequests.length === 0 && (
          <View style={styles.section}>
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons
                name="clipboard-outline"
                size={48}
                color={colors.secondary[300]}
              />
              <Text style={styles.emptyTitle}>No pending requests</Text>
              <Text style={styles.emptySubtitle}>
                New job requests will appear here
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  availabilityCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
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
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary[50],
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  alertSubtitle: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    marginTop: spacing.xs,
  },
  alertBadge: {
    backgroundColor: colors.success[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  alertBadgeText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
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
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
