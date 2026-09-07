import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AGE_OPTIONS = [
  { label: 'All Ages', value: '' },
  { label: '0 - 2 Years (Toddler)', value: '2' },
  { label: '3 - 5 Years (Preschool)', value: '4' },
  { label: '6 - 8 Years (Kids)', value: '8' },
  { label: '9 - 12 Years (Tweens)', value: '10' },
  { label: '13 - 16 Years (Teens)', value: '14' },
];

const LANGUAGE_OPTIONS = [
  { label: 'All Languages', value: '' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'English', value: 'English' },
  { label: 'Marathi', value: 'Marathi' },
  { label: 'Gujarati', value: 'Gujarati' },
  { label: 'Tamil', value: 'Tamil' },
  { label: 'Telugu', value: 'Telugu' },
  { label: 'Kannada', value: 'Kannada' },
  { label: 'Malayalam', value: 'Malayalam' },
  { label: 'Bengali', value: 'Bengali' },
  { label: 'Punjabi', value: 'Punjabi' },
];

const CITY_OPTIONS = [
  { label: 'All Cities', value: '' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Bangalore', value: 'Bangalore' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Chennai', value: 'Chennai' },
  { label: 'Kolkata', value: 'Kolkata' },
  { label: 'Pune', value: 'Pune' },
  { label: 'Ahmedabad', value: 'Ahmedabad' },
  { label: 'Jaipur', value: 'Jaipur' },
];

const FilterModal = ({
  visible,
  filterType, // 'age' | 'language' | 'city'
  currentAge,
  currentLanguage,
  currentCity,
  onSelectOption,
  onClose
}) => {
  let title = 'Filter Options';
  let options = [];
  let currentValue = '';

  if (filterType === 'age') {
    title = 'Select Age Filter';
    options = AGE_OPTIONS;
    currentValue = currentAge;
  } else if (filterType === 'language') {
    title = 'Select Language Filter';
    options = LANGUAGE_OPTIONS;
    currentValue = currentLanguage;
  } else if (filterType === 'city') {
    title = 'Select City Filter';
    options = CITY_OPTIONS;
    currentValue = currentCity;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={styles.sheetContainer}>
            {/* Top Drag Handle Bar */}
            <View style={styles.handleBar} />

            {/* Header Row */}
            <View style={styles.headerRow}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Vertical List of Filter Options */}
            <FlatList
              data={options}
              keyExtractor={(item, idx) => item.value || `opt-${idx}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = currentValue === item.value;

                return (
                  <TouchableOpacity
                    style={[styles.optionCard, isSelected && styles.selectedOptionCard]}
                    activeOpacity={0.8}
                    onPress={() => {
                      onSelectOption(filterType, item.value);
                      onClose();
                    }}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[styles.bulletPoint, isSelected && styles.selectedBullet]}>
                        {isSelected && <Ionicons name="checkmark" size={13} color="#FFF" />}
                      </View>
                      <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                        {item.label}
                      </Text>
                    </View>

                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#6C5CE7" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            {/* Reset Filter Footer if selected */}
            {currentValue ? (
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => {
                    onSelectOption(filterType, '');
                    onClose();
                  }}
                >
                  <Text style={styles.clearBtnText}>Reset Filter</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    maxHeight: SCREEN_HEIGHT * 0.78,
    minHeight: SCREEN_HEIGHT * 0.45,
  },
  handleBar: {
    width: 48,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7F56D9',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EBEBEB',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  selectedOptionCard: {
    backgroundColor: '#F3F0FF',
    borderWidth: 1.5,
    borderColor: '#6C5CE7',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulletPoint: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#A0A0B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBullet: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  selectedOptionText: {
    color: '#6C5CE7',
    fontWeight: '700',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearBtn: {
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#FF4757',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default FilterModal;
