import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar, Badge, Button } from '../../src/components/ui';
import { useAuthStore } from '../../src/stores/auth';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../src/theme/spacing';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  rightLabel?: string;
  showArrow?: boolean;
  color?: string;
}

function MenuItem({
  icon,
  label,
  onPress,
  rightLabel,
  showArrow = true,
  color = colors.text.primary,
}: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      {rightLabel && <Text style={styles.menuRightLabel}>{rightLabel}</Text>}
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.authPrompt}>
          <Ionicons name="person-circle-outline" size={80} color={colors.secondary[300]} />
          <Text style={styles.authTitle}>Welcome to LocalConnect</Text>
          <Text style={styles.authSubtitle}>
            Login to access your profile, favorites, and service requests
          </Text>
          <Button
            title="Login / Sign Up"
            variant="primary"
            onPress={() => router.push('/auth')}
            style={styles.authButton}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Avatar
            imageUrl={user?.avatarUrl}
            firstName={user?.firstName || 'U'}
            lastName={user?.lastName}
            size="xl"
          />
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
          
          <View style={styles.badgeRow}>
            <Badge
              label={user?.role === 'WORKER' ? 'Worker' : 'Customer'}
              variant={user?.role === 'WORKER' ? 'success' : 'info'}
            />
            {user?.isVerified && (
              <Badge label="Verified" variant="success" />
            )}
          </View>
        </View>

        {/* Quick Actions for Workers */}
        {user?.role === 'WORKER' && (
          <Card style={styles.quickActionsCard}>
            <View style={styles.quickActionsRow}>
              <Pressable
                style={styles.quickAction}
                onPress={() => router.push('/dashboard')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primary[50] }]}>
                  <Ionicons name="grid-outline" size={24} color={colors.primary[600]} />
                </View>
                <Text style={styles.quickActionLabel}>Dashboard</Text>
              </Pressable>
              
              <Pressable style={styles.quickAction}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.success[50] }]}>
                  <Ionicons name="wallet-outline" size={24} color={colors.success[600]} />
                </View>
                <Text style={styles.quickActionLabel}>Earnings</Text>
              </Pressable>
              
              <Pressable style={styles.quickAction}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.warning[50] }]}>
                  <Ionicons name="star-outline" size={24} color={colors.warning[600]} />
                </View>
                <Text style={styles.quickActionLabel}>Reviews</Text>
              </Pressable>
            </View>
          </Card>
        )}

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <Card variant="outlined" padding="none">
            <MenuItem
              icon="person-outline"
              label="Edit Profile"
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="location-outline"
              label="My Addresses"
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              onPress={() => {}}
            />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Activity</Text>
          <Card variant="outlined" padding="none">
            <MenuItem
              icon="clipboard-outline"
              label="My Requests"
              onPress={() => router.push('/requests')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="heart-outline"
              label="Saved Workers"
              onPress={() => router.push('/favorites')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="time-outline"
              label="Request History"
              onPress={() => {}}
            />
          </Card>
        </View>

        {user?.role === 'USER' && (
          <View style={styles.menuSection}>
            <Card style={styles.workerCta}>
              <View style={styles.workerCtaContent}>
                <View>
                  <Text style={styles.workerCtaTitle}>Become a Worker</Text>
                  <Text style={styles.workerCtaSubtitle}>
                    Earn money by providing services
                  </Text>
                </View>
                <Button
                  title="Register"
                  variant="primary"
                  size="sm"
                  onPress={() => router.push('/worker/register')}
                />
              </View>
            </Card>
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          <Card variant="outlined" padding="none">
            <MenuItem
              icon="help-circle-outline"
              label="Help Center"
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="chatbubble-outline"
              label="Contact Us"
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="document-text-outline"
              label="Terms & Conditions"
              onPress={() => {}}
            />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Card variant="outlined" padding="none">
            <MenuItem
              icon="log-out-outline"
              label="Logout"
              onPress={handleLogout}
              showArrow={false}
              color={colors.error[500]}
            />
          </Card>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.white,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  userPhone: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickActionsCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  menuSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  menuSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.base,
  },
  menuRightLabel: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: spacing['4xl'],
  },
  workerCta: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  workerCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workerCtaTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  workerCtaSubtitle: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    marginTop: spacing.xs,
  },
  version: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    paddingVertical: spacing.xl,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  authTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 24,
  },
  authButton: {
    marginTop: spacing.xl,
  },
});
