import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNavigation = ({ activeTab = 'home', onTabPress, onLogout }) => {
  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress && onTabPress('home')}
        activeOpacity={0.8}
      >
        <View style={[styles.tabInner, activeTab === 'home' && styles.activeTabPill]}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' ? '#6C5CE7' : '#636E72'}
          />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>
            Home
          </Text>
        </View>
      </TouchableOpacity>

      {/* Casting Calls Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress && onTabPress('castings')}
        activeOpacity={0.8}
      >
        <View style={[styles.tabInner, activeTab === 'castings' && styles.activeTabPill]}>
          <Ionicons
            name={activeTab === 'castings' ? 'film' : 'film-outline'}
            size={20}
            color={activeTab === 'castings' ? '#6C5CE7' : '#636E72'}
          />
          <Text style={[styles.tabLabel, activeTab === 'castings' && styles.activeTabLabel]}>
            Casting Calls
          </Text>
        </View>
      </TouchableOpacity>

      {/* Workshop Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress && onTabPress('workshop')}
        activeOpacity={0.8}
      >
        <View style={[styles.tabInner, activeTab === 'workshop' && styles.activeTabPill]}>
          <Ionicons
            name={activeTab === 'workshop' ? 'play-circle' : 'play-circle-outline'}
            size={20}
            color={activeTab === 'workshop' ? '#6C5CE7' : '#636E72'}
          />
          <Text style={[styles.tabLabel, activeTab === 'workshop' && styles.activeTabLabel]}>
            Workshop
          </Text>
        </View>
      </TouchableOpacity>

      {/* Settings Tab */}
      <TouchableOpacity
        style={styles.tab}
        onPress={onLogout || (() => onTabPress && onTabPress('settings'))}
        activeOpacity={0.8}
      >
        <View style={[styles.tabInner, activeTab === 'settings' && styles.activeTabPill]}>
          <Ionicons
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
            size={20}
            color={activeTab === 'settings' ? '#6C5CE7' : '#636E72'}
          />
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.activeTabLabel]}>
            Settings
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    paddingVertical: 8,
    paddingHorizontal: 4,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 3,
  },
  activeTabPill: {
    backgroundColor: '#F2EEFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#636E72',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#6C5CE7',
    fontWeight: '800',
  },
});

export default BottomNavigation;
