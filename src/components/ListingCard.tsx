import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { isRTL } from '../utils/i18n';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  style?: ViewStyle;
  compact?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onPress,
  onFavoritePress,
  isFavorite = false,
  style,
  compact = false,
}) => {
  const rtl = isRTL();

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const cardStyle: ViewStyle = {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  };

  const imageContainerStyle: ViewStyle = {
    position: 'relative',
    height: compact ? 120 : 200,
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  };

  const favoriteButtonStyle: ViewStyle = {
    position: 'absolute',
    top: SPACING.sm,
    right: rtl ? undefined : SPACING.sm,
    left: rtl ? SPACING.sm : undefined,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.xs,
    ...SHADOWS.small,
  };

  const featuredBadgeStyle: ViewStyle = {
    position: 'absolute',
    top: SPACING.sm,
    left: rtl ? undefined : SPACING.sm,
    right: rtl ? SPACING.sm : undefined,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  };

  const contentStyle: ViewStyle = {
    padding: SPACING.md,
  };

  const titleStyle: TextStyle = {
    fontSize: compact ? TYPOGRAPHY.fontSize.sm : TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: rtl ? 'right' : 'left',
  };

  const priceStyle: TextStyle = {
    fontSize: compact ? TYPOGRAPHY.fontSize.md : TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: rtl ? 'right' : 'left',
  };

  const locationStyle: TextStyle = {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textAlign: rtl ? 'right' : 'left',
  };

  const footerStyle: ViewStyle = {
    flexDirection: rtl ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const timeStyle: TextStyle = {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  };

  const sellerStyle: ViewStyle = {
    flexDirection: rtl ? 'row-reverse' : 'row',
    alignItems: 'center',
  };

  const sellerTextStyle: TextStyle = {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: rtl ? 0 : SPACING.xs,
    marginRight: rtl ? SPACING.xs : 0,
  };

  return (
    <TouchableOpacity style={[cardStyle, style]} onPress={onPress} activeOpacity={0.9}>
      <View style={imageContainerStyle}>
        <Image
          source={{ uri: listing.images[0] || 'https://via.placeholder.com/300x200' }}
          style={imageStyle}
        />
        
        {listing.isFeatured && (
          <LinearGradient
            colors={[COLORS.secondary, COLORS.secondaryDark]}
            style={featuredBadgeStyle}
          >
            <Text style={{ color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.xs, fontWeight: TYPOGRAPHY.fontWeight.semibold }}>
              Featured
            </Text>
          </LinearGradient>
        )}
        
        {onFavoritePress && (
          <TouchableOpacity style={favoriteButtonStyle} onPress={onFavoritePress}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? COLORS.error : COLORS.gray500}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={contentStyle}>
        <Text style={titleStyle} numberOfLines={2}>
          {listing.title}
        </Text>
        
        <Text style={priceStyle}>
          {formatPrice(listing.price, listing.currency || 'SAR')}
        </Text>
        
        <View style={locationStyle}>
          <Text style={locationStyle}>
            <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
            {' '}{listing.location.city}
          </Text>
        </View>
        
        <View style={footerStyle}>
          <Text style={timeStyle}>
            {formatTimeAgo(listing.createdAt)}
          </Text>
          
          <View style={sellerStyle}>
            {listing.seller.isVerified && (
              <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
            )}
            <Text style={sellerTextStyle}>
              {listing.seller.fullName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListingCard; 