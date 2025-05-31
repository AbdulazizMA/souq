import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { isRTL } from '../utils/i18n';
import { Category, Condition } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', nameAr: 'إلكترونيات', icon: 'phone-portrait' },
  { id: '2', name: 'Vehicles', nameAr: 'سيارات ومركبات', icon: 'car' },
  { id: '3', name: 'Real Estate', nameAr: 'عقارات', icon: 'home' },
  { id: '4', name: 'Fashion', nameAr: 'أزياء وإكسسوارات', icon: 'shirt' },
  { id: '5', name: 'Home & Garden', nameAr: 'منزل وحديقة', icon: 'leaf' },
  { id: '6', name: 'Sports', nameAr: 'رياضة ولياقة', icon: 'football' },
  { id: '7', name: 'Books & Media', nameAr: 'كتب ووسائط', icon: 'book' },
  { id: '8', name: 'Services', nameAr: 'خدمات', icon: 'construct' },
  { id: '9', name: 'Jobs', nameAr: 'وظائف', icon: 'briefcase' },
  { id: '10', name: 'Other', nameAr: 'متنوعة', icon: 'ellipsis-horizontal' },
];

const conditions: { key: Condition; label: string; labelAr: string; description: string; descriptionAr: string }[] = [
  { 
    key: 'new', 
    label: 'New', 
    labelAr: 'جديد',
    description: 'Brand new, never used',
    descriptionAr: 'جديد تماماً، لم يستخدم من قبل'
  },
  { 
    key: 'likeNew', 
    label: 'Like New', 
    labelAr: 'ممتاز',
    description: 'Excellent condition, barely used',
    descriptionAr: 'حالة ممتازة، استخدام قليل جداً'
  },
  { 
    key: 'good', 
    label: 'Good', 
    labelAr: 'جيد جداً',
    description: 'Good condition, some wear',
    descriptionAr: 'حالة جيدة جداً، بعض الاستخدام'
  },
  { 
    key: 'fair', 
    label: 'Fair', 
    labelAr: 'جيد',
    description: 'Fair condition, noticeable wear',
    descriptionAr: 'حالة جيدة، استخدام واضح'
  },
  { 
    key: 'poor', 
    label: 'Poor', 
    labelAr: 'مقبول',
    description: 'Poor condition, heavy wear',
    descriptionAr: 'حالة مقبولة، استخدام كثيف'
  },
];

interface ListingForm {
  title: string;
  description: string;
  price: string;
  category: Category | null;
  condition: Condition | null;
  images: string[];
  tags: string[];
  location: string;
}

const SellScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();

  const [form, setForm] = useState<ListingForm>({
    title: '',
    description: '',
    price: '',
    category: null,
    condition: null,
    images: [],
    tags: [],
    location: '',
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title.trim()) {
      newErrors.title = rtl ? 'العنوان مطلوب' : 'Title is required';
    }

    if (!form.description.trim()) {
      newErrors.description = rtl ? 'الوصف مطلوب' : 'Description is required';
    }

    if (!form.price.trim()) {
      newErrors.price = rtl ? 'السعر مطلوب' : 'Price is required';
    } else if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = rtl ? 'يجب أن يكون السعر رقماً صحيحاً' : 'Price must be a valid number';
    }

    if (!form.category) {
      newErrors.category = rtl ? 'القسم مطلوب' : 'Category is required';
    }

    if (!form.condition) {
      newErrors.condition = rtl ? 'الحالة مطلوبة' : 'Condition is required';
    }

    if (form.images.length === 0) {
      newErrors.images = rtl ? 'يجب إضافة صورة واحدة على الأقل' : 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = async () => {
    if (form.images.length >= 10) {
      Alert.alert(
        rtl ? 'حد أقصى للصور' : 'Image Limit',
        rtl ? 'يمكنك إضافة 10 صور كحد أقصى' : 'You can add maximum 10 images'
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        rtl ? 'إذن مطلوب' : 'Permission Required',
        rtl ? 'نحتاج إذن للوصول لمعرض الصور' : 'We need permission to access your photo library'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri]
      }));
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        rtl ? 'تم النشر بنجاح' : 'Posted Successfully',
        rtl ? 'تم نشر إعلانك بنجاح وسيتم مراجعته قريباً' : 'Your listing has been posted successfully and will be reviewed soon',
        [
          {
            text: rtl ? 'حسناً' : 'OK',
            onPress: () => {
              // Reset form
              setForm({
                title: '',
                description: '',
                price: '',
                category: null,
                condition: null,
                images: [],
                tags: [],
                location: '',
              });
              setErrors({});
              
              // Navigate to home or listings
              if (navigation) {
                navigation.navigate('HomeStack');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        rtl ? 'خطأ' : 'Error',
        rtl ? 'حدث خطأ أثناء نشر الإعلان' : 'An error occurred while posting your listing'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const CategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {rtl ? 'اختر القسم' : 'Select Category'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <FlatList
          data={mockCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryOption,
                form.category?.id === item.id && styles.categoryOptionSelected
              ]}
              onPress={() => {
                setForm(prev => ({ ...prev, category: item }));
                setErrors(prev => ({ ...prev, category: '' }));
                setShowCategoryModal(false);
              }}
            >
              <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
              <Text style={styles.categoryOptionText}>
                {rtl ? item.nameAr : item.name}
              </Text>
              {form.category?.id === item.id && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.modalContent}
        />
      </SafeAreaView>
    </Modal>
  );

  const ConditionModal = () => (
    <Modal
      visible={showConditionModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowConditionModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {rtl ? 'اختر الحالة' : 'Select Condition'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <FlatList
          data={conditions}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.conditionOption,
                form.condition === item.key && styles.conditionOptionSelected
              ]}
              onPress={() => {
                setForm(prev => ({ ...prev, condition: item.key }));
                setErrors(prev => ({ ...prev, condition: '' }));
                setShowConditionModal(false);
              }}
            >
              <View style={styles.conditionInfo}>
                <Text style={styles.conditionLabel}>
                  {rtl ? item.labelAr : item.label}
                </Text>
                <Text style={styles.conditionDescription}>
                  {rtl ? item.descriptionAr : item.description}
                </Text>
              </View>
              {form.condition === item.key && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.modalContent}
        />
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {rtl ? 'إضافة إعلان جديد' : 'Create New Listing'}
          </Text>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Images Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {rtl ? 'الصور' : 'Photos'} *
            </Text>
            <Text style={styles.sectionSubtitle}>
              {rtl ? 'أضف حتى 10 صور لإعلانك' : 'Add up to 10 photos for your listing'}
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
              <TouchableOpacity style={styles.addImageButton} onPress={handleImagePicker}>
                <Ionicons name="camera" size={32} color={COLORS.primary} />
                <Text style={styles.addImageText}>
                  {rtl ? 'إضافة صورة' : 'Add Photo'}
                </Text>
              </TouchableOpacity>
              
              {form.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            
            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {rtl ? 'المعلومات الأساسية' : 'Basic Information'}
            </Text>
            
            <Input
              label={rtl ? 'العنوان' : 'Title'}
              placeholder={rtl ? 'أدخل عنوان الإعلان' : 'Enter listing title'}
              value={form.title}
              onChangeText={(text) => {
                setForm(prev => ({ ...prev, title: text }));
                setErrors(prev => ({ ...prev, title: '' }));
              }}
              error={errors.title}
            />
            
            <Input
              label={rtl ? 'الوصف' : 'Description'}
              placeholder={rtl ? 'اكتب وصفاً مفصلاً للمنتج' : 'Write a detailed description'}
              value={form.description}
              onChangeText={(text) => {
                setForm(prev => ({ ...prev, description: text }));
                setErrors(prev => ({ ...prev, description: '' }));
              }}
              multiline
              numberOfLines={4}
              error={errors.description}
            />
            
            <Input
              label={`${rtl ? 'السعر' : 'Price'} (${t('common.currency')})`}
              placeholder="0"
              value={form.price}
              onChangeText={(text) => {
                setForm(prev => ({ ...prev, price: text }));
                setErrors(prev => ({ ...prev, price: '' }));
              }}
              keyboardType="numeric"
              error={errors.price}
            />
          </View>

          {/* Category & Condition */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {rtl ? 'التصنيف والحالة' : 'Category & Condition'}
            </Text>
            
            <TouchableOpacity
              style={[styles.selectButton, errors.category && styles.selectButtonError]}
              onPress={() => setShowCategoryModal(true)}
            >
              <View style={styles.selectButtonContent}>
                {form.category ? (
                  <>
                    <Ionicons name={form.category.icon as any} size={20} color={COLORS.primary} />
                    <Text style={styles.selectButtonText}>
                      {rtl ? form.category.nameAr : form.category.name}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.selectButtonPlaceholder}>
                    {rtl ? 'اختر القسم' : 'Select Category'} *
                  </Text>
                )}
              </View>
              <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={16} color={COLORS.gray400} />
            </TouchableOpacity>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            
            <TouchableOpacity
              style={[styles.selectButton, errors.condition && styles.selectButtonError]}
              onPress={() => setShowConditionModal(true)}
            >
              <View style={styles.selectButtonContent}>
                {form.condition ? (
                  <Text style={styles.selectButtonText}>
                    {rtl ? conditions.find(c => c.key === form.condition)?.labelAr : conditions.find(c => c.key === form.condition)?.label}
                  </Text>
                ) : (
                  <Text style={styles.selectButtonPlaceholder}>
                    {rtl ? 'اختر الحالة' : 'Select Condition'} *
                  </Text>
                )}
              </View>
              <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={16} color={COLORS.gray400} />
            </TouchableOpacity>
            {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {rtl ? 'الكلمات المفتاحية' : 'Tags'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {rtl ? 'أضف كلمات مفتاحية لتسهيل العثور على إعلانك' : 'Add keywords to help people find your listing'}
            </Text>
            
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder={rtl ? 'أضف كلمة مفتاحية' : 'Add a tag'}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
                <Ionicons name="add" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            {form.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {form.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                    <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                      <Ionicons name="close" size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {rtl ? 'الموقع' : 'Location'}
            </Text>
            
            <TouchableOpacity style={styles.locationButton}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.locationButtonText}>
                {rtl ? 'استخدام الموقع الحالي' : 'Use Current Location'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            title={rtl ? 'نشر الإعلان' : 'Post Listing'}
            onPress={handleSubmit}
            loading={isLoading}
            size="large"
            icon={<Ionicons name="checkmark" size={20} color={COLORS.white} />}
          />
        </View>

        <CategoryModal />
        <ConditionModal />
      </KeyboardAvoidingView>
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
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  addImageText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  imageContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  selectButtonError: {
    borderColor: COLORS.error,
  },
  selectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  selectButtonPlaceholder: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    marginRight: SPACING.sm,
  },
  addTagButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
  },
  tagText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight + '10',
  },
  locationButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
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
  categoryOption: {
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
  categoryOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  categoryOptionText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
    flex: 1,
  },
  conditionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  conditionOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  conditionInfo: {
    flex: 1,
  },
  conditionLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  conditionDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
});

export default SellScreen; 