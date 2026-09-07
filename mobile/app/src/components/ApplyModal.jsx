import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMyChildren, createChildProfile, submitApplication } from '../services/api';

const DEFAULT_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
];

const PHOTO_SLOTS = [
  { id: 1, title: 'Front Headshot', icon: 'person' },
  { id: 2, title: 'Left Profile', icon: 'arrow-back' },
  { id: 3, title: 'Right Profile', icon: 'arrow-forward' },
  { id: 4, title: 'Full Length', icon: 'body' },
];

const ApplyModal = ({ visible, castingCall, onClose, onSuccess }) => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 4 Photos State (array of 4 image URLs or null)
  const [photos, setPhotos] = useState([null, null, null, null]);

  // Add Child Form State
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childCity, setChildCity] = useState('');
  const [creatingChild, setCreatingChild] = useState(false);

  useEffect(() => {
    if (visible) {
      loadChildren();
      // Pre-fill default demo photos for fast & smooth user testing
      setPhotos([...DEFAULT_SAMPLE_PHOTOS]);
    }
  }, [visible]);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const res = await fetchMyChildren();
      if (res.success && Array.isArray(res.data)) {
        setChildren(res.data);
        if (res.data.length > 0) {
          setSelectedChildId(res.data[0].id);
        } else {
          setShowAddChild(true);
        }
      }
    } catch (err) {
      console.error('Fetch children error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChild = async () => {
    if (!childName.trim() || !childAge.trim() || !childCity.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all child profile fields.');
      return;
    }

    const ageNum = parseInt(childAge);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 18) {
      Alert.alert('Invalid Age', 'Please enter a valid age (0-18).');
      return;
    }

    setCreatingChild(true);
    try {
      const res = await createChildProfile({
        name: childName.trim(),
        age: ageNum,
        city: childCity.trim(),
      });

      if (res.success && res.data) {
        setChildren((prev) => [res.data, ...prev]);
        setSelectedChildId(res.data.id);
        setShowAddChild(false);
        setChildName('');
        setChildAge('');
        setChildCity('');
        Alert.alert('Success', 'Child profile created!');
      } else {
        Alert.alert('Error', res.message || 'Failed to create child profile.');
      }
    } catch (err) {
      console.error('Create child error:', err);
      Alert.alert('Error', 'Failed to create child profile.');
    } finally {
      setCreatingChild(false);
    }
  };

  const togglePhotoSlot = (index) => {
    const newPhotos = [...photos];
    if (newPhotos[index]) {
      newPhotos[index] = null; // Clear
    } else {
      newPhotos[index] = DEFAULT_SAMPLE_PHOTOS[index]; // Attach photo
    }
    setPhotos(newPhotos);
  };

  const uploadedCount = photos.filter(p => p !== null).length;

  const handleSubmitApplication = async () => {
    if (!selectedChildId) {
      Alert.alert('Select Child', 'Please select a child profile to apply.');
      return;
    }

    if (uploadedCount < 4) {
      Alert.alert(
        '4 Photos Required',
        `Please provide all 4 required photos of your child before submitting (${uploadedCount}/4 completed).`
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitApplication(selectedChildId, castingCall.id);
      if (res.success) {
        Alert.alert('Application Submitted! 🎉', 'Your child\'s application with 4 photos has been submitted successfully.');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        Alert.alert('Notice', res.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Apply error:', err);
      const msg = err.response?.data?.message || 'Error submitting application.';
      Alert.alert('Application Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>Apply for Casting</Text>
              <Text style={styles.castingTitle} numberOfLines={1}>
                {castingCall?.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#2D3436" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            
            {/* Step 1: Child Profile Selection */}
            <Text style={styles.sectionHeading}>1. Select Child Profile</Text>
            
            {loading ? (
              <ActivityIndicator color="#6C5CE7" style={{ marginVertical: 10 }} />
            ) : showAddChild ? (
              <View style={styles.addChildForm}>
                <Text style={styles.inputLabel}>Child Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Aarav Sharma"
                  placeholderTextColor="#A0A0B0"
                  value={childName}
                  onChangeText={setChildName}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Age</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 8"
                      placeholderTextColor="#A0A0B0"
                      keyboardType="number-pad"
                      value={childAge}
                      onChangeText={setChildAge}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Mumbai"
                      placeholderTextColor="#A0A0B0"
                      value={childCity}
                      onChangeText={setChildCity}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveChildBtn}
                  onPress={handleCreateChild}
                  disabled={creatingChild}
                >
                  {creatingChild ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.saveChildBtnText}>Save & Select Child</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.childrenRow}>
                {children.map((ch) => {
                  const isSelected = selectedChildId === ch.id;
                  return (
                    <TouchableOpacity
                      key={ch.id}
                      style={[styles.childChip, isSelected && styles.selectedChildChip]}
                      onPress={() => setSelectedChildId(ch.id)}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'person-circle-outline'}
                        size={18}
                        color={isSelected ? '#6C5CE7' : '#636E72'}
                      />
                      <Text style={[styles.childChipText, isSelected && styles.selectedChildChipText]}>
                        {ch.name} ({ch.age} Yrs)
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity style={styles.addMiniBtn} onPress={() => setShowAddChild(true)}>
                  <Ionicons name="add" size={18} color="#6C5CE7" />
                  <Text style={styles.addMiniText}>New</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: 4 Kids Photos Requirement */}
            <View style={styles.photoHeaderRow}>
              <Text style={styles.sectionHeading}>2. Upload 4 Kids Photos Required</Text>
              <View style={[styles.badgePill, uploadedCount === 4 ? styles.badgeGreen : styles.badgeOrange]}>
                <Text style={styles.badgeText}>{uploadedCount} / 4 Uploaded</Text>
              </View>
            </View>

            <Text style={styles.photoSubtext}>
              Spotly Kids casting directors require 4 clear recent photos of your child.
            </Text>

            {/* 4 Photos Grid */}
            <View style={styles.photoGrid}>
              {PHOTO_SLOTS.map((slot, index) => {
                const photoUrl = photos[index];
                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[styles.photoCard, photoUrl ? styles.photoCardActive : styles.photoCardEmpty]}
                    onPress={() => togglePhotoSlot(index)}
                    activeOpacity={0.8}
                  >
                    {photoUrl ? (
                      <>
                        <Image source={{ uri: photoUrl }} style={styles.photoImage} />
                        <View style={styles.checkOverlay}>
                          <Ionicons name="checkmark-circle" size={20} color="#00C853" />
                        </View>
                        <Text style={styles.photoSlotTitleActive}>{slot.title}</Text>
                      </>
                    ) : (
                      <View style={styles.photoEmptyContent}>
                        <Ionicons name="camera-outline" size={26} color="#888899" />
                        <Text style={styles.photoSlotTitle}>{slot.title}</Text>
                        <Text style={styles.tapToUploadText}>+ Tap to upload</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.submitAppBtn, (submitting || uploadedCount < 4) && styles.disabledBtn]}
              onPress={handleSubmitApplication}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitAppBtnText}>Submit Application (4 Photos)</Text>
              )}
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justify: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
  },
  castingTitle: {
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  scrollBody: {
    paddingBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 10,
  },
  childrenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0EC',
    gap: 6,
  },
  selectedChildChip: {
    backgroundColor: '#EFEBFF',
    borderColor: '#6C5CE7',
  },
  childChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
  },
  selectedChildChipText: {
    color: '#6C5CE7',
    fontWeight: '700',
  },
  addMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6C5CE7',
    gap: 2,
  },
  addMiniText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  addChildForm: {
    backgroundColor: '#F8F9FE',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: '#E0E0EC',
    marginBottom: 10,
  },
  saveChildBtn: {
    backgroundColor: '#6C5CE7',
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  saveChildBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  photoHeaderRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeGreen: {
    backgroundColor: '#E8F5E9',
  },
  badgeOrange: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
  },
  photoSubtext: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 14,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justify: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  photoCard: {
    width: '47%',
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justify: 'center',
  },
  photoCardEmpty: {
    backgroundColor: '#F5F5FA',
    borderWidth: 1.5,
    borderColor: '#DCDCE6',
    borderStyle: 'dashed',
  },
  photoCardActive: {
    borderWidth: 2,
    borderColor: '#00C853',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  photoSlotTitleActive: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 3,
  },
  photoEmptyContent: {
    alignItems: 'center',
    gap: 2,
  },
  photoSlotTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 4,
  },
  tapToUploadText: {
    fontSize: 10,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  submitAppBtn: {
    backgroundColor: '#6C5CE7',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitAppBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ApplyModal;
