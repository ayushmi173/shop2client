import { Linking, Platform, Alert } from 'react-native';

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  // Format Indian phone numbers
  if (phone.startsWith('+91')) {
    const number = phone.slice(3);
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
  }
  return phone;
}

/**
 * Make a phone call
 */
export async function makeCall(phone: string): Promise<void> {
  const phoneUrl = `tel:${phone}`;
  const canOpen = await Linking.canOpenURL(phoneUrl);
  
  if (canOpen) {
    await Linking.openURL(phoneUrl);
  } else {
    Alert.alert('Error', 'Unable to make phone call');
  }
}

/**
 * Send SMS
 */
export async function sendSMS(phone: string, message?: string): Promise<void> {
  const smsUrl = Platform.select({
    ios: `sms:${phone}${message ? `&body=${encodeURIComponent(message)}` : ''}`,
    android: `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ''}`,
  });

  if (smsUrl) {
    const canOpen = await Linking.canOpenURL(smsUrl);
    if (canOpen) {
      await Linking.openURL(smsUrl);
    }
  }
}

/**
 * Open WhatsApp chat
 */
export async function openWhatsApp(phone: string, message?: string): Promise<void> {
  // Remove + and any spaces from phone
  const cleanPhone = phone.replace(/[\s+]/g, '');
  const whatsappUrl = `whatsapp://send?phone=${cleanPhone}${message ? `&text=${encodeURIComponent(message)}` : ''}`;
  
  const canOpen = await Linking.canOpenURL(whatsappUrl);
  if (canOpen) {
    await Linking.openURL(whatsappUrl);
  } else {
    Alert.alert('WhatsApp not installed', 'Please install WhatsApp to use this feature');
  }
}

/**
 * Format currency (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format distance
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return then.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short' 
  });
}

/**
 * Get full name from first and last name
 */
export function getFullName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

/**
 * Generate initials from name
 */
export function getInitials(firstName: string, lastName?: string): string {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get status color
 */
export function getStatusColor(status: string): { bg: string; text: string } {
  const statusColors: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: '#FEF3C7', text: '#D97706' },
    ACCEPTED: { bg: '#DCFCE7', text: '#16A34A' },
    IN_PROGRESS: { bg: '#E0E7FF', text: '#4F46E5' },
    COMPLETED: { bg: '#DCFCE7', text: '#15803D' },
    CANCELLED: { bg: '#FEE2E2', text: '#DC2626' },
    REJECTED: { bg: '#FEE2E2', text: '#DC2626' },
    VERIFIED: { bg: '#DCFCE7', text: '#16A34A' },
  };

  return statusColors[status] || { bg: '#F1F5F9', text: '#475569' };
}
