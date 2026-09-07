import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DEFAULT_KIDS = [
  {
    id: 'k1',
    name: 'Gurbani bhalla',
    age: 2,
    city: 'Delhi',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'k2',
    name: 'Girija Choudhary uh',
    age: 0,
    city: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'k3',
    name: 'Bhavya Dipak Sonawane',
    age: 0,
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'k4',
    name: 'Shreet Tyagi',
    age: 1,
    city: 'Delhi',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'k5',
    name: 'Vinik Chopra',
    age: 1,
    city: 'Delhi',
    image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'k6',
    name: 'Mihik',
    age: 0,
    city: 'Ahmedabad',
    image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=400&q=80',
  },
];

const KidsJoinedModal = ({ visible, kids, onClose }) => {
  const displayKids = kids && kids.length > 0 ? kids : DEFAULT_KIDS;

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
            {/* Top Handle Bar */}
            <View style={styles.handleBar} />

            {/* Header Row */}
            <View style={styles.headerRow}>
              <Text style={styles.title}>Latest Kids Joined</Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Vertical List of Kids */}
            <FlatList
              data={displayKids}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const imageUri =
                  item.image ||
                  item.photo ||
                  DEFAULT_KIDS[index % DEFAULT_KIDS.length].image;
                const ageStr =
                  item.age !== undefined && item.age !== null
                    ? `, ${item.age}`
                    : '';

                return (
                  <View style={styles.kidItemCard}>
                    <Image source={{ uri: imageUri }} style={styles.avatarImage} />

                    <View style={styles.infoBox}>
                      <Text style={styles.kidNameText} numberOfLines={1}>
                        {item.name}{ageStr}
                      </Text>
                      <Text style={styles.locationText} numberOfLines={1}>
                        {item.city || item.location || 'India'}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
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
    maxHeight: SCREEN_HEIGHT * 0.82,
    minHeight: SCREEN_HEIGHT * 0.5,
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
    paddingBottom: 30,
  },
  kidItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
    marginRight: 14,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  kidNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
});

export default KidsJoinedModal;

