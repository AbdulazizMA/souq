import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  Share,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { isRTL } from '../utils/i18n';
import { Listing } from '../types';
import Button from '../components/Button';

const { width: screenWidth } = Dimensions.get('window');

interface ListingDetailScreenProps {
  route: {
    params: {
      listing: Listing;
    };
  };
  navigation: any;
}

const ListingDetailScreen: React.FC<ListingDetailScreenProps> = ({ route, navigation }) => {
  const { listing } = route.params;
  const { t } = useTranslation('common');
  const rtl = isRTL();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentImageIndex(index);
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? t('listing.removeFromFavorites') : t('listing.addToFavorites'),
      isFavorite 
        ? rtl ? 'تم إزالة الإعلان من المفضلة' : 'Removed from favorites'
        : rtl ? 'تم إضافة الإعلان للمفضلة' : 'Added to favorites'
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${listing.title} - ${listing.price} ${t('common.currency')}\n\nCheck out this item on Souq+`,
        title: listing.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReport = () => {
    Alert.alert(
      t('listing.report'),
      rtl ? 'هل تريد الإبلاغ عن هذا الإعلان؟' : 'Do you want to report this listing?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('listing.report'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              rtl ? 'تم الإبلاغ' : 'Reported',
              rtl ? 'شكراً لك، سنراجع الإعلان' : 'Thank you, we will review this listing'
            );
          },
        },
      ]
    );
  };

  const handleMakeOffer = () => {
    if (!offerAmount.trim()) return;

    Alert.alert(
      rtl ? 'تأكيد العرض' : 'Confirm Offer',
      rtl 
        ? `هل تريد عرض ${offerAmount} ${t('common.currency')} على هذا المنتج؟`
        : `Do you want to offer ${offerAmount} ${t('common.currency')} for this item?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: rtl ? 'إرسال العرض' : 'Send Offer',
          onPress: () => {
            setShowOfferModal(false);
            setOfferAmount('');
            Alert.alert(
              rtl ? 'تم إرسال العرض' : 'Offer Sent',
              rtl ? 'تم إرسال عرضك للبائع' : 'Your offer has been sent to the seller'
            );
          },
        },
      ]
    );
  };

  const handleContactSeller = () => {
    setShowContactModal(false);
    // Navigate to messages screen with this seller
    navigation.navigate('Messages');
  };

  const formatCondition = (condition: string) => {
    const conditions: { [key: string]: { en: string; ar: string } } = {
      new: { en: 'New', ar: 'جديد' },
      likeNew: { en: 'Like New', ar: 'ممتاز' },
      good: { en: 'Good', ar: 'جيد جداً' },
      fair: { en: 'Fair', ar: 'جيد' },
      poor: { en: 'Poor', ar: 'مقبول' },
    };
    return rtl ? conditions[condition]?.ar : conditions[condition]?.en;
  };

  const OfferModal = () => (
    <Modal
      visible={showOfferModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowOfferModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {t('listing.makeOffer')}
          </Text>
          <TouchableOpacity onPress={handleMakeOffer} disabled={!offerAmount.trim()}>
            <Text style={[
              styles.sendOfferText,
              !offerAmount.trim() && styles.sendOfferTextDisabled
            ]}>
              {rtl ? 'إرسال' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <Text style={styles.offerModalTitle}>
            {listing.title}
          </Text>
          <Text style={styles.offerModalPrice}>
            {rtl ? 'السعر المطلوب:' : 'Asking Price:'} {listing.price} {t('common.currency')}
          </Text>
          
          <View style={styles.offerInputContainer}>
            <Text style={styles.offerInputLabel}>
              {rtl ? 'عرضك' : 'Your Offer'}
            </Text>
            <View style={styles.offerInputWrapper}>
              <TextInput
                style={styles.offerInput}
                placeholder="0"
                value={offerAmount}
                onChangeText={setOfferAmount}
                keyboardType="numeric"
                autoFocus
              />
              <Text style={styles.currencyLabel}>{t('common.currency')}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const ContactModal = () => (
    <Modal
      visible={showContactModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowContactModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {t('listing.contactSeller')}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.modalContent}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {listing.seller.fullName.charAt(0)}
              </Text>
            </View>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>
                {listing.seller.fullName}
                {listing.seller.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                )}
              </Text>
              <Text style={styles.sellerRating}>
                ★ {listing.seller.rating} ({listing.seller.reviewCount} {rtl ? 'مراجعة' : 'reviews'})
              </Text>
            </View>
          </View>
          
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactOption} onPress={handleContactSeller}>
              <Ionicons name="chatbubble" size={24} color={COLORS.primary} />
              <Text style={styles.contactOptionText}>
                {rtl ? 'إرسال رسالة' : 'Send Message'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption} onPress={() => {
              setShowContactModal(false);
              Alert.alert(
                rtl ? 'الاتصال' : 'Call',
                rtl ? 'ستتمكن من الاتصال قريباً' : 'Calling feature will be available soon'
              );
            }}>
              <Ionicons name="call" size={24} color={COLORS.primary} />
              <Text style={styles.contactOptionText}>
                {rtl ? 'اتصال' : 'Call'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name={rtl ? 'chevron-forward' : 'chevron-back'}
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleFavoritePress}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? COLORS.error : COLORS.textPrimary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleReport}>
            <Ionicons name="flag-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
          >
            {listing.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
          
          {listing.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {listing.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          )}
          
          {listing.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>
                {rtl ? 'مميز' : 'Featured'}
              </Text>
            </View>
          )}
        </View>

        {/* Listing Info */}
        <View style={styles.listingInfo}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>
            {listing.price} {t('common.currency')}
          </Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {rtl ? listing.category.nameAr : listing.category.name}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {formatCondition(listing.condition)}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {listing.location.city}
              </Text>
            </View>
          </View>
          
          <View style={styles.stats}>
            <Text style={styles.statText}>
              {listing.viewCount} {t('listing.viewCount')}
            </Text>
            <Text style={styles.statText}>
              {listing.favoriteCount} {t('listing.favoriteCount')}
            </Text>
            <Text style={styles.statText}>
              {new Date(listing.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('listing.description')}
          </Text>
          <Text style={styles.description}>
            {listing.description}
          </Text>
          
          {listing.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {listing.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {rtl ? 'معلومات البائع' : 'Seller Information'}
          </Text>
          
          <View style={styles.sellerCard}>
            <View style={styles.sellerHeader}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>
                  {listing.seller.fullName.charAt(0)}
                </Text>
              </View>
              
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>
                  {listing.seller.fullName}
                  {listing.seller.isVerified && (
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  )}
                </Text>
                <Text style={styles.sellerRating}>
                  ★ {listing.seller.rating} ({listing.seller.reviewCount} {rtl ? 'مراجعة' : 'reviews'})
                </Text>
                <Text style={styles.sellerJoinDate}>
                  {rtl ? 'عضو منذ' : 'Member since'} {new Date(listing.seller.joinedDate).getFullYear()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => setShowContactModal(true)}
        >
          <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
          <Text style={styles.contactButtonText}>
            {t('listing.contactSeller')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.offerButton}
          onPress={() => setShowOfferModal(true)}
        >
          <Ionicons name="cash" size={20} color={COLORS.white} />
          <Text style={styles.offerButtonText}>
            {t('listing.makeOffer')}
          </Text>
        </TouchableOpacity>
      </View>

      <OfferModal />
      <ContactModal />
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: screenWidth,
    height: 300,
    backgroundColor: COLORS.gray100,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    opacity: 0.5,
  },
  activeIndicator: {
    opacity: 1,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  featuredText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  listingInfo: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  statText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  sellerCard: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  sellerAvatarText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sellerRating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  sellerJoinDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    gap: SPACING.sm,
  },
  contactButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
  },
  offerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  offerButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.white,
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
  sendOfferText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  sendOfferTextDisabled: {
    color: COLORS.gray400,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  offerModalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  offerModalPrice: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  offerInputContainer: {
    marginBottom: SPACING.xl,
  },
  offerInputLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  offerInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  offerInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  currencyLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  contactOptions: {
    gap: SPACING.md,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  contactOptionText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
});

export default ListingDetailScreen; 