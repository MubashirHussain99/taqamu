
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Routes from './src/navigations/Routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const App = () => {
  // useEffect(() => {
  //   const {width} = Dimensions.get('window');
  //   if (width < 640) {
  //     Orientation.lockToPortrait();
  //   } else {
  //     Orientation.unlockAllOrientations();
  //   }

  //   return () => {
  //     Orientation.unlockAllOrientations();
  //   };
  // }, []);
  return (
    <SafeAreaView style={{height: hp(100), width: wp(100)}}>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;


// 07EKNLXJJK7Dy688
// 5UKQS0FU9E2Uck7f   main device
