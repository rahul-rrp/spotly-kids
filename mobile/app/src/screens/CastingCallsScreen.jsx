import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchCastingCalls, clearSession, getSession } from '../services/api';
import CastingCard from '../components/CastingCard';
import ProPaywallModal from '../components/ProPaywallModal';
import ApplyModal from '../components/ApplyModal';
import FilterModal from '../components/FilterModal';
import BottomNavigation from '../components/BottomNavigation';

const CastingCallsScreen = ({ navigation }) => {
  const [castings, setCastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('');

  // Modals state
  const [showProModal, setShowProModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState('city');
  const [selectedCasting, setSelectedCasting] = useState(null);

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    loadUserSession();
    fetchCalls('', '', '', '');
  }, []);

  const loadUserSession = async () => {
    const { user: userData } = await getSession();
    setUser(userData);
  };

  const fetchCalls = async (searchTerm, cityTerm, ageTerm, langTerm, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const params = {};
      if (searchTerm && searchTerm.trim()) params.search = searchTerm.trim();
      if (cityTerm) params.city = cityTerm;
      if (ageTerm) params.age = ageTerm;
      if (langTerm) params.language = langTerm;

      const res = await fetchCastingCalls(params);
      if (res.success && Array.isArray(res.data)) {
        setCastings(res.data);
      }
    } catch (err) {
      console.error('Fetch casting calls error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchCalls(text, city, age, language);
    }, 400);
  };

  const handleOpenFilterModal = (type) => {
    setActiveFilterType(type);
    setShowFilterModal(true);
  };

  const handleSelectFilterOption = (type, val) => {
    if (type === 'age') {
      setAge(val);
      fetchCalls(search, city, val, language);
    } else if (type === 'language') {
      setLanguage(val);
      fetchCalls(search, city, age, val);
    } else if (type === 'city') {
      setCity(val);
      fetchCalls(search, val, age, language);
    }
  };

  const handleLogout = async () => {
    await clearSession();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleApplyPress = (item) => {
    setSelectedCasting(item);
    setShowApplyModal(true);
  };

  const handleUnlockProPress = (item) => {
    setShowProModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <FlatList
          data={castings}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {/* Top Title Bar */}
              <View style={styles.topTitleBar}>
                <TouchableOpacity style={styles.backCircleBtn} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={22} color="#6C5CE7" />
                </TouchableOpacity>

                <Text style={styles.screenTitle}>Casting Calls</Text>

                <TouchableOpacity style={styles.searchCircleBtn}>
                  <Ionicons name="search" size={20} color="#2D3436" />
                </TouchableOpacity>
              </View>

              {/* Search Input Bar with Filter Icon */}
              <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                  <Ionicons name="search-outline" size={18} color="#888899" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search projects, brands..."
                    placeholderTextColor="#A0A0B0"
                    value={search}
                    onChangeText={handleSearchChange}
                    returnKeyType="search"
                    onSubmitEditing={() => fetchCalls(search, city, age, language)}
                  />
                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearchChange('')}>
                      <Ionicons name="close-circle" size={18} color="#888899" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => handleOpenFilterModal('city')}
                >
                  <Ionicons name="options-outline" size={20} color="#6C5CE7" />
                </TouchableOpacity>
              </View>

              {/* Filter Chips */}
              <View style={styles.filterChipsRow}>
                <TouchableOpacity
                  style={[styles.chip, !city && !age && !language && styles.activeChip]}
                  onPress={() => { setCity(''); setAge(''); setLanguage(''); fetchCalls(search, '', '', ''); }}
                >
                  <Text style={[styles.chipText, !city && !age && !language && styles.activeChipText]}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.chipDropdown, age ? styles.activeChip : null]}
                  onPress={() => handleOpenFilterModal('age')}
                >
                  <Text style={[styles.chipText, age ? styles.activeChipText : null]}>
                    {age ? `Age ${age} yr` : 'Age'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={age ? "#FFF" : "#6C5CE7"} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.chipDropdown, language ? styles.activeChip : null]}
                  onPress={() => handleOpenFilterModal('language')}
                >
                  <Text style={[styles.chipText, language ? styles.activeChipText : null]}>
                    {language || 'Language'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={language ? "#FFF" : "#6C5CE7"} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.chipDropdown, city ? styles.activeChip : null]}
                  onPress={() => handleOpenFilterModal('city')}
                >
                  <Text style={[styles.chipText, city ? styles.activeChipText : null]}>
                    {city || 'City'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={city ? "#FFF" : "#6C5CE7"} />
                </TouchableOpacity>
              </View>

              {/* Free Application Used Banner */}
              <View style={styles.freeBanner}>
                <Text style={styles.freeBannerText}>Today’s free application has been used</Text>
              </View>
            </View>
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchCalls(search, city, age, language, true)}
              colors={['#6C5CE7']}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CastingCard
                item={item}
                onApplyPress={() => handleApplyPress(item)}
                onUnlockProPress={() => handleUnlockProPress(item)}
              />
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6C5CE7" />
                  <Text style={styles.loadingText}>Fetching casting calls...</Text>
                </View>
              ) : (
                <View style={styles.emptyBox}>
                  <Ionicons name="search-outline" size={48} color="#A0A0B0" />
                  <Text style={styles.emptyTitle}>No casting calls found</Text>
                  <Text style={styles.emptySub}>Try adjusting your search query or filter chips.</Text>
                </View>
              )}
            </View>
          )}
        />

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab="castings"
          onTabPress={(tab) => {
            if (tab === 'home') {
              navigation.navigate('Home');
            }
          }}
          onLogout={handleLogout}
        />

        {/* Pro Paywall Modal */}
        <ProPaywallModal
          visible={showProModal}
          onClose={() => setShowProModal(false)}
        />

        {/* Apply Modal with 4 Kids Photos Requirement */}
        <ApplyModal
          visible={showApplyModal}
          castingCall={selectedCasting}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => fetchCalls(search, city, age, language)}
        />

        {/* Filter Bottom Sheet Modal */}
        <FilterModal
          visible={showFilterModal}
          filterType={activeFilterType}
          currentAge={age}
          currentLanguage={language}
          currentCity={city}
          onSelectOption={handleSelectFilterOption}
          onClose={() => setShowFilterModal(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  topTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 10,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#6C5CE7',
  },
  searchCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 6,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FA',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    backgroundColor: '#F5F5FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  chipDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    gap: 4,
  },
  activeChip: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  freeBanner: {
    marginHorizontal: 20,
    backgroundColor: '#F3F0FF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  freeBannerText: {
    color: '#6C5CE7',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 90,
  },
  cardWrapper: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justify: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#6C5CE7',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyBox: {
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#888899',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default CastingCallsScreen;
