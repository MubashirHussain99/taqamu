import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {format} from 'date-fns';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {APP_BACKGROUND} from '../../styles/screenStyles';
import {
  getDailyNotifications,
  formatNotificationTime,
} from '../../services/notificationHistory';
import {
  fetchPrayerStatusForLocation,
  getStoredPrayerStatus,
  persistPrayerStatus,
} from '../../services/prayerSchedule';

const TYPE_CONFIG = {
  prayer_current: {icon: 'time-outline', color: '#34d399'},
  prayer_upcoming: {icon: 'alarm-outline', color: '#fbbf24'},
  prayer_started: {icon: 'megaphone-outline', color: '#60a5fa'},
  reminder: {icon: 'notifications', color: '#f472b6'},
  info: {icon: 'information-circle-outline', color: '#a7f3d0'},
};

const Notifications = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [prayerStatus, setPrayerStatus] = useState(null);
  const [clockTime, setClockTime] = useState(format(new Date(), 'h:mm:ss a'));
  const [prayerLoading, setPrayerLoading] = useState(true);

  const loadPrayerStatus = useCallback(async () => {
    try {
      const cached = await getStoredPrayerStatus();
      if (cached?.currentPrayer || cached?.nextPrayer) {
        setPrayerStatus(cached);
      }

      const uid = auth().currentUser?.uid;
      if (!uid) {
        return;
      }

      const userDoc = await firestore().collection('users').doc(uid).get();
      if (!userDoc.exists) {
        return;
      }

      const {city, country} = userDoc.data() || {};
      if (!city?.trim() || !country?.trim()) {
        return;
      }

      const status = await fetchPrayerStatusForLocation(city, country);
      if (status) {
        setPrayerStatus(status);
        await persistPrayerStatus(status);
      }
    } catch (error) {
      console.error('Failed to load prayer status:', error);
    } finally {
      setPrayerLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    const list = await getDailyNotifications();
    setItems(list);
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadNotifications(), loadPrayerStatus()]);
  }, [loadNotifications, loadPrayerStatus]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setPrayerLoading(true);
      loadAll().finally(() => {
        if (active) {
          setLoading(false);
        }
      });
      const refreshInterval = setInterval(() => {
        loadPrayerStatus();
        loadNotifications();
      }, 60000);
      const clockInterval = setInterval(() => {
        setClockTime(format(new Date(), 'h:mm:ss a'));
      }, 1000);
      return () => {
        active = false;
        clearInterval(refreshInterval);
        clearInterval(clockInterval);
      };
    }, [loadAll, loadNotifications, loadPrayerStatus]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setPrayerLoading(true);
    await loadAll();
    setRefreshing(false);
  };

  const todayLabel = format(new Date(), 'EEEE, MMM d');

  const renderPrayerSummary = () => (
    <View style={styles.prayerSummary}>
      <View style={styles.clockRow}>
        <Ionicons name="time-outline" size={18} color="#6ee7b7" />
        <Text style={styles.clockLabel}>Current time</Text>
        <Text style={styles.clockValue}>{clockTime}</Text>
      </View>

      {prayerLoading && !prayerStatus ? (
        <ActivityIndicator
          size="small"
          color="#f59e0b"
          style={styles.prayerLoader}
        />
      ) : (
        <View style={styles.prayerRow}>
          <View style={styles.prayerBlock}>
            <Text style={styles.prayerBlockLabel}>Current prayer</Text>
            {prayerStatus?.currentPrayer ? (
              <>
                <Text style={styles.prayerName}>
                  {prayerStatus.currentPrayer.name}
                </Text>
                <Text style={styles.prayerArabic}>
                  {prayerStatus.currentPrayer.arabicName}
                </Text>
                <Text style={styles.prayerTime}>
                  {prayerStatus.currentPrayer.time}
                </Text>
              </>
            ) : (
              <Text style={styles.prayerPlaceholder}>Between prayers</Text>
            )}
          </View>

          <View style={styles.prayerDivider} />

          <View style={styles.prayerBlock}>
            <Text style={styles.prayerBlockLabel}>Next prayer</Text>
            {prayerStatus?.nextPrayer ? (
              <>
                <Text style={styles.prayerName}>
                  {prayerStatus.nextPrayer.name}
                </Text>
                <Text style={styles.prayerArabic}>
                  {prayerStatus.nextPrayer.arabicName}
                </Text>
                <Text style={styles.prayerTime}>
                  {prayerStatus.nextPrayer.time}
                </Text>
                {prayerStatus.nextPrayer.remainingTime ? (
                  <Text style={styles.prayerRemaining}>
                    {prayerStatus.nextPrayer.remainingTime}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.prayerPlaceholder}>Unavailable</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderItem = ({item}) => {
    const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.info;

    return (
      <View style={styles.card}>
        <View style={[styles.iconWrap, {backgroundColor: `${config.color}22`}]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardTime}>
              {formatNotificationTime(item.timestamp)}
            </Text>
          </View>
          {item.body ? (
            <Text style={styles.cardBodyText} numberOfLines={3}>
              {item.body}
            </Text>
          ) : null}
          {item.meta?.prayerName && item.meta?.time ? (
            <Text style={styles.cardMeta}>
              {item.meta.prayerName} · {item.meta.time}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back">
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Notifications</Text>
          <Text style={styles.headerSubtitle}>{todayLabel}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {loading && items.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.statusText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderPrayerSummary}
          contentContainerStyle={[
            styles.listContent,
            items.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f59e0b"
              colors={['#f59e0b']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#6ee7b7"
              />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyText}>
                Prayer reminders and updates for today will appear here. They
                reset automatically at midnight.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
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
  prayerSummary: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  clockLabel: {
    color: '#94a3b8',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  clockValue: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  prayerLoader: {
    marginVertical: 12,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  prayerBlock: {
    flex: 1,
  },
  prayerDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 12,
  },
  prayerBlockLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  prayerName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  prayerArabic: {
    color: '#f59e0b',
    fontSize: 14,
    marginTop: 2,
  },
  prayerTime: {
    color: '#d1fae5',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  prayerRemaining: {
    color: '#6ee7b7',
    fontSize: 12,
    marginTop: 4,
  },
  prayerPlaceholder: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  cardTime: {
    color: '#94a3b8',
    fontSize: 12,
  },
  cardBodyText: {
    color: '#cbd5e1',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  cardMeta: {
    color: '#6ee7b7',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusText: {
    color: '#d1fae5',
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyText: {
    color: '#a7f3d0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});

export default Notifications;
