// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import QuestionCard from './QuestionCard'; // Make sure this is the RN version from earlier

// const SupportGuidance = ({ questionItems, variant = 'dark' }) => {
//   const isDark = variant === 'dark';

//   const getIcon = (iconType) => {
//     // You should replace these with real icon components (e.g., from react-native-vector-icons)
//     switch (iconType) {
//       case 'prayer':
//         return <Text style={styles.iconPlaceholder}>🙏</Text>;
//       case 'dua':
//         return <Text style={styles.iconPlaceholder}>🤲</Text>;
//       case 'quran':
//         return <Text style={styles.iconPlaceholder}>📖</Text>;
//       case 'charity':
//         return <Text style={styles.iconPlaceholder}>❤️</Text>;
//       default:
//         return <Text style={styles.iconPlaceholder}>❓</Text>;
//     }
//   };

//   return (
//     <View style={[styles.container, isDark ? styles.darkText : styles.lightText]}>
//       <Text style={styles.heading}>Questions & Guidance</Text>

//       <View style={styles.grid}>
//         {questionItems.map((item) => (
//           <QuestionCard
//             key={item.id}
//             title={item.title}
//             icon={getIcon(item.icon)}
//             onClick={() => console.log(`Question clicked: ${item.title}`)}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16
//   },
//   darkText: {
//     color: '#ffffff'
//   },
//   lightText: {
//     color: '#1e293b' // slate-800
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#fff' // slate-800
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between'
//   },
//   iconPlaceholder: {
//     fontSize: 20
//   }
// });

// export default SupportGuidance;


// SupportGuidance.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QuestionCard from './QuestionCard';
import { useNavigation } from '@react-navigation/native';

const SupportGuidance = ({ questionItems, variant = 'dark' }) => {
  const navigation = useNavigation();
  const isDark = variant === 'dark';

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'prayer':
        return <Text style={styles.iconPlaceholder}>🙏</Text>;
      case 'dua':
        return <Text style={styles.iconPlaceholder}>🤲</Text>;
      case 'quran':
        return <Text style={styles.iconPlaceholder}>📖</Text>;
      case 'charity':
        return <Text style={styles.iconPlaceholder}>❤️</Text>;
      default:
        return <Text style={styles.iconPlaceholder}>❓</Text>;
    }
  };

  const handleQuestionPress = (question) => {
    navigation.navigate('QuestionDetailScreen', { question });
  };

  return (
    <View style={[styles.container, isDark && styles.darkBackground]}>
      <Text style={[styles.heading, isDark ? styles.darkText : styles.lightText]}>
        Questions & Guidance
      </Text>

      <View style={styles.grid}>
        {questionItems.map((item) => (
          <QuestionCard
            key={item.id}
            title={item.title}
            icon={getIcon(item.icon)}
            onPress={() => handleQuestionPress(item)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  darkBackground: {
    // backgroundColor: '#1e293b',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#1e293b',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconPlaceholder: {
    fontSize: 24,
  },
});

export default SupportGuidance;