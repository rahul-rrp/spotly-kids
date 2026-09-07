import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CastingCard = ({ item, onApplyPress, onUnlockProPress }) => {
  const isPro = item.isPro;

  return (
    <View style={[styles.card, isPro ? styles.proCardBorder : styles.standardCardBorder]}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        {isPro ? (
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO EXCLUSIVE</Text>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.amountPill}>
          <Text style={styles.amountText}>
            {typeof item.amount === 'number' ? `₹ ${item.amount.toLocaleString('en-IN')}` : item.amount}
          </Text>
        </View>
      </View>

      {/* Agency / Brand Info */}
      <View style={styles.agencyRow}>
        <View style={[styles.logoCircle, isPro ? styles.logoSpotly : styles.logoStandard]}>
          <Text style={styles.logoText}>
            {item.agencyName ? item.agencyName.substring(0, 2).toUpperCase() : 'SK'}
          </Text>
        </View>

        <View style={styles.agencyInfo}>
          <View style={styles.agencyVerifiedRow}>
            <Text style={styles.agencyName}>{item.agencyName || 'SPOTLY KIDS'}</Text>
            {item.isVerified && (
              <Ionicons name="checkmark-circle-sharp" size={14} color="#6C5CE7" style={{ marginLeft: 4 }} />
            )}
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

      {/* Spec Pills Row */}
      <View style={styles.pillsRow}>
        <View style={styles.specPill}>
          <Ionicons name="location-sharp" size={12} color="#636E72" />
          <Text style={styles.specPillText}>{item.city}</Text>
        </View>

        <View style={styles.specPill}>
          <Ionicons name="happy-outline" size={12} color="#636E72" />
          <Text style={styles.specPillText}>Age {item.ageMin} yr-{item.ageMax} yr</Text>
        </View>

        <View style={styles.specPill}>
          <Ionicons name="calendar-outline" size={12} color="#636E72" />
          <Text style={styles.specPillText}>{item.deadline || '1 Sep'}</Text>
        </View>
      </View>

      {/* Main Action Button */}
      {isPro ? (
        <TouchableOpacity
          style={styles.unlockProBtn}
          onPress={onUnlockProPress}
          activeOpacity={0.88}
        >
          <Text style={styles.actionBtnText}>Unlock with Pro</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.applyNowBtn}
          onPress={onApplyPress}
          activeOpacity={0.88}
        >
          <Text style={styles.actionBtnText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E1E2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  proCardBorder: {
    backgroundColor: '#FFFDF7',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  standardCardBorder: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E0FA',
  },
  topRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  proBadge: {
    backgroundColor: '#2D1B69',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  proBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  amountPill: {
    backgroundColor: '#FFEAA7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  amountText: {
    color: '#2D3436',
    fontSize: 13,
    fontWeight: '800',
  },
  agencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSpotly: {
    backgroundColor: '#D63031',
  },
  logoStandard: {
    backgroundColor: '#6C5CE7',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  agencyInfo: {
    flex: 1,
  },
  agencyVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6C5CE7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  specPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#636E72',
  },
  unlockProBtn: {
    backgroundColor: '#6C5CE7',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  applyNowBtn: {
    backgroundColor: '#6C5CE7',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default CastingCard;
