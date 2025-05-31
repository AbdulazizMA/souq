import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { isRTL } from '../utils/i18n';
import { Listing, Category, SearchFilters, Condition } from '../types';
import ListingCard from '../components/ListingCard';
import Input from '../components/Input';
import Button from '../components/Button';

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', nameAr: 'إلكترونيات', icon: 'phone-portrait' },
  { id: '2', name: 'Vehicles', nameAr: 'سيارات ومركبات', icon: 'car' },
  { id: '3', name: 'Real Estate', nameAr: 'عقارات', icon: 'home' },
  { id: '4', name: 'Fashion', nameAr: 'أزياء وإكسسوارات', icon: 'shirt' },
  { id: '5', name: 'Home & Garden', nameAr: 'منزل وحديقة', icon: 'leaf' },
  { id: '6', name: 'Sports', nameAr: 'رياضة ولياقة', icon: 'football' },
];

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'Excellent condition, barely used, with original box and accessories',
    price: 4500,
    currency: 'SAR',
    category: mockCategories[0],
    condition: 'likeNew',
    images: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 24.7136,
      longitude: 46.6753,
      city: 'Riyadh',
      district: 'Al Olaya',
      country: 'Saudi Arabia',
      coordinates: { latitude: 24.7136, longitude: 46.6753 },
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
    title: 'MacBook Pro 16" M2',
    description: 'Latest MacBook Pro with M2 chip, perfect for professionals.',
    price: 12000,
    currency: 'SAR',
    category: mockCategories[0], // Electronics
    condition: 'new',
    images: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 24.7136,
      longitude: 46.6753,
      city: 'Riyadh',
      district: 'Al Olaya',
      country: 'Saudi Arabia',
      coordinates: { latitude: 24.7136, longitude: 46.6753 },
    },
    seller: { id: '2', email: 'seller2@example.com', fullName: 'Sara Mohammed', phoneNumber: '+966501234568', isVerified: true, rating: 4.9, reviewCount: 18, joinedDate: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isFeatured: true,
    viewCount: 234,
    favoriteCount: 45,
    tags: ['MacBook', 'Apple', 'Laptop'],
  },
  {
    id: '3',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Brand new Samsung Galaxy S23 Ultra with all accessories.',
    price: 4200,
    currency: 'SAR',
    category: mockCategories[0], // Electronics
    condition: 'good',
    images: ['https://via.placeholder.com/300x200'],
    location: {
      latitude: 24.7136,
      longitude: 46.6753,
      city: 'Riyadh',
      district: 'Al Olaya',
      country: 'Saudi Arabia',
      coordinates: { latitude: 24.7136, longitude: 46.6753 },
    },
    seller: { id: '3', email: 'seller3@example.com', fullName: 'Mohammed Ali', phoneNumber: '+966501234569', isVerified: true, rating: 4.7, reviewCount: 32, joinedDate: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isFeatured: false,
    viewCount: 98,
    favoriteCount: 15,
    tags: ['Samsung', 'Galaxy', 'Android'],
  },
];

const SearchScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(mockListings);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priceLow' | 'priceHigh' | 'distance'>('newest');
  
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 100000,
    condition: [],
    sortBy: 'newest',
  });

  const conditions: { key: Condition; label: string; labelAr: string }[] = [
    { key: 'new', label: 'New', labelAr: 'جديد' },
    { key: 'likeNew', label: 'Like New', labelAr: 'ممتاز' },
    { key: 'good', label: 'Good', labelAr: 'جيد جداً' },
    { key: 'fair', label: 'Fair', labelAr: 'جيد' },
    { key: 'poor', label: 'Poor', labelAr: 'مقبول' },
  ];

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, filters, sortBy]);

  const applyFilters = () => {
    let filtered = mockListings;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(listing => listing.category.id === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(listing =>
      listing.price >= (filters.minPrice || 0) &&
      listing.price <= (filters.maxPrice || 100000)
    );

    // Condition filter
    if (filters.condition && filters.condition.length > 0) {
      filtered = filtered.filter(listing =>
        filters.condition!.includes(listing.condition)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleConditionToggle = (condition: Condition) => {
    const currentConditions = filters.condition || [];
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter(c => c !== condition)
      : [...currentConditions, condition];
    
    setFilters(prev => ({ ...prev, condition: newConditions }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 100000,
      condition: [],
      sortBy: 'newest',
    });
    setSelectedCategory(null);
    setSortBy('newest');
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipSelected
      ]}
      onPress={() => handleCategorySelect(selectedCategory === item.id ? null : item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={16}
        color={selectedCategory === item.id ? COLORS.white : COLORS.primary}
      />
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.categoryChipTextSelected
        ]}
      >
        {rtl ? item.nameAr : item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderListingItem = ({ item }: { item: Listing }) => (
    <ListingCard
      listing={item}
      onPress={() => {
        if (navigation) {
          navigation.navigate('ListingDetail', { listing: item });
        } else {
          console.log('Listing pressed:', item.title);
        }
      }}
      onFavoritePress={() => console.log('Favorite pressed:', item.id)}
      style={styles.listingCard}
    />
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('common.filter')}</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>{t('common.clear')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>{t('listing.price')} ({t('common.currency')})</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={styles.priceInput}
                placeholder={rtl ? 'الحد الأدنى' : 'Min'}
                value={filters.minPrice?.toString()}
                onChangeText={(text) => setFilters(prev => ({ ...prev, minPrice: parseInt(text) || 0 }))}
                keyboardType="numeric"
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder={rtl ? 'الحد الأعلى' : 'Max'}
                value={filters.maxPrice?.toString()}
                onChangeText={(text) => setFilters(prev => ({ ...prev, maxPrice: parseInt(text) || 100000 }))}
                keyboardType="numeric"
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100000}
              value={filters.maxPrice || 100000}
              onValueChange={(value: number) => setFilters(prev => ({ ...prev, maxPrice: Math.round(value) }))}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.gray300}
            />
          </View>

          {/* Condition */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>{t('listing.condition')}</Text>
            <View style={styles.conditionGrid}>
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition.key}
                  style={[
                    styles.conditionChip,
                    filters.condition?.includes(condition.key) && styles.conditionChipSelected
                  ]}
                  onPress={() => handleConditionToggle(condition.key)}
                >
                  <Text
                    style={[
                      styles.conditionChipText,
                      filters.condition?.includes(condition.key) && styles.conditionChipTextSelected
                    ]}
                  >
                    {rtl ? condition.labelAr : condition.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>{t('common.sort')}</Text>
            <View style={styles.sortOptions}>
              {[
                { key: 'newest', label: 'Newest First', labelAr: 'الأحدث أولاً' },
                { key: 'oldest', label: 'Oldest First', labelAr: 'الأقدم أولاً' },
                { key: 'priceLow', label: 'Price: Low to High', labelAr: 'السعر: من الأقل للأعلى' },
                { key: 'priceHigh', label: 'Price: High to Low', labelAr: 'السعر: من الأعلى للأقل' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    sortBy === option.key && styles.sortOptionSelected
                  ]}
                  onPress={() => setSortBy(option.key as any)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === option.key && styles.sortOptionTextSelected
                    ]}
                  >
                    {rtl ? option.labelAr : option.label}
                  </Text>
                  {sortBy === option.key && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            title={t('common.apply')}
            onPress={() => setShowFilters(false)}
            size="large"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Input
          placeholder={t('home.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          rightIcon="options-outline"
          onRightIconPress={() => setShowFilters(true)}
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={[{ id: 'all', name: 'All', nameAr: 'الكل', icon: 'apps' }, ...mockCategories]}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredListings.length} {rtl ? 'نتيجة' : 'results'}
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="funnel-outline" size={16} color={COLORS.primary} />
          <Text style={styles.sortButtonText}>{t('common.filter')}</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={filteredListings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.gray400} />
            <Text style={styles.emptyStateText}>
              {rtl ? 'لا توجد نتائج' : 'No results found'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {rtl ? 'جرب تغيير كلمات البحث أو المرشحات' : 'Try adjusting your search or filters'}
            </Text>
          </View>
        }
      />

      <FilterModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    marginBottom: 0,
  },
  categoriesSection: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.md,
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  categoryChipTextSelected: {
    color: COLORS.white,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  sortButtonText: {
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  resultsList: {
    padding: SPACING.lg,
  },
  listingCard: {
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  clearText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
  },
  priceSeparator: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  conditionChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  conditionChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  conditionChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  conditionChipTextSelected: {
    color: COLORS.white,
  },
  sortOptions: {
    gap: SPACING.sm,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  sortOptionText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  sortOptionTextSelected: {
    color: COLORS.primary,
  },
  modalFooter: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default SearchScreen; 