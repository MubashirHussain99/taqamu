import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Clipboard,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const duas = [
  {
    title: 'Morning Adhkar',
    items: [
      {
        arabic:
          'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        translation:
          'We have reached the morning and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.',
      },
      {
        arabic:
          'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        translation:
          'O Allah, by Your leave we have reached the morning and by Your leave we reach the evening, by Your leave we live and die and unto You is our resurrection.',
      },
      {
        arabic:
          'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
        translation:
          'How perfect Allah is and I praise Him by the number of His creation and His pleasure, and by the weight of His throne, and the ink of His words.',
      },
      {
        arabic:
          'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
        translation:
          'O Allah, I have reached the morning and call on You, the bearers of Your throne, Your angels, and all Your creation to witness that You are Allah, there is none worthy of worship except You, alone, without partner and that Muhammad is Your Servant and Messenger.',
      },
    ],
  },
  {
    title: 'Evening Adhkar',
    items: [
      {
        arabic:
          'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        translation:
          'We have reached the evening and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.',
      },
      {
        arabic:
          'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
        translation:
          'O Allah, by Your leave we have reached the evening and by Your leave we reach the morning, by Your leave we live and die and unto You is our return.',
      },
      {
        arabic:
          'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
        translation:
          'O Allah, I have reached the evening and call on You, the bearers of Your throne, Your angels, and all Your creation to witness that You are Allah, there is none worthy of worship except You, alone, without partner and that Muhammad is Your Servant and Messenger.',
      },
      {
        arabic:
          'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        translation:
          'I seek refuge in the perfect words of Allah from the evil of what He has created.',
      },
    ],
  },
  {
    title: 'Sleeping Duas',
    items: [
      {
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        translation: 'In Your name, O Allah, I die and I live.',
      },
      {
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        translation:
          'O Allah, protect me from Your punishment on the day You resurrect Your servants.',
      },
      {
        arabic:
          'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ',
        translation:
          'O Allah, I submit myself to You, entrust my affairs to You, turn my face to You, and rely completely on You, out of hope and fear of You. There is no refuge or escape from You except to You.',
      },
      {
        arabic:
          'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
        translation:
          'How perfect Allah is, all praise is for Allah, none has the right to be worshipped except Allah and Allah is the greatest.',
      },
    ],
  },
  {
    title: 'Eating Duas',
    items: [
      {
        arabic: 'بِسْمِ اللَّهِ',
        translation: 'In the name of Allah.',
      },
      {
        arabic: 'بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ',
        translation: 'In the name of Allah at the beginning and at the end.',
      },
      {
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        translation:
          'All praise is for Allah who has fed me this and provided it for me without any might nor power from myself.',
      },
      {
        arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ',
        translation:
          'O Allah, bless it for us and feed us with better than it.',
      },
    ],
  },
  {
    title: 'General Duas',
    items: [
      {
        arabic:
          'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        translation:
          'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
      },
      {
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
        translation:
          'O Allah, I ask You for beneficial knowledge, goodly provision and acceptable deeds.',
      },
      {
        arabic:
          'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
        translation:
          'O Allah, set right for me my religion which is the safeguard of my affairs. And set right for me the affairs of my world wherein is my living. And set right for me my Hereafter to which is my return. And make the life for me (a source) of abundance for every good and make my death a source of comfort for me protecting me against every evil.',
      },
      {
        arabic:
          'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
        translation:
          'My Lord, expand for me my breast [with assurance] and ease for me my task and untie the knot from my tongue that they may understand my speech.',
      },
    ],
  },
  {
    title: 'Travel Duas',
    items: [
      {
        arabic:
          'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        translation:
          'Exalted is He who has subjected this to us, and we could not have [otherwise] subdued it. And indeed we, to our Lord, will [surely] return.',
      },
      {
        arabic:
          'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
        translation:
          'O Allah, we ask You in this journey of ours for righteousness and piety, and for deeds that are pleasing to You. O Allah, lighten this journey for us and make its distance easy for us.',
      },
      {
        arabic:
          'اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ',
        translation:
          'O Allah, You are the Companion on the journey and the Successor over the family.',
      },
    ],
  },
  {
    title: 'Entering/Leaving Home',
    items: [
      {
        arabic:
          'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        translation:
          'In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we place our trust.',
      },
      {
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        translation:
          'O Allah, I ask You for the best of entrances and the best of exits. In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we place our trust.',
      },
      {
        arabic:
          'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        translation:
          'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
      },
    ],
  },
  {
    title: 'Visiting the Sick',
    items: [
      {
        arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ',
        translation:
          'Do not worry, it will be a purification (for you), Allah willing.',
      },
      {
        arabic:
          'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
        translation:
          'I ask Allah the Great, the Lord of the Magnificent Throne, to cure you.',
      },
      {
        arabic: 'اللَّهُمَّ اشْفِهِ، اللَّهُمَّ اشْفِهِ، اللَّهُمَّ اشْفِهِ',
        translation: 'O Allah cure him, O Allah cure him, O Allah cure him.',
      },
    ],
  },
  {
    title: 'After Prayer',
    items: [
      {
        arabic:
          'أَسْتَغْفِرُ اللَّهَ (3×) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        translation:
          "I seek Allah's forgiveness (3 times). O Allah, You are As-Salam (the One Who is free from all defects and deficiencies) and from You is all peace, blessed are You, O Possessor of majesty and honour.",
      },
      {
        arabic:
          'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
        translation:
          'None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent. O Allah, none can prevent what You have willed to bestow and none can bestow what You have willed to prevent, and no wealth or majesty can benefit anyone, as from You is all majesty.',
      },
      {
        arabic:
          'سُبْحَانَ اللَّهِ (33×) الْحَمْدُ لِلَّهِ (33×) اللَّهُ أَكْبَرُ (33×)',
        translation:
          'How perfect Allah is (33 times), All praise is for Allah (33 times), Allah is the greatest (33 times).',
      },
    ],
  },
  {
    title: 'Distress and Anxiety',
    items: [
      {
        arabic:
          'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        translation:
          'None has the right to be worshipped except You, how perfect You are, verily I was among the wrongdoers.',
      },
      {
        arabic:
          'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
        translation:
          'O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from miserliness and cowardice, from being overcome by debt and overpowered by men.',
      },
      {
        arabic:
          'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        translation:
          'Allah is sufficient for me. None has the right to be worshipped except Him. I have placed my trust in Him, He is the Lord of the magnificent throne.',
      },
    ],
  },
];

const DuaScreen = ({navigation}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const isTablet = Dimensions.get('window').width >= 768;

  const toggleCategory = index => {
    if (expandedCategory === index) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(index);
    }
  };

  const copyToClipboard = text => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'The dua has been copied to your clipboard.');
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={{fontSize:16,fontWeight:"600",color:"#fff"}}>❌</Text>
        </TouchableOpacity>
        <Text style={[styles.header, isTablet && styles.headerTablet]}>
          Daily Duas
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {duas.map((category, index) => (
          <View
            key={index}
            style={[
              styles.categoryContainer,
              isTablet && styles.categoryContainerTablet,
            ]}>
            <TouchableOpacity
              onPress={() => toggleCategory(index)}
              style={styles.categoryHeader}>
              <Text
                style={[
                  styles.categoryTitle,
                  isTablet && styles.categoryTitleTablet,
                ]}>
                {category.title}
              </Text>
              <Text style={styles.toggleIcon}>
                {expandedCategory === index ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedCategory === index && (
              <View style={styles.duasList}>
                {category.items.map((dua, duaIndex) => (
                  <View
                    key={duaIndex}
                    style={[
                      styles.duaItem,
                      isTablet && styles.duaItemTablet,
                      duaIndex === category.items.length - 1 &&
                        styles.lastDuaItem,
                    ]}>
                    <Text
                      style={[
                        styles.duaArabic,
                        isTablet && styles.duaArabicTablet,
                      ]}>
                      {dua.arabic}
                    </Text>
                    <Text
                      style={[
                        styles.duaTranslation,
                        isTablet && styles.duaTranslationTablet,
                      ]}>
                      {dua.translation}
                    </Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() =>
                          copyToClipboard(dua.arabic + '\n\n' + dua.translation)
                        }>
                        <Text style={styles.copyButtonText}>Copy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
  categoryContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContainerTablet: {
    marginHorizontal: 40,
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  categoryTitleTablet: {
    fontSize: 22,
  },
  toggleIcon: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  duasList: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  duaItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  duaItemTablet: {
    paddingVertical: 20,
  },
  lastDuaItem: {
    borderBottomWidth: 0,
  },
  duaArabic: {
    fontSize: 18,
    lineHeight: 30,
    color: '#2c3e50',
    textAlign: 'right',
    marginBottom: 10,
    fontFamily:
      Platform.OS === 'android'
        ? 'Scheherazade-Regular'
        : 'ScheherazadeNew-Regular',
  },
  duaArabicTablet: {
    fontSize: 22,
    lineHeight: 36,
  },
  duaTranslation: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7f8c8d',
    textAlign: 'left',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  duaTranslationTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
  },
  bookmarkButton: {
    padding: 5,
  },
});

export default DuaScreen;
