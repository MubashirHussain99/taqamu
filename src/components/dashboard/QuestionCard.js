// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// const QuestionCard = ({ title, icon, onClick }) => {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onClick}>
//       <View style={styles.row}>
//         <View style={styles.iconWrapper}>
//           {icon}
//         </View>
//         <Text style={styles.title}>{title}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#1e293b', // slate-800
//     borderColor: '#334155',     // slate-700
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     width: '48%', // Adjusted for two cards per row
//   },
//   row: {
//     // flexDirection: 'row',
//     alignItems: 'center'
//   },
//   iconWrapper: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12
//   },
//   title: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 13,
//     textAlign: 'center'
//   }
// });

// export default QuestionCard;



// QuestionCard.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const QuestionCard = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    // backgroundColor: '#4A6FA5',
    backgroundColor: '#292655',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default QuestionCard;