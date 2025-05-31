import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { isRTL } from '../utils/i18n';

interface Notification {
  id: string;
  type: 'message' | 'offer' | 'listing' | 'system';
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  data?: any;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New Message',
    body: 'Sara Mohammed sent you a message about iPhone 14 Pro Max',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    isRead: false,
  },
  {
    id: '2',
    type: 'offer',
    title: 'New Offer',
    body: 'Mohammed Ali offered 4000 SAR for your iPhone 14 Pro Max',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isRead: false,
  },
  {
    id: '3',
    type: 'listing',
    title: 'Listing Approved',
    body: 'Your listing "Samsung Galaxy S23 Ultra" has been approved and is now live',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isRead: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Welcome to Souq+',
    body: 'Thank you for joining Souq+! Start exploring amazing deals near you.',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    isRead: true,
  },
  {
    id: '5',
    type: 'offer',
    title: 'Offer Accepted',
    body: 'Your offer of 3500 SAR for Toyota Camry 2020 has been accepted!',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    isRead: true,
  },
];

const NotificationsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return rtl ? 'الآن' : 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}${rtl ? 'د' : 'm'}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${rtl ? 'س' : 'h'}`;
    return `${Math.floor(diffInMinutes / 1440)}${rtl ? 'ي' : 'd'}`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return 'chatbubble';
      case 'offer':
        return 'cash';
      case 'listing':
        return 'list';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return COLORS.info;
      case 'offer':
        return COLORS.secondary;
      case 'listing':
        return COLORS.primary;
      case 'system':
        return COLORS.gray500;
      default:
        return COLORS.gray500;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        if (navigation) {
          navigation.navigate('Messages');
        }
        break;
      case 'offer':
        Alert.alert(
          rtl ? 'عرض جديد' : 'New Offer',
          notification.body,
          [
            { text: rtl ? 'إلغاء' : 'Cancel', style: 'cancel' },
            { text: rtl ? 'عرض' : 'View', onPress: () => navigation?.navigate('Messages') },
          ]
        );
        break;
      case 'listing':
        Alert.alert(
          rtl ? 'إعلان' : 'Listing',
          notification.body
        );
        break;
      case 'system':
        Alert.alert(
          rtl ? 'إشعار النظام' : 'System Notification',
          notification.body
        );
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      rtl ? 'مسح الإشعارات' : 'Clear Notifications',
      rtl ? 'هل تريد مسح جميع الإشعارات؟' : 'Are you sure you want to clear all notifications?',
      [
        { text: rtl ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: rtl ? 'مسح' : 'Clear',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(item.type) + '20' }
        ]}>
          <Ionicons
            name={getNotificationIcon(item.type) as any}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            !item.isRead && styles.unreadText
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.notificationTime}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
      
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            {rtl ? 'الإشعارات' : 'Notifications'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.headerButtonText}>
                {rtl ? 'قراءة الكل' : 'Mark All Read'}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearAllNotifications}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'all' && styles.activeFilterTab
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterTabText,
            filter === 'all' && styles.activeFilterTabText
          ]}>
            {rtl ? 'الكل' : 'All'} ({notifications.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'unread' && styles.activeFilterTab
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[
            styles.filterTabText,
            filter === 'unread' && styles.activeFilterTabText
          ]}>
            {rtl ? 'غير مقروءة' : 'Unread'} ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          style={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-outline" size={64} color={COLORS.gray400} />
          <Text style={styles.emptyStateText}>
            {filter === 'unread' 
              ? rtl ? 'لا توجد إشعارات غير مقروءة' : 'No unread notifications'
              : rtl ? 'لا توجد إشعارات' : 'No notifications'
            }
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {rtl ? 'ستظهر الإشعارات هنا عند وصولها' : 'Notifications will appear here when they arrive'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  unreadBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  unreadBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  headerButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  activeFilterTabText: {
    color: COLORS.primary,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unreadNotification: {
    backgroundColor: COLORS.primaryLight + '05',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  unreadText: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  notificationBody: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  notificationTime: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default NotificationsScreen; 