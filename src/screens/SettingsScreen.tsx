import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { isRTL, changeLanguage } from '../utils/i18n';
import { AuthContext } from '../navigation/AppNavigator';
import Button from '../components/Button';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const rtl = isRTL();
  const { logout } = useContext(AuthContext);

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    locationServices: true,
    darkMode: false,
    autoTranslate: false,
    showOnlineStatus: true,
    allowOffers: true,
  });

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      await AsyncStorage.setItem('selectedLanguage', languageCode);
      setShowLanguageModal(false);
      
      Alert.alert(
        languageCode === 'ar' ? 'تم تغيير اللغة' : 'Language Changed',
        languageCode === 'ar' ? 'تم تغيير اللغة بنجاح' : 'Language has been changed successfully',
        [{ text: languageCode === 'ar' ? 'حسناً' : 'OK' }]
      );
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(
        rtl ? 'خطأ' : 'Error',
        rtl ? 'حدث خطأ أثناء تغيير اللغة' : 'An error occurred while changing language',
        [{ text: rtl ? 'حسناً' : 'OK' }]
      );
    }
  };

  const handleSettingChange = async (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLogout = () => {
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
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      rtl ? 'حذف الحساب' : 'Delete Account',
      rtl ? 'هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.' : 'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: rtl ? 'إلغاء' : 'Cancel',
          style: 'cancel',
        },
        {
          text: rtl ? 'حذف' : 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert(
              rtl ? 'تم الحذف' : 'Account Deleted',
              rtl ? 'تم حذف حسابك بنجاح' : 'Your account has been deleted successfully',
              [{ text: rtl ? 'حسناً' : 'OK', onPress: logout }]
            );
          },
        },
      ]
    );
  };

  const LanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {rtl ? 'اختر اللغة' : 'Choose Language'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <FlatList
          data={languages}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.languageOption,
                currentLanguage.code === item.code && styles.languageOptionSelected
              ]}
              onPress={() => handleLanguageChange(item.code)}
            >
              <Text style={styles.languageFlag}>{item.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={[
                  styles.languageName,
                  currentLanguage.code === item.code && styles.languageNameSelected
                ]}>
                  {item.name}
                </Text>
                <Text style={[
                  styles.languageNativeName,
                  currentLanguage.code === item.code && styles.languageNativeNameSelected
                ]}>
                  {item.nativeName}
                </Text>
              </View>
              {currentLanguage.code === item.code && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.modalContent}
        />
      </SafeAreaView>
    </Modal>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    showArrow = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={icon as any} size={20} color={COLORS.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showArrow && onPress && (
          <Ionicons
            name={rtl ? 'chevron-back' : 'chevron-forward'}
            size={16}
            color={COLORS.gray400}
            style={{ marginLeft: SPACING.sm }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.settings')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language & Region */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {rtl ? 'اللغة والمنطقة' : 'Language & Region'}
          </Text>
          
          <SettingItem
            icon="language"
            title={rtl ? 'اللغة' : 'Language'}
            subtitle={currentLanguage.nativeName}
            onPress={() => setShowLanguageModal(true)}
          />
          
          <SettingItem
            icon="location"
            title={rtl ? 'المنطقة' : 'Region'}
            subtitle={rtl ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
            onPress={() => {
              Alert.alert(
                rtl ? 'قريباً' : 'Coming Soon',
                rtl ? 'ستتمكن من تغيير المنطقة قريباً' : 'Region selection will be available soon'
              );
            }}
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {rtl ? 'الإشعارات' : 'Notifications'}
          </Text>
          
          <SettingItem
            icon="notifications"
            title={rtl ? 'الإشعارات' : 'Notifications'}
            subtitle={rtl ? 'تفعيل جميع الإشعارات' : 'Enable all notifications'}
            rightElement={
              <Switch
                value={settings.notifications}
                onValueChange={(value) => handleSettingChange('notifications', value)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={settings.notifications ? COLORS.primary : COLORS.gray400}
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="mail"
            title={rtl ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
            subtitle={rtl ? 'تلقي الإشعارات عبر البريد' : 'Receive notifications via email'}
            rightElement={
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) => handleSettingChange('emailNotifications', value)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={settings.emailNotifications ? COLORS.primary : COLORS.gray400}
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="phone-portrait"
            title={rtl ? 'الإشعارات الفورية' : 'Push Notifications'}
            subtitle={rtl ? 'تلقي الإشعارات على الجهاز' : 'Receive notifications on device'}
            rightElement={
              <Switch
                value={settings.pushNotifications}
                onValueChange={(value) => handleSettingChange('pushNotifications', value)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={settings.pushNotifications ? COLORS.primary : COLORS.gray400}
              />
            }
            showArrow={false}
          />
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {rtl ? 'الخصوصية والأمان' : 'Privacy & Security'}
          </Text>
          
          <SettingItem
            icon="location"
            title={rtl ? 'خدمات الموقع' : 'Location Services'}
            subtitle={rtl ? 'السماح بالوصول للموقع' : 'Allow location access'}
            rightElement={
              <Switch
                value={settings.locationServices}
                onValueChange={(value) => handleSettingChange('locationServices', value)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={settings.locationServices ? COLORS.primary : COLORS.gray400}
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="eye"
            title={rtl ? 'إظهار الحالة' : 'Show Online Status'}
            subtitle={rtl ? 'إظهار حالة الاتصال للآخرين' : 'Show your online status to others'}
            rightElement={
              <Switch
                value={settings.showOnlineStatus}
                onValueChange={(value) => handleSettingChange('showOnlineStatus', value)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={settings.showOnlineStatus ? COLORS.primary : COLORS.gray400}
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="shield-checkmark"
            title={rtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            onPress={() => {
              Alert.alert(
                rtl ? 'سياسة الخصوصية' : 'Privacy Policy',
                rtl ? 'ستفتح سياسة الخصوصية في المتصفح' : 'Privacy policy will open in browser'
              );
            }}
          />
          
          <SettingItem
            icon="document-text"
            title={rtl ? 'شروط الخدمة' : 'Terms of Service'}
            onPress={() => {
              Alert.alert(
                rtl ? 'شروط الخدمة' : 'Terms of Service',
                rtl ? 'ستفتح شروط الخدمة في المتصفح' : 'Terms of service will open in browser'
              );
            }}
          />
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {rtl ? 'تفضيلات التطبيق' : 'App Preferences'}
          </Text>
          
          <SettingItem
            icon="moon"
            title={rtl ? 'الوضع الليلي' : 'Dark Mode'}
            subtitle={rtl ? 'تفعيل الوضع الليلي' : 'Enable dark theme'}
            rightElement={
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => handleSettingChange('darkMode', value)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={settings.darkMode ? COLORS.primary : COLORS.gray400}
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="cash"
            title={rtl ? 'السماح بالعروض' : 'Allow Offers'}
            subtitle={rtl ? 'السماح للمشترين بعرض أسعار' : 'Allow buyers to make price offers'}
            rightElement={
              <Switch
                value={settings.allowOffers}
                onValueChange={(value) => handleSettingChange('allowOffers', value)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={settings.allowOffers ? COLORS.primary : COLORS.gray400}
              />
            }
            showArrow={false}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {rtl ? 'الدعم والمساعدة' : 'Support & Help'}
          </Text>
          
          <SettingItem
            icon="help-circle"
            title={rtl ? 'مركز المساعدة' : 'Help Center'}
            onPress={() => {
              Alert.alert(
                rtl ? 'مركز المساعدة' : 'Help Center',
                rtl ? 'سيفتح مركز المساعدة قريباً' : 'Help center will be available soon'
              );
            }}
          />
          
          <SettingItem
            icon="chatbubble"
            title={rtl ? 'تواصل معنا' : 'Contact Us'}
            onPress={() => {
              Alert.alert(
                rtl ? 'تواصل معنا' : 'Contact Us',
                rtl ? 'البريد الإلكتروني: support@souqplus.com' : 'Email: support@souqplus.com'
              );
            }}
          />
          
          <SettingItem
            icon="star"
            title={rtl ? 'قيم التطبيق' : 'Rate App'}
            onPress={() => {
              Alert.alert(
                rtl ? 'شكراً لك' : 'Thank You',
                rtl ? 'شكراً لاستخدام سوق+' : 'Thank you for using Souq+'
              );
            }}
          />
          
          <SettingItem
            icon="information-circle"
            title={rtl ? 'حول التطبيق' : 'About App'}
            subtitle={rtl ? 'الإصدار 1.0.0' : 'Version 1.0.0'}
            onPress={() => {
              Alert.alert(
                rtl ? 'سوق+' : 'Souq+',
                rtl ? 'منصة التسوق المتميزة للشرق الأوسط\nالإصدار 1.0.0' : 'Premium marketplace for the Middle East\nVersion 1.0.0'
              );
            }}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {rtl ? 'إجراءات الحساب' : 'Account Actions'}
          </Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash" size={20} color={COLORS.error} />
            <Text style={styles.deleteText}>
              {rtl ? 'حذف الحساب' : 'Delete Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LanguageModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  settingSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.error,
    marginLeft: SPACING.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  deleteText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.error,
    marginLeft: SPACING.md,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  languageOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  languageNameSelected: {
    color: COLORS.primary,
  },
  languageNativeName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  languageNativeNameSelected: {
    color: COLORS.primary,
  },
});

export default SettingsScreen; 