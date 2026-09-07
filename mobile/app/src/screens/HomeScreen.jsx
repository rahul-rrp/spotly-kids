import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchCastingCalls, fetchLatestJoinedKids, getSession, clearSession } from '../services/api';
import BottomNavigation from '../components/BottomNavigation';
import KidsJoinedModal from '../components/KidsJoinedModal';

const { width } = Dimensions.get('window');

const DUMMY_KIDS = [
  {
    id: 'd1',
    name: 'Gurbani',
    age: 2,
    city: 'Delhi',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    isStar: true,
  },
  {
    id: 'd2',
    name: 'Girija',
    age: 0,
    city: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
    isStar: true,
  },
  {
    id: 'd3',
    name: 'Bhavya',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
    isStar: false,
  },
  {
    id: 'd4',
    name: 'Vinik',
    age: 1,
    city: 'Delhi',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
    isStar: true,
  }
];

const DUMMY_WORKSHOPS = [
  {
    id: 1,
    title: 'Parzaan Dastur Podcast',
    subtitle: 'Shah Rukh Khan & His Journey | Gupshup With Spotly Kids',
    thumbnail: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    title: 'Spotly Kids Workshop',
    subtitle: 'Self tape camera basics & audition masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80',
  }
];

const DUMMY_RECENT_WORK = [
  {
    id: 1,
    title: 'Spotly Shoot With Shivaay',
    thumbnail: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    title: 'Spotly & Festive Collection',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80',
  }
];

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [castingCalls, setCastingCalls] = useState([]);
  const [joinedKids, setJoinedKids] = useState(DUMMY_KIDS);
  const [loading, setLoading] = useState(true);
  const [showKidsModal, setShowKidsModal] = useState(false);

  useEffect(() => {
    loadUser();
    loadAllData();
  }, []);

  const loadUser = async () => {
    const { user: userData } = await getSession();
    setUser(userData);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [castingsRes, kidsRes] = await Promise.all([
        fetchCastingCalls(),
        fetchLatestJoinedKids()
      ]);

      if (castingsRes.success && Array.isArray(castingsRes.data)) {
        setCastingCalls(castingsRes.data.slice(0, 4));
      }

      if (kidsRes.success && Array.isArray(kidsRes.data)) {
        setJoinedKids(kidsRes.data);
      }
    } catch (err) {
      console.error('Home fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearSession();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const userName = user?.name || 'Rahul';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.greetingBox}>
              <Text style={styles.greetingText}>Good Afternoon,</Text>
              <View style={styles.nameContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{userName}</Text>
                  <Text style={styles.waveEmoji}> 👋</Text>
                </View>
                <View style={styles.nameUnderline} />
              </View>
            </View>

            <View style={styles.headerRight}>
              {/* Language Switcher Pill */}
              <View style={styles.langPill}>
                <View style={styles.langActive}>
                  <Text style={styles.langActiveText}>EN</Text>
                </View>
                <TouchableOpacity style={styles.langInactive}>
                  <Text style={styles.langInactiveText}>हि</Text>
                </TouchableOpacity>
              </View>

              {/* Profile Avatar */}
              <TouchableOpacity onPress={handleLogout} style={styles.avatarWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }}
                  style={styles.avatarImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Banner Carousel */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerCard}>
              <View style={styles.bannerContentLeft}>
                <View style={styles.logoBadgeRow}>
                  <View style={styles.spotlyCircleLogo}>
                    <Ionicons name="sparkles" size={12} color="#FFF" />
                  </View>
                  <Text style={styles.spotlyLogoText}>spotly kids</Text>
                </View>
                <Text style={styles.bannerTitle}>
                  Proud to be Congratulated by <Text style={styles.highlightText}>Ashish Shelar</Text>
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Hon. Cultural Minister & Minister of Film and Media, Maharashtra
                </Text>
                <View style={styles.initiativePill}>
                  <Ionicons name="star" size={10} color="#FFD700" style={{ marginRight: 4 }} />
                  <Text style={styles.initiativeText}>For taking strong initiative to empower young talent</Text>
                </View>
              </View>

              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80' }}
                style={styles.bannerImageRight}
              />
            </View>

            {/* Pagination Dots */}
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Latest Kids Joined Section */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Latest Kids Joined</Text>
              <View style={styles.sectionTitleUnderline} />
            </View>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => setShowKidsModal(true)}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={14} color="#6C5CE7" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
          >
            {joinedKids.map((kid, idx) => (
              <TouchableOpacity
                key={kid.id || idx}
                style={styles.kidCard}
                activeOpacity={0.88}
                onPress={() => setShowKidsModal(true)}
              >
                <Image source={{ uri: kid.image || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' }} style={styles.kidCardImage} />
                <View style={styles.kidCardGradient} />
                
                {kid.isStar && (
                  <View style={styles.kidStarBadge}>
                    <Ionicons name="star" size={11} color="#FFF" />
                  </View>
                )}

                <View style={styles.kidInfoBox}>
                  <Text style={styles.kidName}>{kid.name}{kid.age !== undefined ? `, ${kid.age}` : ''}</Text>
                  <View style={styles.kidLocationRow}>
                    <Ionicons name="location-sharp" size={10} color="#FFF" />
                    <Text style={styles.kidLocationText}>{kid.city || kid.location || 'India'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Latest Casting Calls Section */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Latest Casting Calls</Text>
              <View style={styles.sectionTitleUnderline} />
            </View>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('CastingCalls')}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={14} color="#6C5CE7" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#6C5CE7" />
            </View>
          ) : (
            <View style={styles.castingsListContainer}>
              {castingCalls.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.castingCardYellow}
                  onPress={() => navigation.navigate('CastingDetails', { id: item.id })}
                  activeOpacity={0.88}
                >
                  <View style={styles.castingCardHeaderRow}>
                    <View style={styles.castingLogoCircle}>
                      <Text style={styles.castingLogoText}>
                        {item.agencyName ? item.agencyName.substring(0, 2).toUpperCase() : 'SK'}
                      </Text>
                    </View>

                    <View style={styles.castingMainContent}>
                      {item.isPro && (
                        <Text style={styles.proExclusiveTag}>PRO EXCLUSIVE</Text>
                      )}
                      <Text style={styles.castingTitleText} numberOfLines={2}>{item.title}</Text>
                      
                      <View style={styles.verifiedRow}>
                        <Ionicons name="checkmark-circle-sharp" size={14} color="#6C5CE7" />
                        <Text style={styles.verifiedLabelText}>
                          {item.isVerified ? 'Verified' : 'Agency'}
                        </Text>
                      </View>
                    </View>

                    <Ionicons name="arrow-forward" size={20} color="#6C5CE7" style={styles.arrowIcon} />
                  </View>

                  {/* Pills Row */}
                  <View style={styles.pillsRow}>
                    <View style={styles.pillBox}>
                      <Text style={styles.pillText}>{item.city}</Text>
                    </View>
                    <View style={styles.pillBox}>
                      <Text style={styles.pillText}>Age {item.ageMin} yr-{item.ageMax} yr</Text>
                    </View>
                    <View style={styles.pillBoxPurple}>
                      <Text style={styles.pillTextPurple}>₹ {item.amount?.toLocaleString('en-IN')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Free Acting Workshops */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Free Acting Workshops</Text>
              <View style={styles.sectionTitleUnderline} />
            </View>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={14} color="#6C5CE7" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
          >
            {DUMMY_WORKSHOPS.map((ws) => (
              <TouchableOpacity key={ws.id} style={styles.workshopCard} activeOpacity={0.88}>
                <View style={styles.workshopImageContainer}>
                  <Image source={{ uri: ws.thumbnail }} style={styles.workshopImage} />
                  <View style={styles.playButtonOverlay}>
                    <Ionicons name="play" size={18} color="#FFF" />
                  </View>
                </View>
                <View style={styles.workshopContent}>
                  <Text style={styles.workshopTitle} numberOfLines={1}>{ws.title}</Text>
                  <Text style={styles.workshopSubtitle} numberOfLines={2}>{ws.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Our Recent Work */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Our Recent Work</Text>
              <View style={styles.sectionTitleUnderline} />
            </View>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={14} color="#6C5CE7" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
          >
            {DUMMY_RECENT_WORK.map((work) => (
              <TouchableOpacity key={work.id} style={styles.workshopCard} activeOpacity={0.88}>
                <View style={styles.workshopImageContainer}>
                  <Image source={{ uri: work.thumbnail }} style={styles.workshopImage} />
                  <View style={styles.playButtonOverlay}>
                    <Ionicons name="play" size={18} color="#FFF" />
                  </View>
                </View>
                <View style={styles.workshopContent}>
                  <Text style={styles.workshopTitle} numberOfLines={1}>{work.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab="home"
          onTabPress={(tab) => {
            if (tab === 'castings') {
              navigation.navigate('CastingCalls');
            }
          }}
          onLogout={handleLogout}
        />

        {/* Kids Joined Modal */}
        <KidsJoinedModal
          visible={showKidsModal}
          kids={joinedKids}
          onClose={() => setShowKidsModal(false)}
          onRefreshData={loadAllData}
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
    backgroundColor: '#FAFBFD',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 16,
  },
  greetingBox: {},
  greetingText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  nameContainer: {
    alignSelf: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D3436',
  },
  waveEmoji: {
    fontSize: 20,
  },
  nameUnderline: {
    height: 3,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    marginTop: 3,
    width: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langPill: {
    flexDirection: 'row',
    backgroundColor: '#EFEBFF',
    borderRadius: 20,
    padding: 3,
    alignItems: 'center',
  },
  langActive: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  langActiveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  langInactive: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  langInactiveText: {
    color: '#6C5CE7',
    fontSize: 11,
    fontWeight: '700',
  },
  avatarWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bannerCard: {
    backgroundColor: '#FFF8EC',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEAA7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bannerContentLeft: {
    flex: 1,
    paddingRight: 10,
  },
  logoBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  spotlyCircleLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D63031',
    justify: 'center',
    alignItems: 'center',
  },
  spotlyLogoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2D3436',
    letterSpacing: -0.2,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3436',
    lineHeight: 20,
    marginBottom: 4,
  },
  highlightText: {
    color: '#D63031',
  },
  bannerSubtitle: {
    fontSize: 10,
    color: '#636E72',
    lineHeight: 14,
    marginBottom: 8,
  },
  initiativePill: {
    backgroundColor: '#1E1E2F',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  initiativeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    flex: 1,
  },
  bannerImageRight: {
    width: 100,
    height: 120,
    borderRadius: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DFE6E9',
  },
  activeDot: {
    backgroundColor: '#6C5CE7',
    width: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3436',
  },
  sectionTitleUnderline: {
    width: 45,
    height: 3,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    marginTop: 3,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  horizontalScrollPadding: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 10,
  },
  kidCard: {
    width: 130,
    height: 165,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#6C5CE7',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#DFE6E9',
  },
  kidCardImage: {
    width: '100%',
    height: '100%',
  },
  kidCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  kidStarBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF9F43',
    justify: 'center',
    alignItems: 'center',
  },
  kidInfoBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  kidName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  kidLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  kidLocationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  castingsListContainer: {
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 10,
  },
  castingCardYellow: {
    backgroundColor: '#FFFDF9',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    padding: 16,
    shadowColor: '#1E1E2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  castingCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  castingLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E65100',
    justify: 'center',
    alignItems: 'center',
  },
  castingLogoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  castingMainContent: {
    flex: 1,
  },
  proExclusiveTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B7791F',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  castingTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3436',
    lineHeight: 20,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  arrowIcon: {
    marginTop: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillBox: {
    backgroundColor: '#F0F0F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3436',
  },
  pillBoxPurple: {
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pillTextPurple: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6C5CE7',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  workshopCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  workshopImageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E0E0E0',
  },
  workshopImage: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justify: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  workshopContent: {
    padding: 12,
  },
  workshopTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 4,
  },
  workshopSubtitle: {
    fontSize: 11,
    color: '#636E72',
    lineHeight: 15,
  },
});

export default HomeScreen;
