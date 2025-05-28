import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const LocationSearch = ({onSelect}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async text => {
    setQuery(text);
    if (text.length < 3) return;

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
            'User-Agent': 'taqamu/1.0 nexmosmubashir@gmail.com', // replace with your app name and email
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
      item.address?.city || item.address?.town || item.address?.village || '';
    const country = item.address?.country || '';
    onSelect({city, country});
    setQuery(city); // show selected value in input
    setResults([]); // hide dropdown
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search for city"
        value={query}
        onChangeText={handleSearch}
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
    borderWidth: 1,
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
