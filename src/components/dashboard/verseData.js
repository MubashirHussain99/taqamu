// Mock Quran Verses for RandomAyahOfTheDay component
// This data will be replaced with actual verses from the Tanzil.net dataset
// once the import scripts are fully operational

export const mockQuranVerses = [
    {
      id: "001007",
      surahNumber: 1,
      ayahNumber: 7,
      arabicText: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translationEn: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.",
      surahName: "Al-Fatihah"
    },
    {
      id: "002186",
      surahNumber: 2,
      ayahNumber: 186,
      arabicText: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
      translationEn: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me and believe in Me that they may be guided.",
      surahName: "Al-Baqarah"
    },
    {
      id: "003190",
      surahNumber: 3,
      ayahNumber: 190,
      arabicText: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ",
      translationEn: "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.",
      surahName: "Aal-Imran"
    },
    {
      id: "005077",
      surahNumber: 5,
      ayahNumber: 77,
      arabicText: "قُلْ يَا أَهْلَ الْكِتَابِ لَا تَغْلُوا فِي دِينِكُمْ غَيْرَ الْحَقِّ وَلَا تَتَّبِعُوا أَهْوَاءَ قَوْمٍ قَدْ ضَلُّوا مِنْ قَبْلُ وَأَضَلُّوا كَثِيرًا وَضَلُّوا عَنْ سَوَاءِ السَّبِيلِ",
      translationEn: "Say, 'O People of the Scripture, do not exceed limits in your religion beyond the truth and do not follow the inclinations of a people who had gone astray before and misled many and have strayed from the soundness of the way.'",
      surahName: "Al-Ma'idah"
    },
    {
      id: "017082",
      surahNumber: 17,
      ayahNumber: 82,
      arabicText: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ ۙ وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا خَسَارًا",
      translationEn: "And We send down of the Qur'an that which is healing and mercy for the believers, but it does not increase the wrongdoers except in loss.",
      surahName: "Al-Isra"
    },
    {
      id: "049013",
      surahNumber: 49,
      ayahNumber: 13,
      arabicText: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُمْ مِنْ ذَكَرٍ وَأُنْثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ ۚ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
      translationEn: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.",
      surahName: "Al-Hujurat"
    },
    {
      id: "055001",
      surahNumber: 55,
      ayahNumber: 1,
      arabicText: "الرَّحْمَٰنُ",
      translationEn: "The Most Merciful",
      surahName: "Ar-Rahman"
    },
    {
      id: "093001",
      surahNumber: 93,
      ayahNumber: 1,
      arabicText: "وَالضُّحَىٰ",
      translationEn: "By the morning brightness",
      surahName: "Ad-Duha"
    },
    {
      id: "002286",
      surahNumber: 2,
      ayahNumber: 286,
      arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translationEn: "Allah does not burden a soul beyond that it can bear.",
      surahName: "Al-Baqarah"
    },
    {
      id: "094005",
      surahNumber: 94,
      ayahNumber: 5,
      arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translationEn: "For indeed, with hardship [will be] ease.",
      surahName: "Ash-Sharh"
    }
  ];
  
  export const getRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * mockQuranVerses.length);
    return mockQuranVerses[randomIndex];
  };
  
  export const getSurahReference = (verse) => {
    return `${verse.surahName} ${verse.surahNumber}:${verse.ayahNumber}`;
  };
  