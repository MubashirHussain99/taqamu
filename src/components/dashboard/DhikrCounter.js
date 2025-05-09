import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Progress from './Progress';

const DhikrCounter = ({
  dhikrType,
  arabicText,
  initialCount = 0,
  targetCount = 33,
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(false);

  const incrementCount = () => {
    if (count < targetCount) {
      const newCount = count + 1;
      setCount(newCount);
      if (onCountChange) {
        onCountChange(newCount);
      }
    }
  };

  const resetCount = () => {
    setCount(0);
    if (onCountChange) {
      onCountChange(0);
    }
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const percentage = Math.round((count / targetCount) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dhikrType}>{dhikrType}</Text>
        {count > 0 && (
          <TouchableOpacity onPress={resetCount}>
            <Text style={styles.reset}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.counterArea}
        onPress={toggleActive}
        activeOpacity={0.9}
      >
        <TouchableOpacity onPress={incrementCount} activeOpacity={0.8}>
          <View style={styles.arabicBlock}>
            <Text style={styles.arabicText}>{arabicText}</Text>
            <Text style={styles.percent}>{percentage}%</Text>
          </View>
        </TouchableOpacity>

        {/* <View style={styles.progressBackground}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View> */}
        <Progress value={percentage} />


        <View style={styles.countRow}>
          <Text style={styles.countText}>{count}</Text>
          <Text style={styles.countText}>{targetCount}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={isActive} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleActive}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{dhikrType}</Text>
            <Text style={styles.modalArabic}>{arabicText}</Text>
            <Text style={styles.modalCount}>
              {count} / {targetCount}
            </Text>

            <TouchableOpacity style={styles.reciteBtn} onPress={incrementCount}>
              <Text style={styles.reciteText}>Recite</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={toggleActive}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dhikrType: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  reset: {
    fontSize: 12,
    color: '#94A3B8',
  },
  counterArea: {
    alignItems: 'center',
    // width: '50%',
    height: "fit-content",
  },
  arabicBlock: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  arabicText: {
    fontSize: 32,
    color: '#FBBF24',
    marginBottom: 4,
  },
  percent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FCD34D',
  },
  progressBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FBBF24',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  countText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    borderColor: '#FBBF24',
    borderWidth: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#F8FAFC',
    marginBottom: 8,
  },
  modalArabic: {
    fontSize: 36,
    color: '#FBBF24',
    marginBottom: 16,
  },
  modalCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 20,
  },
  reciteBtn: {
    backgroundColor: '#FBBF24',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 8,
  },
  reciteText: {
    textAlign: 'center',
    color: '#1E293B',
    fontWeight: '600',
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
  },
  closeText: {
    textAlign: 'center',
    color: '#CBD5E1',
    fontSize: 14,
  },
});

export default DhikrCounter;
