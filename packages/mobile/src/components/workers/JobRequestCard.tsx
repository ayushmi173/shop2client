import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Avatar, Badge, Button, CallButton } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme/spacing';
import { ServiceRequest } from '../../types';
import { getFullName, formatRelativeTime, getStatusColor } from '../../lib/utils';

interface JobRequestCardProps {
  request: ServiceRequest;
  variant?: 'pending' | 'active' | 'completed';
  onAccept?: (id: string) => Promise<boolean>;
  onReject?: (id: string) => Promise<boolean>;
}

export function JobRequestCard({
  request,
  variant = 'pending',
  onAccept,
  onReject,
}: JobRequestCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const customerName = getFullName(request.user.firstName, request.user.lastName);
  const statusColor = getStatusColor(request.status);

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsLoading(true);
    const success = await onAccept(request.id);
    setIsLoading(false);
    if (success) {
      Alert.alert('Success', 'Job request accepted!');
    }
  };

  const handleReject = async () => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this job request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            if (!onReject) return;
            setIsLoading(true);
            await onReject(request.id);
            setIsLoading(false);
          },
        },
      ]
    );
  };

  return (
    <Card style={styles.card}>
      {/* Header with status badge */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Badge
            label={request.urgency === 'EMERGENCY' ? 'Emergency' : 'New Job Request'}
            variant={request.urgency === 'EMERGENCY' ? 'error' : 'info'}
          />
          <Text style={styles.time}>{formatRelativeTime(request.createdAt)}</Text>
        </View>
        
        {variant !== 'pending' && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor.bg },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {request.status.replace('_', ' ')}
            </Text>
          </View>
        )}
      </View>

      {/* Customer info */}
      <View style={styles.customerRow}>
        <Avatar
          imageUrl={request.user.avatarUrl}
          firstName={request.user.firstName}
          lastName={request.user.lastName}
          size="md"
        />
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{customerName}</Text>
          {request.user.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={colors.text.tertiary} />
              <Text style={styles.location} numberOfLines={1}>
                {request.user.location.address}, {request.user.location.city}
              </Text>
            </View>
          )}
        </View>
        
        {variant !== 'pending' && request.user.phone && (
          <CallButton
            phone={request.user.phone}
            variant="floating"
            style={styles.callButton}
          />
        )}
      </View>

      {/* Job details */}
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="construct-outline" size={16} color={colors.primary[600]} />
          <Text style={styles.detailText}>{request.profession.name}</Text>
        </View>
        
        {request.title && (
          <Text style={styles.jobTitle}>{request.title}</Text>
        )}
        
        {request.description && (
          <Text style={styles.jobDescription} numberOfLines={2}>
            {request.description}
          </Text>
        )}
        
        <View style={styles.metaRow}>
          {request.preferredDate && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{request.preferredDate}</Text>
            </View>
          )}
          {request.estimatedPrice && (
            <View style={styles.metaItem}>
              <Text style={styles.price}>₹{request.estimatedPrice}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action buttons for pending requests */}
      {variant === 'pending' && (
        <View style={styles.actionRow}>
          <Button
            title="Reject"
            variant="outline"
            size="md"
            onPress={handleReject}
            disabled={isLoading}
            style={styles.rejectButton}
          />
          <Button
            title="Accept"
            variant="primary"
            size="md"
            onPress={handleAccept}
            loading={isLoading}
            style={styles.acceptButton}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
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
  callButton: {
    width: 44,
    height: 44,
  },
  jobDetails: {
    paddingTop: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary[600],
  },
  jobTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  jobDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.success[600],
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  rejectButton: {
    flex: 1,
    borderColor: colors.error[300],
  },
  acceptButton: {
    flex: 1,
  },
});
