import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';

const Tasbih = () => {
  const navigation = useNavigation();
  const isTablet = Dimensions.get('window').width >= 768;
  // Sample tasbih data - in a real app, this would come from an API
  const [tasbihData, setTasbihData] = useState([
    {id: 1, text: 'سُبْحَانَ اللَّه', count: 0, limit: 33, read: false},
    {id: 2, text: 'الْحَمْدُ لِلَّه', count: 0, limit: 33, read: false},
    {id: 3, text: 'اللَّهُ أَكْبَر', count: 0, limit: 33, read: false},
    {id: 4, text: 'لَا إِلٰهَ إِلَّا اللَّه', count: 0, limit: 33, read: false},
    // Add more tasbih as needed
  ]);

  const [totalCount, setTotalCount] = useState(0);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [newTasbih, setNewTasbih] = useState(''); // state for the new Tasbih input

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Update total count whenever counts change
  useEffect(() => {
    const newTotal = tasbihData.reduce((sum, item) => sum + item.count, 0);
    setTotalCount(newTotal);
    setSubmitEnabled(newTotal > 0);
  }, [tasbihData]);

  const incrementCount = id => {
    setTasbihData(prevData =>
      prevData.map(item =>
        item.id === id && item.count < item.limit
          ? {...item, count: item.count + 1}
          : item,
      ),
    );
  };

  const resetCount = id => {
    setTasbihData(prevData =>
      prevData.map(item => (item.id === id ? {...item, count: 0} : item)),
    );
  };

  const resetAllCounts = () => {
    setTasbihData(prevData => prevData.map(item => ({...item, count: 0})));
  };

  const handleSubmit = async () => {
    // Prepare data to send to API
    const completedTasbih = tasbihData.filter(item => item.count > 0);

    // In a real app, this would be an API call
    console.log('Submitting to API:', completedTasbih);

    // Mock API response handling
    try {
      // Here you would have your actual API call:
      // const response = await api.markTasbihAsRead(completedTasbih);

      // For now, we'll just simulate success
      Alert.alert('Success', 'Your tasbih have been marked as read!');

      // Reset counts after successful submission
      resetAllCounts();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit tasbih. Please try again.');
      console.error('API Error:', error);
    }
  };

  const addCustomTasbih = () => {
    if (newTasbih.trim() !== '') {
      setTasbihData(prevData => [
        ...prevData,
        {id: Date.now(), text: newTasbih, count: 0, limit: 33, read: false},
      ]);
      setNewTasbih(''); // Clear the input field after adding
    } else {
      Alert.alert('Error', 'Please enter a valid tasbih word');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={{fontSize:16,fontWeight:"600",color:"#fff",paddingVertical:8,paddingHorizontal:5}}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasbih</Text>
        <View style={styles.headerRightPlaceholder} />
      </View> */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
            ❌
          </Text>
        </TouchableOpacity>
        <Text style={[styles.header, isTablet && styles.headerTablet]}>
          Tasbih
        </Text>
      </View>

      {/* Total Count Display */}
      <View style={styles.totalCountContainer}>
        <Text style={styles.totalCountText}>Total: {totalCount}</Text>
        {submitEnabled && (
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add your custom Tasbih"
          placeholderTextColor="#ccc"
          value={newTasbih}
          onChangeText={setNewTasbih}
        />
        <TouchableOpacity onPress={addCustomTasbih} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Tasbih List */}
      <ScrollView contentContainerStyle={styles.tasbihList}>
        {tasbihData.map(item => (
          <View key={item.id} style={styles.tasbihItem}>
            <Text style={styles.tasbihText}>{item.text}</Text>
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {item.count}/{item.limit}
              </Text>
              <TouchableOpacity
                onPress={() => incrementCount(item.id)}
                style={[
                  styles.counterButton,
                  item.count >= item.limit && styles.disabledButton,
                ]}
                disabled={item.count >= item.limit}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => resetCount(item.id)}
                style={styles.resetButton}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Global Reset Button */}
      <TouchableOpacity
        onPress={resetAllCounts}
        style={styles.globalResetButton}>
        <Text style={styles.globalResetButtonText}>Reset All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  headerTablet: {
    fontSize: 32,
  },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   // padding: 6,
  //   backgroundColor: '#0f172a',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ddd',
  // },
  backButton: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 60, // To balance the header with the back button
  },
  totalCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0f172a',
  },
  totalCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tasbihList: {
    paddingBottom: 80, // Space for the global reset button
  },
  tasbihItem: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tasbihText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  counterButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  globalResetButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  globalResetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {flexDirection: 'row', marginBottom: 16, padding: 10},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {color: '#fff'},
});

export default Tasbih;
