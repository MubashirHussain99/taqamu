// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import axios from 'axios';

// const LocationSearch = ({onSelect, city, country}) => {
//   const [query, setQuery] = useState('');

//   // Set initial value from props
//   useEffect(() => {
//     if (city && country) {
//       setQuery(`${city}, ${country}`);
//     }
//   }, [city, country]);

//   const [results, setResults] = useState([]);

//   const handleSearch = async text => {
//     setQuery(text);
//     if (text.length < 3) return;

//     try {
//       const response = await axios.get(
//         'https://nominatim.openstreetmap.org/search',
//         {
//           params: {
//             q: text,
//             format: 'json',
//             addressdetails: 1,
//             limit: 5,
//           },
//           headers: {
//             'Accept-Language': 'en',
//             'User-Agent': 'taqamu/1.0 nexmosmubashir@gmail.com',
//           },
//         },
//       );

//       setResults(response.data);
//     } catch (error) {
//       console.error('Nominatim error:', error);
//     }
//   };

//   const handleSelect = item => {
//     const city =
//       item.address?.city ||
//       item.address?.town ||
//       item.address?.village ||
//       item.address?.suburb ||
//       item.address?.hamlet ||
//       '';

//     const state = item.address?.state || '';
//     const country = item.address?.country || '';
//     const full = item.display_name;

//     onSelect({full, city, state, country});

//     setQuery(full);
//     setResults([]);
//   };

//   return (
//     <View>
//       <TextInput
//         style={styles.input}
//         placeholder="Search for city"
//         value={query}
//         onChangeText={handleSearch}
//         placeholderTextColor="#bbb"
//       />
//       <FlatList
//         data={results}
//         keyExtractor={item => item.place_id.toString()}
//         renderItem={({item}) => (
//           <TouchableOpacity onPress={() => handleSelect(item)}>
//             <Text style={styles.resultItem}>{item.display_name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderBottomWidth: 1,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     marginBottom: 5,
//     color: '#fff',
//     backgroundColor: '#333',
//   },
//   resultItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#444',
//     color: '#fff',
//     backgroundColor: '#222',
//   },
// });

// export default LocationSearch;


import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const LocationSearch = forwardRef(({onSelect, city, country}, ref) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [manuallyTyped, setManuallyTyped] = useState(false);

  const buildDisplayQuery = (cityValue, countryValue) => {
    if (!cityValue) {
      return '';
    }
    if (
      !countryValue ||
      cityValue.toLowerCase().includes(countryValue.toLowerCase())
    ) {
      return cityValue;
    }
    return `${cityValue}, ${countryValue}`;
  };

  const parseQuery = text => {
    if (!text?.trim()) {
      return {full: '', city: '', country: ''};
    }

    const parts = text.split(',').map(part => part.trim()).filter(Boolean);
    const typedCity = parts[0] || '';
    const typedCountry = parts.length > 1 ? parts[parts.length - 1] : '';

    return {full: text.trim(), city: typedCity, country: typedCountry};
  };

  useImperativeHandle(ref, () => ({
    getLocationValues: () => parseQuery(query),
  }));

  // Set initial value from props
  useEffect(() => {
    if (city) {
      setQuery(buildDisplayQuery(city, country));
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
      onSelect(parseQuery(query));
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
});

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
