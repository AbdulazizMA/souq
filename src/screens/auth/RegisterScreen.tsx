import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { AuthStackParamList } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { isRTL } from '../../utils/i18n';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { AuthContext } from '../../navigation/AppNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = rtl ? 'الاسم مطلوب' : 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = rtl ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = rtl ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = rtl ? 'البريد الإلكتروني غير صحيح' : 'Email is invalid';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = rtl ? 'رقم الجوال مطلوب' : 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = rtl ? 'رقم الجوال غير صحيح' : 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = rtl ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = rtl ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = rtl ? 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام' : 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = rtl ? 'تأكيد كلمة المرور مطلوب' : 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = rtl ? 'كلمة المرور غير متطابقة' : 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user data object
      const userData = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        joinedDate: new Date(),
      };

      // Use the login function from AuthContext to authenticate the user
      await login(userData);

      // Show success message
      Alert.alert(
        rtl ? 'تم إنشاء الحساب' : 'Account Created',
        rtl ? 'تم إنشاء حسابك بنجاح!' : 'Your account has been created successfully!',
        [{ text: rtl ? 'حسناً' : 'OK' }]
      );

    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        rtl ? 'خطأ' : 'Error',
        rtl ? 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.' : 'An error occurred while creating your account. Please try again.',
        [{ text: rtl ? 'حسناً' : 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={[styles.header, rtl && styles.headerRTL]}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons
                name={rtl ? 'chevron-forward' : 'chevron-back'}
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{t('auth.createAccount')}</Text>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>سوق+</Text>
            </View>
            <Text style={styles.welcomeText}>
              {rtl ? 'انضم إلى منصة التسوق المتميزة' : 'Join the premium marketplace'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label={t('auth.fullName')}
              placeholder={rtl ? 'أحمد محمد' : 'John Doe'}
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              error={errors.fullName}
              leftIcon="person-outline"
            />

            <Input
              label={t('auth.email')}
              placeholder="example@email.com"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <Input
              label={t('auth.phoneNumber')}
              placeholder="+966 50 123 4567"
              value={formData.phoneNumber}
              onChangeText={(value) => updateFormData('phoneNumber', value)}
              error={errors.phoneNumber}
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />

            <Input
              label={t('auth.password')}
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              error={errors.password}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Input
              label={t('auth.confirmPassword')}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              error={errors.confirmPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Button
              title={t('auth.createAccount')}
              onPress={handleRegister}
              loading={loading}
              size="large"
              style={styles.registerButton}
            />
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            {rtl 
              ? 'بإنشاء حساب، فإنك توافق على شروط الخدمة وسياسة الخصوصية'
              : 'By creating an account, you agree to our Terms of Service and Privacy Policy'
            }
          </Text>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              {t('auth.alreadyHaveAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>
                {t('auth.login')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoText: {
    fontSize: 24,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.lg,
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  termsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  loginText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});

export default RegisterScreen; 