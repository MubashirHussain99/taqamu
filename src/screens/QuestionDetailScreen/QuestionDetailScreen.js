import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const questionAnswers = {
  'question-1': {
    title: 'How to perform Wudu',
    content: `1. Begin by making niyyah (intention) to perform wudu
2. Wash both hands up to the wrists 3 times
3. Rinse your mouth 3 times
4. Clean your nose by sniffing water in and out 3 times
5. Wash your face 3 times from hairline to chin
6. Wash your arms up to the elbows 3 times (right first, then left)
7. Wipe your head with wet hands once
8. Wipe inside and behind your ears once
9. Wash your feet up to the ankles 3 times (right first, then left)

Note: Ensure each part is washed thoroughly and in order.`,
  },
  'question-2': {
    title: 'How to perform Tayammum',
    content: `1. Make intention for tayammum
2. Strike both palms on clean earth
3. Blow off excess dust
4. Wipe the entire face with both hands
5. Strike the earth again
6. Wipe the right arm to the elbow with the left hand
7. Wipe the left arm to the elbow with the right hand

Tayammum is performed when water is unavailable or its use would cause harm.`,
  },
  'question-3': {
    title: 'How to recite Surah Al-Fatiha',
    content: `1. ﷽ (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ)
2. ٱلْـحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
3. ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
4. مَـٰلِكِ يَوْمِ ٱلدِّينِ
5. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
6. ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ
7. صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ

سورة الفاتحة تُقرأ في كل ركعة من الصلاة.`,
  },
  'question-4': {
    title: 'How to make Dua for protection',
    content: `1. ارفع يديك إلى مستوى الكتف مع الكفوف موجهة للأعلى
2. ابدأ بحمد الله والصلاة على النبي (صلى الله عليه وسلم)
3. اقرأ الأدعية الواقية مثل:
   - "أعوذ بكلمات الله التامات من شر ما خلق"
   - "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء"
4. اطلب الحماية التي تحتاج إليها
5. اختم بالصلاة على النبي (صلى الله عليه وسلم) و "آمين"

ادعِ بصدق وإيمان بأن الله سيستجيب.`,
  },
};

const QuestionDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const {question} = route.params ?? {};
  const answer = question?.id ? questionAnswers[question.id] : null;

  const headerTitle = answer?.title ?? question?.title ?? 'Guidance';
  const headerSubtitle = answer
    ? 'Questions & Guidance'
    : 'Content not available';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button">
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText} numberOfLines={2}>
            {headerTitle}
          </Text>
          <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {answer ? (
          <View style={styles.contentCard}>
            <Text style={styles.content}>{answer.content}</Text>
          </View>
        ) : (
          <View style={styles.contentCard}>
            <Text style={styles.emptyText}>
              This guidance topic could not be loaded. Go back and try again.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 28,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#a7f3d0',
    marginTop: 4,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contentCard: {
    backgroundColor: '#0d4236',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#ecfdf5',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#a7f3d0',
    textAlign: 'center',
  },
});

export default QuestionDetailScreen;
