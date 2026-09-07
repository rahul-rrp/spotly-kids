import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProPaywallModal = ({ visible, onClose }) => {
  const handleSubscribe = () => {
    Alert.alert('Spotly Kids Pro', 'Payment processed successfully! You now have full Pro Access.');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backCircleBtn} onPress={onClose}>
                <Ionicons name="arrow-back" size={22} color="#6C5CE7" />
              </TouchableOpacity>

              <View style={styles.premiumTag}>
                <Text style={styles.premiumTagText}>PREMIUM</Text>
              </View>
            </View>

            {/* Glowing Trophy Graphic */}
            <View style={styles.trophyWrapper}>
              <View style={styles.outerGlowRing}>
                <View style={styles.trophyCircle}>
                  <Ionicons name="trophy" size={54} color="#FFD700" />
                  <View style={styles.starBadgeSmall}>
                    <Ionicons name="checkmark" size={10} color="#6C5CE7" />
                  </View>
                </View>
              </View>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.title}>Unlock Spotly Kids Pro</Text>
            <Text style={styles.subtitle}>
              Give your child the star treatment with exclusive access and premium features.
            </Text>

            {/* Subscription Card */}
            <View style={styles.pricingCard}>
              <View style={styles.mostPopularBadge}>
                <Text style={styles.mostPopularText}>MOST POPULAR</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Text style={styles.priceAmount}>499</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>

              <Text style={styles.billingText}>Billed monthly. Cancel anytime.</Text>

              <TouchableOpacity style={styles.subscribeCardBtn} onPress={handleSubscribe} activeOpacity={0.88}>
                <Ionicons name="star" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.subscribeCardBtnText}>Subscribe Now</Text>
              </TouchableOpacity>

              <View style={styles.upiSecurityRow}>
                <Ionicons name="shield-checkmark" size={16} color="#00C853" />
                <Text style={styles.upiSecurityText}>Secure Payment With UPI</Text>
              </View>
            </View>

          </ScrollView>

          {/* Sticky Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.getProFullBtn} onPress={handleSubscribe} activeOpacity={0.88}>
              <Text style={styles.getProFullBtnText}>Get Spotly Kids Pro</Text>
            </TouchableOpacity>

            <Text style={styles.cancelAnytimeFooter}>CANCEL ANYTIME • ₹499/MONTH</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5B42F3',
  },
  container: {
    flex: 1,
    backgroundColor: '#6C5CE7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justify: 'center',
    alignItems: 'center',
  },
  premiumTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  premiumTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  trophyWrapper: {
    marginVertical: 14,
    alignItems: 'center',
  },
  outerGlowRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#FFD700',
    justify: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  trophyCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#2D1B69',
    justify: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  starBadgeSmall: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    justify: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0DBFF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pricingCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
    marginTop: 10,
  },
  mostPopularBadge: {
    position: 'absolute',
    top: -14,
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 12,
  },
  mostPopularText: {
    color: '#2D1B69',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-baseline',
    marginTop: 12,
    marginBottom: 4,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '900',
    color: '#6C5CE7',
  },
  priceAmount: {
    fontSize: 44,
    fontWeight: '900',
    color: '#6C5CE7',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '600',
    marginLeft: 4,
  },
  billingText: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
    marginBottom: 20,
  },
  subscribeCardBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  subscribeCardBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  upiSecurityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upiSecurityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3436',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  getProFullBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6C5CE7',
    justify: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  getProFullBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  cancelAnytimeFooter: {
    fontSize: 10,
    fontWeight: '800',
    color: '#888899',
    letterSpacing: 0.8,
  },
});

export default ProPaywallModal;
