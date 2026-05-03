import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Avatar } from '../../src/components/ui';
import { WorkerCard } from '../../src/components/workers';
import { HeroCarousel } from '../../src/components/home';
import { useAuthStore } from '../../src/stores/auth';
import { useWorkerStore } from '../../src/stores/worker';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../../src/theme/spacing';

const POPULAR_PROFESSIONS = [
  { id: '1', name: 'Electrician', icon: 'flash-outline', color: '#FEF3C7' },
  { id: '2', name: 'Plumber', icon: 'water-outline', color: '#DBEAFE' },
  { id: '3', name: 'Carpenter', icon: 'construct-outline', color: '#FEE2E2' },
  { id: '4', name: 'Painter', icon: 'color-palette-outline', color: '#E0E7FF' },
  { id: '5', name: 'Cleaner', icon: 'sparkles-outline', color: '#DCFCE7' },
  { id: '6', name: 'AC Repair', icon: 'snow-outline', color: '#CFFAFE' },
];

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const { workers, fetchWorkers, isLoadingWorkers, professions, fetchProfessions } = useWorkerStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchWorkers(true);
    fetchProfessions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkers(true);
    setRefreshing(false);
  };

  const handleProfessionPress = (profession: string) => {
    router.push({
      pathname: '/workers',
      params: { profession },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {isAuthenticated ? `Hello, ${user?.firstName}` : 'Welcome'}
            </Text>
            <Text style={styles.subtitle}>Find & Book Local Services</Text>
          </View>
          
          {isAuthenticated ? (
            <Pressable onPress={() => router.push('/profile')}>
              <Avatar
                imageUrl={user?.avatarUrl}
                firstName={user?.firstName || 'U'}
                size="md"
              />
            </Pressable>
          ) : (
            <Button
              title="Login"
              variant="primary"
              size="sm"
              onPress={() => router.push('/auth')}
            />
          )}
        </View>

        {/* Search Bar */}
        <Pressable
          style={styles.searchBar}
          onPress={() => router.push('/workers')}
        >
          <Ionicons name="search-outline" size={20} color={colors.text.tertiary} />
          <Text style={styles.searchPlaceholder}>
            Search for workers, services...
          </Text>
        </Pressable>

        {/* Hero Carousel */}
        <View style={styles.carouselContainer}>
          <HeroCarousel />
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.professionsList}
          >
            {POPULAR_PROFESSIONS.map((profession) => (
              <Pressable
                key={profession.id}
                style={styles.professionCard}
                onPress={() => handleProfessionPress(profession.name.toLowerCase())}
              >
                <View
                  style={[
                    styles.professionIcon,
                    { backgroundColor: profession.color },
                  ]}
                >
                  <Ionicons
                    name={profession.icon as any}
                    size={24}
                    color={colors.primary[600]}
                  />
                </View>
                <Text style={styles.professionName}>{profession.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Become a Worker CTA */}
        {(!isAuthenticated || user?.role === 'USER') && (
          <Card style={styles.ctaCard}>
            <View style={styles.ctaContent}>
              <View style={styles.ctaText}>
                <Text style={styles.ctaTitle}>Become a Worker</Text>
                <Text style={styles.ctaDescription}>
                  Register as a service provider and connect with customers in your area
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
        )}

        {/* Top Workers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Workers Near You</Text>
            <Pressable onPress={() => router.push('/workers')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          
          {(workers || []).slice(0, 3).map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
          
          {(!workers || workers.length === 0) && !isLoadingWorkers && (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons
                name="people-outline"
                size={48}
                color={colors.secondary[300]}
              />
              <Text style={styles.emptyText}>No workers found nearby</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your location or search filters
              </Text>
            </Card>
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  searchPlaceholder: {
    fontSize: fontSize.base,
    color: colors.text.tertiary,
  },
  carouselContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
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
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
  },
  professionsList: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  professionCard: {
    alignItems: 'center',
    gap: spacing.sm,
    width: 80,
  },
  professionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  professionName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  ctaCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  ctaDescription: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    marginTop: spacing.xs,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
