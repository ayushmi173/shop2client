import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar, Badge, Rating, CallButton, Button } from '../../src/components/ui';
import { api } from '../../src/lib/api';
import { useAuthStore } from '../../src/stores/auth';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../src/theme/spacing';
import { Favorite } from '../../src/types';
import { getFullName } from '../../src/lib/utils';

export default function FavoritesScreen() {
  const { isAuthenticated } = useAuthStore();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const response = await api.get<Favorite[]>('/favorites');
      if (response.success && response.data) {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = async (id: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this worker from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/favorites/${id}`);
              setFavorites(favorites.filter((f) => f.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to remove favorite');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Favorite }) => {
    const { worker } = item;
    const fullName = getFullName(worker.firstName, worker.lastName);
    const primaryProfession = worker.professions[0];

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Avatar
            imageUrl={worker.avatarUrl}
            firstName={worker.firstName}
            lastName={worker.lastName}
            size="lg"
            showOnlineIndicator
            isOnline={worker.isAvailable}
          />
          
          <View style={styles.cardInfo}>
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
            
            <Text style={styles.profession}>
              {primaryProfession?.name || 'Service Provider'}
            </Text>
            
            {worker.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.location}>
                  {worker.location.city}, {worker.location.state}
                </Text>
              </View>
            )}
          </View>
          
          <Ionicons
            name="heart"
            size={24}
            color={colors.error[500]}
            onPress={() => handleRemoveFavorite(item.id)}
          />
        </View>

        <View style={styles.statsRow}>
          <Rating
            rating={worker.averageRating}
            totalReviews={worker.totalReviews}
            size="sm"
          />
          {worker.isAvailable && (
            <>
              <View style={styles.statDivider} />
              <Badge label="Available" variant="success" size="sm" />
            </>
          )}
        </View>

        <View style={styles.cardFooter}>
          <CallButton
            phone={worker.phone}
            variant="primary"
            size="md"
            label="Call Now"
            showPhone
          />
        </View>
      </Card>
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.authPrompt}>
          <Ionicons name="heart-outline" size={64} color={colors.secondary[300]} />
          <Text style={styles.authTitle}>Save Your Favorite Workers</Text>
          <Text style={styles.authSubtitle}>
            Login to save workers and access them quickly
          </Text>
          <Button
            title="Login"
            variant="primary"
            onPress={() => router.push('/auth')}
            style={styles.authButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={64} color={colors.secondary[300]} />
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptySubtitle}>
                Save workers you like for quick access
              </Text>
              <Button
                title="Browse Workers"
                variant="primary"
                onPress={() => router.push('/workers')}
                style={styles.browseButton}
              />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  cardInfo: {
    flex: 1,
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
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },
  cardFooter: {
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['5xl'],
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  browseButton: {
    marginTop: spacing.lg,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  authTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  authButton: {
    marginTop: spacing.xl,
    minWidth: 200,
  },
});
