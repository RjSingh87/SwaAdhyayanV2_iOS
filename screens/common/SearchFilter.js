import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SWATheam } from '../../constant/ConstentValue';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchFilter = ({
  data = [],
  searchKeys = [],
  fallbackKeys = [],
  onResult = () => {},
  placeholder = 'Search...',
  resetTrigger,
}) => {
  const [query, setQuery] = useState('');
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const searchKeysRef = useRef(searchKeys);
  searchKeysRef.current = searchKeys;

  const fallbackKeysRef = useRef(fallbackKeys);
  fallbackKeysRef.current = fallbackKeys;

  // Track last sent results to prevent duplicate callback loops
  const lastSentRef = useRef(null);

  // Helper function to resolve dot-notation path or flat key safely
  const getNestedValue = (obj, path) => {
    if (!obj || !path) return undefined;
    if (path.indexOf('.') === -1) return obj[path];
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  };

  // Reset query when resetTrigger changes
  useEffect(() => {
    setQuery('');
  }, [resetTrigger]);

  // Filter whenever query or data changes
  useEffect(() => {
    if (!query || !query.trim()) {
      if (lastSentRef.current !== data) {
        lastSentRef.current = data;
        onResultRef.current(data || []);
      }
      return;
    }

    const lower = query.trim().toLowerCase();
    const allKeysSet = new Set([...(searchKeysRef.current || []), ...(fallbackKeysRef.current || [])]);
    const keysToSearch = Array.from(allKeysSet);

    const filtered = (data || []).filter(item => {
      if (!item) return false;

      return keysToSearch.some(k => {
        const val = getNestedValue(item, k);
        if (val === undefined || val === null) return false;

        // Strip HTML tags if description has HTML tags like <p>, <br> etc.
        const strVal = String(val).replace(/<[^>]*>/g, ' ').toLowerCase();
        return strVal.includes(lower);
      });
    });

    lastSentRef.current = filtered;
    onResultRef.current(filtered);
  }, [query, data]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <AntDesign name="search1" size={18} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={SWATheam.SwaGray || '#888'}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query ? (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.clearBtn}>
            <AntDesign name="closecircle" size={18} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SWATheam.SwaWhite,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
    fontSize: 14,
    color: SWATheam.SwaBlack,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
});

export default SearchFilter;
