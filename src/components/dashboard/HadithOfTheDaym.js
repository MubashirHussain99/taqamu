import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import { quran } from '@quranjs/api';
const DailyHadith = ({hadithText, narrator, source, hadithNumber, bookName}) => {
  // quran.v4.chapters.findAll().then(console.log); // will log all chapters
  return (
    <View style={styles.container}>
      <Text style={styles.hadithText}>"{hadithText}"</Text>
      <Text style={styles.meta}>📖 Book: {bookName}</Text>
      {/* <Text style={styles.source}>📚 Hadith No: {hadithNumber}</Text> */}
      {/* <Text style={styles.meta}>👤 Narrator: {narrator}</Text> */}
      <Text style={styles.source}>📚 Source: {source}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  hadithText: {
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  meta: {
    fontSize: 14,
    color: '#fff',
  },
  source: {
    fontSize: 12,
    color: '#fff',
  },
});

export default DailyHadith;
