
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const LocationSearch = ({onSelect, city, country}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [manuallyTyped, setManuallyTyped] = useState(false);

  // Set initial value from props
  useEffect(() => {
    if (city && country) {
      const full = `${city}, ${country}`;
      setQuery(full);
    }
  }, [city, country]);

  const handleSearch = async text => {
    setQuery(text);
    setManuallyTyped(true);

    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: text,
            format: 'json',
            addressdetails: 1,
            limit: 5,
          },
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'taqamu/1.0 nexmosmubashir@gmail.com',
          },
        },
      );

      setResults(response.data);
    } catch (error) {
      console.error('Nominatim error:', error);
    }
  };

  const handleSelect = item => {
    const city =
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      item.address?.suburb ||
      item.address?.hamlet ||
      '';

    const country = item.address?.country || '';
    const full = item.display_name;

    onSelect({full, city, country});
    setQuery(full);
    setResults([]);
    setManuallyTyped(false);
  };

  const handleBlur = () => {
    if (manuallyTyped && query) {
      // If user typed but didn't select, still notify parent
      const parts = query.split(',');
      const typedCity = parts[0]?.trim() || '';
      const typedCountry = parts.slice(1).join(',').trim() || '';
      onSelect({full: query, city: typedCity, country: typedCountry});
      setManuallyTyped(false);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search for city"
        value={query}
        onChangeText={handleSearch}
        onBlur={handleBlur}
        placeholderTextColor="#bbb"
      />
      <FlatList
        data={results}
        keyExtractor={item => item.place_id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Text style={styles.resultItem}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
    color: '#fff',
    backgroundColor: '#333',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    color: '#fff',
    backgroundColor: '#222',
  },
});

export default LocationSearch;
