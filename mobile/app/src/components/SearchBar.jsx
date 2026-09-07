import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ value, onChangeText, onSearch, placeholder = "Search talent, serials, shows..." }) => {
  const [internalText, setInternalText] = useState(value || '');

  useEffect(() => {
    setInternalText(value || '');
  }, [value]);

  const handleChange = (text) => {
    setInternalText(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleClear = () => {
    setInternalText('');
    if (onChangeText) onChangeText('');
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888899" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={internalText}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#A0A0B0"
        returnKeyType="search"
        onSubmitEditing={() => onSearch && onSearch(internalText)}
      />
      {internalText.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color="#A0A0B0" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    borderWidth: 1,
    borderColor: '#E8E8EE',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
});

export default SearchBar;
