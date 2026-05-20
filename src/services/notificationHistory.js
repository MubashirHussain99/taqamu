import AsyncStorage from '@react-native-async-storage/async-storage';
import {format, isToday, parseISO} from 'date-fns';

const STORAGE_KEY = '@taqamu/daily_notifications';

function getTodayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

async function readStore() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {date: getTodayKey(), items: []};
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.date || parsed.date !== getTodayKey()) {
      return {date: getTodayKey(), items: []};
    }
    return {
      date: parsed.date,
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch (error) {
    console.error('notificationHistory readStore', error);
    return {date: getTodayKey(), items: []};
  }
}

async function writeStore(store) {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({date: getTodayKey(), items: store.items}),
  );
}

/**
 * Returns today's notifications (newest first). Clears automatically when the calendar day changes.
 */
export async function getDailyNotifications() {
  const store = await readStore();
  return [...store.items].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export async function getDailyNotificationCount() {
  const items = await getDailyNotifications();
  return items.length;
}

/**
 * Upsert a notification for today. Same `id` replaces the previous entry.
 */
export async function addDailyNotification({
  id,
  type = 'info',
  title,
  body,
  meta = {},
}) {
  if (!id || !title) {
    return null;
  }

  const store = await readStore();
  const timestamp = new Date().toISOString();
  const entry = {
    id,
    type,
    title,
    body: body || '',
    timestamp,
    meta,
  };

  const index = store.items.findIndex(item => item.id === id);
  if (index >= 0) {
    store.items[index] = {...store.items[index], ...entry, timestamp};
  } else {
    store.items.push(entry);
  }

  await writeStore(store);
  return entry;
}

export function getUpcomingPrayer(prayers, currentPrayer) {
  if (!prayers?.length || !currentPrayer?.name) {
    return null;
  }

  const currentIndex = prayers.findIndex(
    p => p.name.toLowerCase() === currentPrayer.name.toLowerCase(),
  );

  if (currentIndex < 0) {
    return null;
  }

  for (let i = currentIndex + 1; i < prayers.length; i++) {
    if (prayers[i]?.name?.toLowerCase() !== 'sunrise') {
      return prayers[i];
    }
  }

  const fajr = prayers.find(p => p.name.toLowerCase() === 'fajr');
  return fajr || null;
}

/**
 * Keeps current / upcoming prayer cards in sync with live prayer data.
 */
export async function syncPrayerNotifications({
  currentPrayer,
  nextPrayer,
  locationLabel,
}) {
  if (locationLabel) {
    await addDailyNotification({
      id: 'prayer-times-ready',
      type: 'info',
      title: 'Prayer times updated',
      body: `Schedule for ${locationLabel}`,
      meta: {locationLabel},
    });
  }

  if (currentPrayer?.name) {
    await addDailyNotification({
      id: `current-${currentPrayer.name.toLowerCase()}`,
      type: 'prayer_current',
      title: `Current: ${currentPrayer.name}`,
      body: `Prayer period · started at ${currentPrayer.time}`,
      meta: {
        prayerName: currentPrayer.name,
        arabicName: currentPrayer.arabicName,
        time: currentPrayer.time,
      },
    });
  }

  if (nextPrayer?.name && nextPrayer.name !== currentPrayer?.name) {
    await addDailyNotification({
      id: `upcoming-${nextPrayer.name.toLowerCase()}`,
      type: 'prayer_upcoming',
      title: `Next: ${nextPrayer.name}`,
      body: nextPrayer.remainingTime
        ? `${nextPrayer.remainingTime} · ${nextPrayer.time}`
        : `Starts at ${nextPrayer.time}`,
      meta: {
        prayerName: nextPrayer.name,
        arabicName: nextPrayer.arabicName,
        time: nextPrayer.time,
      },
    });
  }
}

/** Log when the active prayer window changes (e.g. Fajr → Dhuhr). */
export async function recordPrayerTransition(previousName, nextPrayer) {
  if (!nextPrayer?.name || previousName === nextPrayer.name) {
    return;
  }

  await addDailyNotification({
    id: `transition-${nextPrayer.name.toLowerCase()}-${getTodayKey()}`,
    type: 'prayer_started',
    title: `${nextPrayer.name} prayer time`,
    body: `It's time for ${nextPrayer.name} · ${nextPrayer.time}`,
    meta: {
      prayerName: nextPrayer.name,
      previousPrayer: previousName,
      time: nextPrayer.time,
    },
  });
}

/** Log when a system prayer alert is shown. */
export async function recordPrayerAlert(prayerName, body) {
  await addDailyNotification({
    id: `alert-${prayerName?.toLowerCase()}-${Date.now()}`,
    type: 'reminder',
    title: `${prayerName} Prayer Time`,
    body: body || `It's time for ${prayerName} prayer`,
    meta: {prayerName},
  });
}

export function formatNotificationTime(timestamp) {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    if (!isToday(date)) {
      return format(date, 'MMM d, h:mm a');
    }
    return format(date, 'h:mm a');
  } catch {
    return '';
  }
}
