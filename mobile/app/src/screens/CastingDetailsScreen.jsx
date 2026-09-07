import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchCastingCallById,
  fetchMyChildren,
  createChildProfile,
  submitApplication,
  fetchMyApplications
} from '../services/api';

const CastingDetailsScreen = ({ route, navigation }) => {
  const castingId = route.params?.id;

  const [casting, setCasting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Children & Application state
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  // Add Child Form State
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childCity, setChildCity] = useState('');
  const [addingChild, setAddingChild] = useState(false);
  const [addChildError, setAddChildError] = useState('');

  useEffect(() => {
    loadDetails();
    loadChildrenAndCheckApplication();
  }, [castingId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchCastingCallById(castingId);
      if (res.success && res.data) {
        setCasting(res.data);
      } else {
        setErrorMsg('Casting call details not found.');
      }
    } catch (err) {
      console.error('Fetch details error:', err);
      setErrorMsg('Failed to load casting details.');
    } finally {
      setLoading(false);
    }
  };

  const loadChildrenAndCheckApplication = async () => {
    try {
      const [childRes, appRes] = await Promise.all([
        fetchMyChildren(),
        fetchMyApplications()
      ]);

      if (childRes.success && Array.isArray(childRes.data)) {
        setChildren(childRes.data);
        if (childRes.data.length > 0) {
          setSelectedChildId(childRes.data[0].id);
        }
      }

      if (appRes.success && Array.isArray(appRes.data)) {
        const hasApplied = appRes.data.some(app => app.castingCallId === Number(castingId));
        if (hasApplied) {
          setIsApplied(true);
        }
      }
    } catch (err) {
      console.error('Error fetching children/applications:', err);
    }
  };

  const handleCreateChild = async () => {
    if (!childName.trim() || !childAge.trim() || !childCity.trim()) {
      setAddChildError('Please fill in all child profile fields.');
      return;
    }

    const ageNum = parseInt(childAge);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 18) {
      setAddChildError('Please enter a valid age (0-18).');
      return;
    }

    setAddChildError('');
    setAddingChild(true);

    try {
      const res = await createChildProfile({
        name: childName.trim(),
        age: ageNum,
        city: childCity.trim()
      });

      if (res.success && res.data) {
        setChildren(prev => [res.data, ...prev]);
        setSelectedChildId(res.data.id);
        setShowAddChildModal(false);
        setChildName('');
        setChildAge('');
        setChildCity('');
        Alert.alert('Success', 'Child profile created successfully!');
      } else {
        setAddChildError(res.message || 'Failed to create child profile.');
      }
    } catch (err) {
      console.error('Create child error:', err);
      setAddChildError(err.response?.data?.message || 'Failed to create child profile.');
    } finally {
      setAddingChild(false);
    }
  };

  const handleApply = async () => {
    if (children.length === 0) {
      setShowAddChildModal(true);
      return;
    }

    if (!selectedChildId) {
      Alert.alert('Child Selection', 'Please select a child profile to apply.');
      return;
    }

    setApplying(true);
    try {
      const res = await submitApplication(selectedChildId, castingId);
      if (res.success) {
        setIsApplied(true);
        Alert.alert('Application Submitted! 🎉', 'Application submitted successfully.');
      } else {
        Alert.alert('Notice', res.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Apply error:', err);
      const msg = err.response?.data?.message || 'Error submitting application.';
      Alert.alert('Application Error', msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingArea}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (errorMsg || !casting) {
    return (
      <SafeAreaView style={styles.loadingArea}>
        <Ionicons name="alert-circle-outline" size={48} color="#D63031" />
        <Text style={styles.errorText}>{errorMsg || 'Casting call not found.'}</Text>
        <TouchableOpacity style={styles.backBtnFallback} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Banner */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: casting.imageUrl || 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368' }}
              style={styles.image}
            />
            <TouchableOpacity style={styles.floatingBackBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.badgeOverlay}>
              {casting.isPro && (
                <View style={styles.proBadge}>
                  <Ionicons name="star" size={12} color="#FFF" />
                  <Text style={styles.proBadgeText}>PRO EXCLUSIVE</Text>
                </View>
              )}
              {casting.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#00C853" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>

          {/* Details Body */}
          <View style={styles.body}>
            <View style={styles.agencyRow}>
              <Text style={styles.agencyName}>{casting.agencyName}</Text>
              <Text style={styles.categoryPill}>{casting.category}</Text>
            </View>

            <Text style={styles.title}>{casting.title}</Text>

            {/* Quick Spec Pills */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Ionicons name="location" size={18} color="#6C5CE7" />
                <View>
                  <Text style={styles.gridLabel}>Location</Text>
                  <Text style={styles.gridVal}>{casting.city}</Text>
                </View>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="people" size={18} color="#FF7675" />
                <View>
                  <Text style={styles.gridLabel}>Age Group</Text>
                  <Text style={styles.gridVal}>{casting.ageMin}-{casting.ageMax} Yrs</Text>
                </View>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="language" size={18} color="#0984E3" />
                <View>
                  <Text style={styles.gridLabel}>Language</Text>
                  <Text style={styles.gridVal}>{casting.language}</Text>
                </View>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="cash" size={18} color="#00B894" />
                <View>
                  <Text style={styles.gridLabel}>Pay Amount</Text>
                  <Text style={styles.gridVal}>₹{casting.amount?.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Description Section */}
            <Text style={styles.sectionHeader}>Description & Requirements</Text>
            <Text style={styles.descriptionText}>{casting.description}</Text>

            <View style={styles.deadlineBox}>
              <Ionicons name="calendar-outline" size={20} color="#D63031" />
              <View>
                <Text style={styles.deadlineLabel}>Application Deadline</Text>
                <Text style={styles.deadlineValue}>{casting.deadline}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Child Selection & Application Flow */}
            <Text style={styles.sectionHeader}>Apply for your Child</Text>

            {children.length === 0 ? (
              <View style={styles.noChildBox}>
                <Ionicons name="alert-circle" size={24} color="#FF7675" />
                <Text style={styles.noChildTitle}>No Child Profile Found</Text>
                <Text style={styles.noChildSub}>Please create a child profile before applying for casting calls.</Text>
                <TouchableOpacity style={styles.addChildBtn} onPress={() => setShowAddChildModal(true)}>
                  <Ionicons name="add-circle" size={18} color="#FFF" />
                  <Text style={styles.addChildBtnText}>Add Child Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.childSelectorContainer}>
                <View style={styles.childHeaderRow}>
                  <Text style={styles.selectChildLabel}>Select Child Profile:</Text>
                  <TouchableOpacity onPress={() => setShowAddChildModal(true)}>
                    <Text style={styles.addNewChildText}>+ Add Another</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.childChipsRow}>
                  {children.map((ch) => {
                    const isSelected = selectedChildId === ch.id;
                    return (
                      <TouchableOpacity
                        key={ch.id}
                        style={[styles.childChip, isSelected && styles.selectedChildChip]}
                        onPress={() => setSelectedChildId(ch.id)}
                      >
                        <Ionicons
                          name={isSelected ? "checkmark-circle" : "person-circle-outline"}
                          size={18}
                          color={isSelected ? "#6C5CE7" : "#636E72"}
                        />
                        <Text style={[styles.childChipText, isSelected && styles.selectedChildChipText]}>
                          {ch.name} ({ch.age} Yrs)
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Bottom Apply CTA */}
        <View style={styles.footerBar}>
          <View>
            <Text style={styles.footerPayLabel}>Remuneration</Text>
            <Text style={styles.footerPayAmount}>₹{casting.amount?.toLocaleString('en-IN')}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.applyCtaBtn,
              isApplied && styles.appliedCtaBtn,
              applying && styles.disabledCtaBtn
            ]}
            onPress={handleApply}
            disabled={isApplied || applying}
          >
            {applying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : isApplied ? (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.applyCtaText}>Applied</Text>
              </>
            ) : (
              <>
                <Text style={styles.applyCtaText}>Apply Now</Text>
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Modal for Creating Child Profile */}
        <Modal
          visible={showAddChildModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddChildModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Child Profile</Text>
                <TouchableOpacity onPress={() => setShowAddChildModal(false)}>
                  <Ionicons name="close" size={24} color="#2D3436" />
                </TouchableOpacity>
              </View>

              {addChildError ? (
                <View style={styles.modalErrorBox}>
                  <Text style={styles.modalErrorText}>{addChildError}</Text>
                </View>
              ) : null}

              <Text style={styles.inputLabel}>Child Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Aarav Sharma"
                placeholderTextColor="#A0A0B0"
                value={childName}
                onChangeText={setChildName}
              />

              <Text style={styles.inputLabel}>Age (Years)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 8"
                placeholderTextColor="#A0A0B0"
                keyboardType="number-pad"
                value={childAge}
                onChangeText={setChildAge}
              />

              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Mumbai"
                placeholderTextColor="#A0A0B0"
                value={childCity}
                onChangeText={setChildCity}
              />

              <TouchableOpacity
                style={[styles.saveChildBtn, addingChild && styles.disabledCtaBtn]}
                onPress={handleCreateChild}
                disabled={addingChild}
              >
                {addingChild ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveChildBtnText}>Save Profile & Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#D63031',
    fontWeight: '600',
  },
  backBtnFallback: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  floatingBackBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  proBadge: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  verifiedBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3436',
  },
  body: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  agencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6C5CE7',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryPill: {
    backgroundColor: '#F3F0FF',
    color: '#6C5CE7',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
    lineHeight: 28,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridItem: {
    width: '47%',
    backgroundColor: '#F8F9FE',
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  gridLabel: {
    fontSize: 10,
    color: '#888899',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  gridVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
    marginBottom: 16,
  },
  deadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 14,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  deadlineLabel: {
    fontSize: 11,
    color: '#D63031',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deadlineValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 2,
  },
  noChildBox: {
    backgroundColor: '#FFF9F5',
    borderWidth: 1,
    borderColor: '#FFE8D6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  noChildTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 6,
  },
  noChildSub: {
    fontSize: 13,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 18,
  },
  addChildBtn: {
    backgroundColor: '#FF7675',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addChildBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  childSelectorContainer: {
    backgroundColor: '#F8F9FE',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  childHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectChildLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3436',
  },
  addNewChildText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  childChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    gap: 6,
  },
  selectedChildChip: {
    backgroundColor: '#EFEBFF',
    borderColor: '#6C5CE7',
  },
  childChipText: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '600',
  },
  selectedChildChipText: {
    color: '#6C5CE7',
    fontWeight: '700',
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  footerPayLabel: {
    fontSize: 11,
    color: '#888899',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footerPayAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
  },
  applyCtaBtn: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  appliedCtaBtn: {
    backgroundColor: '#00B894',
    shadowColor: '#00B894',
  },
  disabledCtaBtn: {
    opacity: 0.7,
  },
  applyCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justify: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3436',
  },
  modalErrorBox: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalErrorText: {
    color: '#D63031',
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalInput: {
    backgroundColor: '#F5F5FA',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: '#E0E0EC',
    marginBottom: 12,
  },
  saveChildBtn: {
    backgroundColor: '#6C5CE7',
    height: 48,
    borderRadius: 12,
    justify: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveChildBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CastingDetailsScreen;
