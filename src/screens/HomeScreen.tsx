import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { isRTL } from '../utils/i18n';
import { Listing, Category } from '../types';
import ListingCard from '../components/ListingCard';
import Input from '../components/Input';

// Mock data - replace with actual API calls
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max',
    description: 'Excellent condition, barely used',
    price: 4500,
    currency: 'SAR',
    category: { id: '1', name: 'Electronics', nameAr: 'الإلكترونيات', icon: 'phone-portrait' },
    condition: 'likeNew',
    images: ['https://via.placeholder.com/300x200'],
    location: { 
      latitude: 24.7136, 
      longitude: 46.6753, 
      address: 'Riyadh', 
      city: 'Riyadh', 
      country: 'Saudi Arabia',
      coordinates: { latitude: 24.7136, longitude: 46.6753 }
    },
    seller: { id: '1', email: 'seller@example.com', fullName: 'Ahmed Al-Rashid', phoneNumber: '+966501234567', isVerified: true, rating: 4.8, reviewCount: 25, joinedDate: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
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
    currency: 'SAR',
    category: { id: 'vehicles', name: 'Vehicles', nameAr: 'سيارات ومركبات', icon: 'car' },
    condition: 'good',
    images: ['https://via.placeholder.com/300x200'],
    location: { 
      latitude: 24.7136, 
      longitude: 46.6753, 
      address: 'Jeddah', 
      city: 'Jeddah', 
      country: 'Saudi Arabia',
      coordinates: { latitude: 24.7136, longitude: 46.6753 }
    },
    seller: { id: '2', email: 'seller2@example.com', fullName: 'Sara Mohammed', phoneNumber: '+966501234568', isVerified: true, rating: 4.9, reviewCount: 18, joinedDate: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isFeatured: false,
    viewCount: 89,
    favoriteCount: 12,
    tags: ['Toyota', 'Camry', 'Sedan'],
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', nameAr: 'الإلكترونيات', icon: 'phone-portrait' },
  { id: '2', name: 'Vehicles', nameAr: 'المركبات', icon: 'car' },
  { id: '3', name: 'Real Estate', nameAr: 'العقارات', icon: 'home' },
  { id: '4', name: 'Fashion', nameAr: 'الأزياء', icon: 'shirt' },
  { id: '5', name: 'Home & Garden', nameAr: 'المنزل والحديقة', icon: 'leaf' },
  { id: '6', name: 'Sports', nameAr: 'الرياضة', icon: 'football' },
];

const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [listings] = useState<Listing[]>(mockListings);
  const [featuredListings] = useState<Listing[]>(
    mockListings.filter(listing => listing.isFeatured)
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (navigation) {
      navigation.navigate('SearchStack', { screen: 'Search' });
    } else {
      Alert.alert(t('common.search'), rtl ? 'البحث متاح في التطبيق الكامل' : 'Search available in full app');
    }
  };

  const handleCategoryPress = (category: Category) => {
    if (navigation) {
      navigation.navigate('SearchStack', { screen: 'Search', params: { category: category.id } });
    } else {
      Alert.alert(category.name, rtl ? 'البحث متاح في التطبيق الكامل' : 'Search available in full app');
    }
  };

  const handleListingPress = (listing: Listing) => {
    if (navigation) {
      navigation.navigate('ListingDetail', { listing });
    } else {
      Alert.alert(listing.title, rtl ? 'تفاصيل الإعلان متاحة في التطبيق الكامل' : 'Listing details available in full app');
    }
  };

  const handleFavoritePress = (listingId: string) => {
    Alert.alert(
      rtl ? 'المفضلة' : 'Favorites',
      rtl ? 'تم إضافة/إزالة الإعلان من المفضلة' : 'Added/removed from favorites'
    );
  };

  const handleNotificationPress = () => {
    if (navigation) {
      navigation.navigate('Notifications');
    } else {
      Alert.alert(
        rtl ? 'الإشعارات' : 'Notifications',
        rtl ? 'الإشعارات متاحة في التطبيق الكامل' : 'Notifications available in full app'
      );
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.categoryText} numberOfLines={2}>
        {rtl ? item.nameAr : item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderListingItem = ({ item }: { item: Listing }) => (
    <ListingCard
      listing={item}
      onPress={() => handleListingPress(item)}
      onFavoritePress={() => handleFavoritePress(item.id)}
      style={styles.listingCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{t('home.welcomeBack')}</Text>
              <Text style={styles.appName}>{t('app.name')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={handleNotificationPress}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <Input
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            rightIcon="options-outline"
            onRightIconPress={handleSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.popularCategories')}</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Items */}
        {featuredListings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.featuredItems')}</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredListings}
              renderItem={renderListingItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}

        {/* Recent Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.newArrivals')}</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onPress={() => handleListingPress(listing)}
              onFavoritePress={() => handleFavoritePress(listing.id)}
              style={styles.listingCard}
            />
          ))}
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  notificationButton: {
    position: 'relative',
    padding: SPACING.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  searchInput: {
    marginBottom: 0,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  viewAllText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  featuredList: {
    paddingHorizontal: SPACING.lg,
  },
  listingCard: {
    marginHorizontal: SPACING.lg,
    width: 280,
  },
});

export default HomeScreen; 