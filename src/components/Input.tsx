import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { isRTL } from '../utils/i18n';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const rtl = isRTL();

  const containerStyle: ViewStyle = {
    marginBottom: SPACING.md,
  };

  const labelStyle: TextStyle = {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: rtl ? 'right' : 'left',
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: rtl ? 'row-reverse' : 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: disabled ? COLORS.gray100 : COLORS.white,
    paddingHorizontal: SPACING.md,
    minHeight: multiline ? 80 : 48,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    textAlign: rtl ? 'right' : 'left',
    writingDirection: rtl ? 'rtl' : 'ltr',
    paddingVertical: multiline ? SPACING.sm : 0,
  };

  const errorStyle: TextStyle = {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    textAlign: rtl ? 'right' : 'left',
  };

  const iconStyle = {
    marginHorizontal: SPACING.xs,
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={handleTogglePassword} style={iconStyle}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.gray500}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightIconPress} style={iconStyle}>
          <Ionicons name={rightIcon as any} size={20} color={COLORS.gray500} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[containerStyle, style]}>
      {label && <Text style={labelStyle}>{label}</Text>}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={COLORS.gray500}
            style={iconStyle}
          />
        )}
        
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

export default Input; 