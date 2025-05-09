// // QuestionDetailScreen.js
// import React from 'react';
// import {View, ScrollView, Text, StyleSheet} from 'react-native';

// const questionAnswers = {
//   'question-1': {
//     title: 'How to perform Wudu',
//     content: `1. Begin by making niyyah (intention) to perform wudu\n
// 2. Wash both hands up to the wrists 3 times\n
// 3. Rinse your mouth 3 times\n
// 4. Clean your nose by sniffing water in and out 3 times\n
// 5. Wash your face 3 times from hairline to chin\n
// 6. Wash your arms up to the elbows 3 times (right first, then left)\n
// 7. Wipe your head with wet hands once\n
// 8. Wipe inside and behind your ears once\n
// 9. Wash your feet up to the ankles 3 times (right first, then left)\n\n
// Note: Ensure each part is washed thoroughly and in order.`,
//   },
//   'question-2': {
//     title: 'How to perform Tayammum',
//     content: `1. Make intention for tayammum\n
// 2. Strike both palms on clean earth\n
// 3. Blow off excess dust\n
// 4. Wipe the entire face with both hands\n
// 5. Strike the earth again\n
// 6. Wipe the right arm to the elbow with the left hand\n
// 7. Wipe the left arm to the elbow with the right hand\n\n
// Tayammum is performed when water is unavailable or its use would cause harm.`,
//   },
//   'question-3': {
//     title: 'How to recite Surah Al-Fatiha',
//     content: `1. Begin with "Bismillah ir-Rahman ir-Raheem"\n
// 2. Continue with "Alhamdu lillahi rabbi l-alameen"\n
// 3. "Ar-Rahman ir-Raheem"\n
// 4. "Maliki yawmi d-deen"\n
// 5. "Iyyaka na'budu wa iyyaka nasta'een"\n
// 6. "Ihdina s-sirata l-mustaqeem"\n
// 7. "Sirata l-latheena an'amta alayhim ghayri l-maghdoobi alayhim wa la d-dalleen"\n\n
// This is the opening chapter of the Quran and is recited in every rakat of prayer.`,
//   },
//   'question-4': {
//     title: 'How to make Dua for protection',
//     content: `1. Raise your hands to shoulder level with palms facing up\n
// 2. Begin by praising Allah and sending blessings upon the Prophet (PBUH)\n
// 3. Recite protective duas such as:\n
//    - "A'udhu bi kalimat-illahi at-tammati min sharri ma khalaq"\n
//    - "Bismillahi alladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i"\n
// 4. Make your specific request for protection\n
// 5. End with blessings upon the Prophet (PBUH) and "Ameen"\n\n
// Make dua with sincerity and conviction that Allah will answer.`,
//   },
// };

// const QuestionDetailScreen = ({route}) => {
//   const {question} = route.params;
//   const answer = questionAnswers[question.id];

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>{answer.title}</Text>
//       <Text style={styles.content}>{answer.content}</Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#2c3e50',
//     textAlign: 'center',
//   },
//   content: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#34495e',
//     whiteSpace: 'pre-line',
//   },
// });

// export default QuestionDetailScreen;

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import the useNavigation hook

const questionAnswers = {
  'question-1': {
    title: 'How to perform Wudu',
    content: `1. Begin by making niyyah (intention) to perform wudu\n
  2. Wash both hands up to the wrists 3 times\n
  3. Rinse your mouth 3 times\n
  4. Clean your nose by sniffing water in and out 3 times\n
  5. Wash your face 3 times from hairline to chin\n
  6. Wash your arms up to the elbows 3 times (right first, then left)\n
  7. Wipe your head with wet hands once\n
  8. Wipe inside and behind your ears once\n
  9. Wash your feet up to the ankles 3 times (right first, then left)\n\n
  Note: Ensure each part is washed thoroughly and in order.`,
  },
  'question-2': {
    title: 'How to perform Tayammum',
    content: `1. Make intention for tayammum\n
  2. Strike both palms on clean earth\n
  3. Blow off excess dust\n
  4. Wipe the entire face with both hands\n
  5. Strike the earth again\n
  6. Wipe the right arm to the elbow with the left hand\n
  7. Wipe the left arm to the elbow with the right hand\n\n
  Tayammum is performed when water is unavailable or its use would cause harm.`,
  },
  'question-3': {
    title: 'How to recite Surah Al-Fatiha',
    content: `1. ﷽ (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ)\n
2. ٱلْـحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ\n
3. ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ\n
4. مَـٰلِكِ يَوْمِ ٱلدِّينِ\n
5. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\n
6. ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ\n
7. صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ\n\n
سورة الفاتحة تُقرأ في كل ركعة من الصلاة.`,
  },

//   'question-4': {
//     title: 'How to make Dua for protection',
//     content: `1. Raise your hands to shoulder level with palms facing up\n
//   2. Begin by praising Allah and sending blessings upon the Prophet (PBUH)\n
//   3. Recite protective duas such as:\n
//      - "A'udhu bi kalimat-illahi at-tammati min sharri ma khalaq"\n
//      - "Bismillahi alladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i"\n
//   4. Make your specific request for protection\n
//   5. End with blessings upon the Prophet (PBUH) and "Ameen"\n\n
//   Make dua with sincerity and conviction that Allah will answer.`,
//   },
'question-4': {
  title: 'How to make Dua for protection',
  content: `1. ارفع يديك إلى مستوى الكتف مع الكفوف موجهة للأعلى\n
  2. ابدأ بحمد الله والصلاة على النبي (صلى الله عليه وسلم)\n
  3. اقرأ الأدعية الواقية مثل:\n
     - "أعوذ بكلمات الله التامات من شر ما خلق"\n
     - "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء"\n
  4. اطلب الحماية التي تحتاج إليها\n
  5. اختم بالصلاة على النبي (صلى الله عليه وسلم) و "آمين"\n\n
  ادعِ بصدق وإيمان بأن الله سيستجيب.`,
},

};
const QuestionDetailScreen = ({route}) => {
  const navigation = useNavigation(); // Initialize the navigation hook
  const {question} = route.params;
  const answer = questionAnswers[question.id];

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={{fontSize:16,fontWeight:"600",color:"#fff"}}>❌</Text>
      </TouchableOpacity>

      {/* Question Title and Content */}
      <Text style={styles.title}>{answer.title}</Text>
      <Text style={styles.content}>{answer.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a',
  },
  backButton: {
    // marginBottom: 20,
    // padding: 10,
    // backgroundColor: '#3498db',
    // borderRadius: 5,
    // width: 100,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    whiteSpace: 'pre-line',
  },
});

export default QuestionDetailScreen;
