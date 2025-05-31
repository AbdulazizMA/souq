import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { changeLanguage, isRTL } from '../../utils/i18n';
import Button from '../../components/Button';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation('common');
  const rtl = isRTL();

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language);
  };

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.gradient}
      >
        {/* Language Selector */}
        <View style={[styles.languageContainer, rtl && styles.languageContainerRTL]}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              i18n.language === 'en' && styles.languageButtonActive,
            ]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text
              style={[
                styles.languageText,
                i18n.language === 'en' && styles.languageTextActive,
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              i18n.language === 'ar' && styles.languageButtonActive,
            ]}
            onPress={() => handleLanguageChange('ar')}
          >
            <Text
              style={[
                styles.languageText,
                i18n.language === 'ar' && styles.languageTextActive,
              ]}
            >
              العربية
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logo and App Name */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>سوق+</Text>
          </View>
          <Text style={styles.appName}>{t('app.name')}</Text>
          <Text style={styles.tagline}>{t('app.tagline')}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🛍️</Text>
            </View>
            <Text style={styles.featureText}>
              {rtl ? 'تسوق بأمان وثقة' : 'Shop with confidence'}
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>💬</Text>
            </View>
            <Text style={styles.featureText}>
              {rtl ? 'تواصل مباشر مع البائعين' : 'Chat directly with sellers'}
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>📍</Text>
            </View>
            <Text style={styles.featureText}>
              {rtl ? 'اعثر على العناصر القريبة منك' : 'Find items near you'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('auth.login')}
            onPress={handleGetStarted}
            variant="secondary"
            size="large"
            style={styles.button}
          />
          <Button
            title={t('auth.createAccount')}
            onPress={handleCreateAccount}
            variant="outline"
            size="large"
            style={styles.button}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  languageContainerRTL: {
    justifyContent: 'flex-start',
  },
  languageButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageButtonActive: {
    backgroundColor: COLORS.white,
  },
  languageText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  languageTextActive: {
    color: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xxxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoText: {
    fontSize: 36,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: SPACING.xxxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  button: {
    marginBottom: SPACING.md,
  },
  outlineButton: {
    borderColor: COLORS.white,
  },
});

export default WelcomeScreen; 