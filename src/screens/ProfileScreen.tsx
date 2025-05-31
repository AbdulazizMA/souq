import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { isRTL } from '../utils/i18n';
import { AuthContext } from '../navigation/AppNavigator';
import Button from '../components/Button';

interface ProfileStats {
  listings: number;
  sold: number;
  rating: number;
  reviews: number;
}

const ProfileScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();
  const { user, logout } = useContext(AuthContext);

  const [stats] = useState<ProfileStats>({
    listings: 12,
    sold: 8,
    rating: 4.8,
    reviews: 25,
  });

  const menuItems = [
    {
      icon: 'list',
      title: rtl ? 'إعلاناتي' : 'My Listings',
      subtitle: rtl ? 'إدارة إعلاناتك' : 'Manage your listings',
      onPress: () => {
        Alert.alert(
          rtl ? 'إعلاناتي' : 'My Listings',
          rtl ? 'ستتمكن من إدارة إعلاناتك قريباً' : 'Listing management will be available soon'
        );
      },
    },
    {
      icon: 'heart',
      title: rtl ? 'المفضلة' : 'Favorites',
      subtitle: rtl ? 'الإعلانات المحفوظة' : 'Saved listings',
      onPress: () => {
        Alert.alert(
          rtl ? 'المفضلة' : 'Favorites',
          rtl ? 'ستتمكن من عرض المفضلة قريباً' : 'Favorites will be available soon'
        );
      },
    },
    {
      icon: 'time',
      title: rtl ? 'المشاهدة الأخيرة' : 'Recently Viewed',
      subtitle: rtl ? 'الإعلانات التي شاهدتها' : 'Items you viewed',
      onPress: () => {
        Alert.alert(
          rtl ? 'المشاهدة الأخيرة' : 'Recently Viewed',
          rtl ? 'ستتمكن من عرض المشاهدة الأخيرة قريباً' : 'Recently viewed will be available soon'
        );
      },
    },
    {
      icon: 'card',
      title: rtl ? 'طرق الدفع' : 'Payment Methods',
      subtitle: rtl ? 'إدارة طرق الدفع' : 'Manage payment methods',
      onPress: () => {
        Alert.alert(
          rtl ? 'طرق الدفع' : 'Payment Methods',
          rtl ? 'ستتمكن من إدارة طرق الدفع قريباً' : 'Payment methods will be available soon'
        );
      },
    },
    {
      icon: 'shield-checkmark',
      title: rtl ? 'التحقق من الهوية' : 'Identity Verification',
      subtitle: rtl ? 'تحقق من هويتك' : 'Verify your identity',
      onPress: () => {
        Alert.alert(
          rtl ? 'التحقق من الهوية' : 'Identity Verification',
          rtl ? 'ستتمكن من التحقق من هويتك قريباً' : 'Identity verification will be available soon'
        );
      },
    },
    {
      icon: 'settings',
      title: t('profile.settings'),
      subtitle: rtl ? 'إعدادات التطبيق' : 'App preferences',
      onPress: () => {
        if (navigation) {
          navigation.navigate('Settings');
        } else {
          Alert.alert(
            t('profile.settings'),
            rtl ? 'الإعدادات متاحة في التطبيق الكامل' : 'Settings available in full app'
          );
        }
      },
    },
  ];

  const handleEditProfile = () => {
    Alert.alert(
      rtl ? 'تعديل الملف الشخصي' : 'Edit Profile',
      rtl ? 'ستتمكن من تعديل ملفك الشخصي قريباً' : 'Profile editing will be available soon'
    );
  };

  const handleShareProfile = () => {
    Alert.alert(
      rtl ? 'مشاركة الملف الشخصي' : 'Share Profile',
      rtl ? 'ستتمكن من مشاركة ملفك الشخصي قريباً' : 'Profile sharing will be available soon'
    );
  };

  const StatItem = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
    <View style={styles.statItem}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon as any} size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Ionicons
        name={rtl ? 'chevron-back' : 'chevron-forward'}
        size={16}
        color={COLORS.gray400}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0) || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
                {user?.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <Text style={styles.joinDate}>
                {rtl ? 'عضو منذ' : 'Member since'} {rtl ? 'يناير 2024' : 'January 2024'}
              </Text>
            </View>
          </View>
          
          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={18} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>
                {rtl ? 'تعديل' : 'Edit'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
              <Ionicons name="share-outline" size={18} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>
                {rtl ? 'مشاركة' : 'Share'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatItem
            label={rtl ? 'إعلان' : 'Listings'}
            value={stats.listings}
            icon="list"
          />
          <StatItem
            label={rtl ? 'مباع' : 'Sold'}
            value={stats.sold}
            icon="checkmark-circle"
          />
          <StatItem
            label={rtl ? 'التقييم' : 'Rating'}
            value={`${stats.rating}★`}
            icon="star"
          />
          <StatItem
            label={rtl ? 'مراجعة' : 'Reviews'}
            value={stats.reviews}
            icon="chatbubble"
          />
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title={t('profile.logout')}
            onPress={() => {
              Alert.alert(
                rtl ? 'تسجيل الخروج' : 'Logout',
                rtl ? 'هل تريد تسجيل الخروج من حسابك؟' : 'Are you sure you want to logout?',
                [
                  {
                    text: rtl ? 'إلغاء' : 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: rtl ? 'خروج' : 'Logout',
                    style: 'destructive',
                    onPress: logout,
                  },
                ]
              );
            }}
            variant="outline"
            size="large"
            icon={<Ionicons name="log-out-outline" size={20} color={COLORS.error} />}
            style={{ borderColor: COLORS.error }}
            textStyle={{ color: COLORS.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  joinDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  profileActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight + '10',
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  menuItemSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  logoutContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
});

export default ProfileScreen; 