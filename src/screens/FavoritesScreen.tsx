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
import { Listing } from '../types';
import ListingCard from '../components/ListingCard';

// Mock favorite listings
const mockFavoriteListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'Excellent condition iPhone 14 Pro Max with original box and accessories.',
    price: 4500,
    images: ['https://via.placeholder.com/300x200'],
    category: {
      id: 'electronics',
      name: 'Electronics',
      nameAr: 'إلكترونيات',
      icon: 'phone-portrait',
    },
    condition: 'likeNew',
    location: {
      latitude: 24.7136,
      longitude: 46.6753,
      city: 'Riyadh',
      district: 'Al Olaya',
      country: 'Saudi Arabia',
      coordinates: { latitude: 24.7136, longitude: 46.6753 },
    },
    seller: {
      id: 'seller1',
      fullName: 'Ahmed Mohammed',
      email: 'ahmed@example.com',
      phoneNumber: '+966501234567',
      isVerified: true,
      rating: 4.8,
      reviewCount: 24,
      joinedDate: new Date('2023-01-15'),
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true,
    isFeatured: true,
    viewCount: 156,
    favoriteCount: 23,
    tags: ['iPhone', 'Apple', 'Smartphone'],
  },
  {
    id: '2',
    title: 'Toyota Camry 2020',
    description: 'Well maintained Toyota Camry 2020 with low mileage.',
    price: 85000,
    images: ['https://via.placeholder.com/300x200'],
    category: {
      id: 'vehicles',
      name: 'Vehicles',
      nameAr: 'سيارات ومركبات',
      icon: 'car',
    },
    condition: 'good',
    location: {
      latitude: 21.4858,
      longitude: 39.1925,
      city: 'Jeddah',
      district: 'Al Hamra',
      country: 'Saudi Arabia',
      coordinates: { latitude: 21.4858, longitude: 39.1925 },
    },
    seller: {
      id: 'seller2',
      fullName: 'Sara Abdullah',
      email: 'sara@example.com',
      phoneNumber: '+966507654321',
      isVerified: true,
      rating: 4.9,
      reviewCount: 18,
      joinedDate: new Date('2023-03-20'),
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isActive: true,
    isFeatured: false,
    viewCount: 89,
    favoriteCount: 12,
    tags: ['Toyota', 'Camry', 'Sedan'],
  },
  {
    id: '3',
    title: 'MacBook Pro 16" M2',
    description: 'Latest MacBook Pro with M2 chip, perfect for professionals.',
    price: 12000,
    images: ['https://via.placeholder.com/300x200'],
    category: {
      id: 'electronics',
      name: 'Electronics',
      nameAr: 'إلكترونيات',
      icon: 'laptop',
    },
    condition: 'new',
    location: {
      latitude: 26.4207,
      longitude: 50.0888,
      city: 'Dammam',
      district: 'Al Faisaliyah',
      country: 'Saudi Arabia',
      coordinates: { latitude: 26.4207, longitude: 50.0888 },
    },
    seller: {
      id: 'seller3',
      fullName: 'Omar Hassan',
      email: 'omar@example.com',
      phoneNumber: '+966509876543',
      isVerified: false,
      rating: 4.5,
      reviewCount: 8,
      joinedDate: new Date('2023-06-10'),
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    isActive: true,
    isFeatured: true,
    viewCount: 234,
    favoriteCount: 45,
    tags: ['MacBook', 'Apple', 'Laptop'],
  },
];

const FavoritesScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();

  const [favorites, setFavorites] = useState<Listing[]>(mockFavoriteListings);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high'>('newest');

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleListingPress = (listing: Listing) => {
    if (navigation) {
      navigation.navigate('ListingDetail', { listing });
    } else {
      Alert.alert(listing.title, rtl ? 'تفاصيل الإعلان متاحة في التطبيق الكامل' : 'Listing details available in full app');
    }
  };

  const handleRemoveFavorite = (listingId: string) => {
    Alert.alert(
      rtl ? 'إزالة من المفضلة' : 'Remove from Favorites',
      rtl ? 'هل تريد إزالة هذا الإعلان من المفضلة؟' : 'Are you sure you want to remove this item from favorites?',
      [
        { text: rtl ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: rtl ? 'إزالة' : 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => item.id !== listingId));
          },
        },
      ]
    );
  };

  const clearAllFavorites = () => {
    Alert.alert(
      rtl ? 'مسح المفضلة' : 'Clear Favorites',
      rtl ? 'هل تريد مسح جميع العناصر من المفضلة؟' : 'Are you sure you want to clear all favorites?',
      [
        { text: rtl ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: rtl ? 'مسح' : 'Clear',
          style: 'destructive',
          onPress: () => setFavorites([]),
        },
      ]
    );
  };

  const getSortLabel = (sort: string) => {
    const labels = {
      newest: rtl ? 'الأحدث أولاً' : 'Newest First',
      oldest: rtl ? 'الأقدم أولاً' : 'Oldest First',
      price_low: rtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High',
      price_high: rtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low',
    };
    return labels[sort as keyof typeof labels];
  };

  const showSortOptions = () => {
    const options = [
      { key: 'newest', label: getSortLabel('newest') },
      { key: 'oldest', label: getSortLabel('oldest') },
      { key: 'price_low', label: getSortLabel('price_low') },
      { key: 'price_high', label: getSortLabel('price_high') },
    ];

    Alert.alert(
      rtl ? 'ترتيب حسب' : 'Sort By',
      '',
      [
        ...options.map(option => ({
          text: option.label,
          onPress: () => setSortBy(option.key as any),
        })),
        { text: rtl ? 'إلغاء' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <ListingCard
      listing={item}
      onPress={() => handleListingPress(item)}
      onFavoritePress={() => handleRemoveFavorite(item.id)}
      style={styles.listingCard}
      isFavorite={true}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            {t('profile.favorites')}
          </Text>
          <Text style={styles.itemCount}>
            {favorites.length} {rtl ? 'عنصر' : 'items'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={showSortOptions}
          >
            <Ionicons name="funnel-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          {favorites.length > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={clearAllFavorites}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort Info */}
      {favorites.length > 0 && (
        <View style={styles.sortInfo}>
          <Text style={styles.sortText}>
            {rtl ? 'مرتب حسب:' : 'Sorted by:'} {getSortLabel(sortBy)}
          </Text>
        </View>
      )}

      {/* Favorites List */}
      {sortedFavorites.length > 0 ? (
        <FlatList
          data={sortedFavorites}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          style={styles.favoritesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={COLORS.gray400} />
          <Text style={styles.emptyStateText}>
            {rtl ? 'لا توجد عناصر مفضلة' : 'No Favorites Yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {rtl 
              ? 'ابدأ بإضافة العناصر التي تعجبك إلى المفضلة'
              : 'Start adding items you like to your favorites'
            }
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation?.navigate('SearchStack')}
          >
            <Text style={styles.browseButtonText}>
              {rtl ? 'تصفح الإعلانات' : 'Browse Listings'}
            </Text>
          </TouchableOpacity>
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
    flex: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  itemCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortInfo: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.gray100,
  },
  sortText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  favoritesList: {
    flex: 1,
  },
  listContent: {
    paddingVertical: SPACING.md,
  },
  listingCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  browseButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },
});

export default FavoritesScreen; 