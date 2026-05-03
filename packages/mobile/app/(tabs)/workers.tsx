import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkerCard } from '../../src/components/workers';
import { Button, Badge } from '../../src/components/ui';
import { useWorkerStore } from '../../src/stores/worker';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../src/theme/spacing';

export default function WorkersScreen() {
  const params = useLocalSearchParams<{ profession?: string }>();
  const {
    workers,
    fetchWorkers,
    isLoadingWorkers,
    hasMore,
    filters,
    setFilters,
    clearFilters,
    professions,
    fetchProfessions,
  } = useWorkerStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProfessions();
    if (params.profession) {
      setFilters({ profession: params.profession });
    } else {
      fetchWorkers(true);
    }
  }, [params.profession]);

  const handleSearch = useCallback(() => {
    setFilters({ search: searchQuery });
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!isLoadingWorkers && hasMore) {
      fetchWorkers();
    }
  };

  const handleFilterPress = (filterType: string, value: string) => {
    if (filters[filterType as keyof typeof filters] === value) {
      const newFilters = { ...filters };
      delete newFilters[filterType as keyof typeof filters];
      setFilters(newFilters);
    } else {
      setFilters({ [filterType]: value });
    }
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (k) => filters[k as keyof typeof filters]
  ).length;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workers..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
            </Pressable>
          )}
        </View>
        
        <Pressable
          style={[
            styles.filterButton,
            activeFiltersCount > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFiltersCount > 0 ? colors.white : colors.text.secondary}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Quick Filters */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[
          { key: 'available', label: 'Available Now' },
          { key: 'verified', label: 'Verified' },
          { key: 'rating', label: '4+ Rating' },
        ]}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.quickFilter,
              filters[item.key as keyof typeof filters] && styles.quickFilterActive,
            ]}
            onPress={() => {
              if (item.key === 'available') {
                handleFilterPress('available', 'true');
              } else if (item.key === 'verified') {
                handleFilterPress('verified', 'true');
              } else if (item.key === 'rating') {
                handleFilterPress('minRating', '4');
              }
            }}
          >
            <Text
              style={[
                styles.quickFilterText,
                filters[item.key as keyof typeof filters] && styles.quickFilterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={styles.quickFilters}
      />

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Active filters:</Text>
          <Pressable onPress={clearFilters}>
            <Text style={styles.clearFilters}>Clear all</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingWorkers) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary[600]} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoadingWorkers) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color={colors.secondary[300]} />
        <Text style={styles.emptyTitle}>No workers found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or filters
        </Text>
        <Button
          title="Clear Filters"
          variant="outline"
          onPress={clearFilters}
          style={styles.clearButton}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WorkerCard worker={item} />}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.filterSectionTitle}>Profession</Text>
            <View style={styles.filterOptions}>
              {professions.slice(0, 8).map((prof) => (
                <Pressable
                  key={prof.id}
                  style={[
                    styles.filterOption,
                    filters.profession === prof.slug && styles.filterOptionActive,
                  ]}
                  onPress={() => handleFilterPress('profession', prof.slug)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.profession === prof.slug && styles.filterOptionTextActive,
                    ]}
                  >
                    {prof.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              {[
                { key: 'trustScore', label: 'Trust Score' },
                { key: 'rating', label: 'Rating' },
                { key: 'price', label: 'Price' },
                { key: 'experience', label: 'Experience' },
              ].map((sort) => (
                <Pressable
                  key={sort.key}
                  style={[
                    styles.filterOption,
                    filters.sortBy === sort.key && styles.filterOptionActive,
                  ]}
                  onPress={() => handleFilterPress('sortBy', sort.key)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.sortBy === sort.key && styles.filterOptionTextActive,
                    ]}
                  >
                    {sort.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Button
              title="Clear All"
              variant="outline"
              onPress={() => {
                clearFilters();
                setShowFilters(false);
              }}
              style={styles.modalButton}
            />
            <Button
              title="Apply Filters"
              variant="primary"
              onPress={() => setShowFilters(false)}
              style={styles.modalButton}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  headerContainer: {
    backgroundColor: colors.white,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text.primary,
  },
  filterButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  filterButtonActive: {
    backgroundColor: colors.primary[600],
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  quickFilters: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  quickFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: colors.white,
  },
  quickFilterActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
  },
  quickFilterText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  quickFilterTextActive: {
    color: colors.primary[700],
    fontWeight: fontWeight.medium,
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  activeFiltersLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  clearFilters: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
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
  },
  clearButton: {
    marginTop: spacing.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  filterSectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  filterOptionActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  filterOptionText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  filterOptionTextActive: {
    color: colors.primary[700],
    fontWeight: fontWeight.medium,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  modalButton: {
    flex: 1,
  },
});
