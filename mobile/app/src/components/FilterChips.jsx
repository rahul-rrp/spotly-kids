import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const CITIES = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];
const LANGUAGES = ['All', 'Hindi', 'English', 'Telugu'];
const CATEGORIES = ['All', 'OTT Show', 'TV Serial', 'Ad Commercial', 'Print Shoot', 'Movie', 'Digital'];
const AGES = ['All', '4', '6', '8', '10', '12', '14'];

const FilterChips = ({ selectedCity, onSelectCity, selectedAge, onSelectAge, selectedLanguage, onSelectLanguage, selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      {/* Category Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {CATEGORIES.map((cat) => {
            const isSelected = (selectedCategory === cat) || (!selectedCategory && cat === 'All');
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isSelected && styles.activeChip]}
                onPress={() => onSelectCategory(cat === 'All' ? '' : cat)}
              >
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* City Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>City</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {CITIES.map((city) => {
            const isSelected = (selectedCity === city) || (!selectedCity && city === 'All');
            return (
              <TouchableOpacity
                key={city}
                style={[styles.chip, isSelected && styles.activeChip]}
                onPress={() => onSelectCity(city === 'All' ? '' : city)}
              >
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>{city}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Age Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Age Filter</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {AGES.map((age) => {
            const isSelected = (selectedAge === age) || (!selectedAge && age === 'All');
            return (
              <TouchableOpacity
                key={age}
                style={[styles.chip, isSelected && styles.activeChip]}
                onPress={() => onSelectAge(age === 'All' ? '' : age)}
              >
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                  {age === 'All' ? 'All Ages' : `${age} Yrs`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  filterSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888899',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginLeft: 16,
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: '#F0F0F6',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E2EC',
  },
  activeChip: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555566',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
});

export default FilterChips;
