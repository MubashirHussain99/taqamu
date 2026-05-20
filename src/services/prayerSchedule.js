import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import {format, differenceInMinutes} from 'date-fns';
import {
  Coordinates,
  CalculationMethod,
  HighLatitudeRule,
  Madhab,
  PrayerTimes,
} from 'adhan';

export const PRAYER_ARABIC_NAMES = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

const COORDS_CACHE_PREFIX = 'prayerCoords:';
const COORDS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const PRAYER_STATUS_KEY = '@taqamu/prayer_status';

const getCoordsCacheKey = (cityName, countryName) =>
  `${COORDS_CACHE_PREFIX}${cityName}|${countryName}`.toLowerCase();

const isValidCoordinates = coords =>
  Number.isFinite(coords?.latitude) && Number.isFinite(coords?.longitude);

function capitalizePrayerKey(key) {
  if (!key || key === 'none') {
    return null;
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function getFormattedRemainingTime(prayerTime) {
  const now = new Date();
  const diffMinutes = differenceInMinutes(prayerTime, now);

  if (diffMinutes <= 0) {
    return 'Starting now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min remaining`;
  }
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours} hr ${minutes} min remaining`;
}

export function getCalculationParams(methodKey = 'MWL') {
  let params;

  switch (methodKey) {
    case 'ICCI':
      params = CalculationMethod.Other();
      params.fajrAngle = 12;
      params.ishaAngle = 12;
      params.madhab = Madhab.Shafi;
      params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
      break;
    case 'MWL':
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case 'ISNA':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'UmmAlQura':
      params = CalculationMethod.UmmAlQura();
      break;
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'Tehran':
      params = CalculationMethod.Tehran();
      break;
    case 'Karachi':
      params = CalculationMethod.Karachi();
      break;
    case 'France12':
      params = CalculationMethod.Other();
      params.fajrAngle = 12;
      params.ishaAngle = 12;
      break;
    case 'France15':
      params = CalculationMethod.Other();
      params.fajrAngle = 15;
      params.ishaAngle = 15;
      break;
    case 'France18':
      params = CalculationMethod.Other();
      params.fajrAngle = 18;
      params.ishaAngle = 18;
      break;
    case 'Jafari':
      params = CalculationMethod.Other();
      params.fajrAngle = 16;
      params.ishaAngle = 14;
      break;
    default:
      params = CalculationMethod.MuslimWorldLeague();
      break;
  }

  if (params) {
    params.madhab = Madhab.Shafi;
    params.adjustments = {fajr: -2, isha: 5};
  }

  return params || CalculationMethod.MuslimWorldLeague();
}

export function buildPrayerSchedule(latitude, longitude, methodKey = 'MWL') {
  const date = new Date();
  const coordinates = new Coordinates(latitude, longitude);
  const params = getCalculationParams(methodKey);
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const now = new Date();

  const prayers = [
    {
      name: 'Fajr',
      arabicName: PRAYER_ARABIC_NAMES.fajr,
      time: format(prayerTimes.fajr, 'h:mm a'),
      exactTime: new Date(prayerTimes.fajr),
      isCurrentPrayer: false,
    },
    {
      name: 'Sunrise',
      arabicName: PRAYER_ARABIC_NAMES.sunrise,
      time: format(prayerTimes.sunrise, 'h:mm a'),
      exactTime: new Date(prayerTimes.sunrise),
      isCurrentPrayer: false,
    },
    {
      name: 'Dhuhr',
      arabicName: PRAYER_ARABIC_NAMES.dhuhr,
      time: format(prayerTimes.dhuhr, 'h:mm a'),
      exactTime: new Date(prayerTimes.dhuhr),
      isCurrentPrayer: false,
    },
    {
      name: 'Asr',
      arabicName: PRAYER_ARABIC_NAMES.asr,
      time: format(prayerTimes.asr, 'h:mm a'),
      exactTime: new Date(prayerTimes.asr),
      isCurrentPrayer: false,
    },
    {
      name: 'Maghrib',
      arabicName: PRAYER_ARABIC_NAMES.maghrib,
      time: format(prayerTimes.maghrib, 'h:mm a'),
      exactTime: new Date(prayerTimes.maghrib),
      isCurrentPrayer: false,
    },
    {
      name: 'Isha',
      arabicName: PRAYER_ARABIC_NAMES.isha,
      time: format(prayerTimes.isha, 'h:mm a'),
      exactTime: new Date(prayerTimes.isha),
      isCurrentPrayer: false,
    },
  ];

  const findPrayer = key => {
    const normalized = capitalizePrayerKey(key);
    if (!normalized) {
      return null;
    }
    return prayers.find(
      prayer => prayer.name.toLowerCase() === normalized.toLowerCase(),
    );
  };

  const currentKey = prayerTimes.currentPrayer(now);
  const nextKey = prayerTimes.nextPrayer(now);

  let currentPrayer = findPrayer(currentKey);
  let nextPrayer = findPrayer(nextKey);

  if (currentPrayer) {
    currentPrayer = {...currentPrayer, isCurrentPrayer: true};
  }

  if (nextPrayer) {
    nextPrayer = {
      ...nextPrayer,
      isCurrentPrayer: false,
      remainingTime: getFormattedRemainingTime(nextPrayer.exactTime),
    };
  }

  prayers.forEach(prayer => {
    prayer.isCurrentPrayer =
      !!currentPrayer &&
      prayer.name.toLowerCase() === currentPrayer.name.toLowerCase();
  });

  return {
    prayers,
    currentPrayer,
    nextPrayer,
    scheduleNotifications: prayers.filter(prayer => prayer.exactTime > now),
  };
}

async function readCachedCoordinates(city, country, allowExpired = false) {
  try {
    const raw = await AsyncStorage.getItem(getCoordsCacheKey(city, country));
    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw);
    if (!allowExpired && Date.now() - cached.cachedAt > COORDS_CACHE_TTL_MS) {
      return null;
    }

    const coords = {
      latitude: cached.latitude,
      longitude: cached.longitude,
    };

    return isValidCoordinates(coords) ? coords : null;
  } catch {
    return null;
  }
}

async function writeCachedCoordinates(city, country, coords) {
  await AsyncStorage.setItem(
    getCoordsCacheKey(city, country),
    JSON.stringify({
      latitude: coords.latitude,
      longitude: coords.longitude,
      cachedAt: Date.now(),
    }),
  );
}

function buildGeocodeQuery(city, country) {
  const cityName = city?.trim() || '';
  const countryName = country?.trim() || '';

  if (!cityName && !countryName) {
    return null;
  }

  if (
    countryName &&
    cityName.toLowerCase().includes(countryName.toLowerCase())
  ) {
    return cityName;
  }

  if (cityName && countryName) {
    return `${cityName}, ${countryName}`;
  }

  return cityName || countryName;
}

function getDeviceCoordinates() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      reject,
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 600000},
    );
  });
}

async function fetchCoordinatesFromApi(city, country) {
  const query = buildGeocodeQuery(city, country);
  if (!query) {
    throw new Error('Location not available');
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query,
  )}&format=json&limit=1`;

  const response = await axios.get(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'Taqamu/1.0 nexomosmubashir@gmail.com',
    },
    timeout: 15000,
  });

  const results = response.data;

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('No coordinates found for this location');
  }

  const data = results[0];
  const coords = {
    latitude: parseFloat(data.lat),
    longitude: parseFloat(data.lon),
  };

  if (!isValidCoordinates(coords)) {
    throw new Error('Invalid coordinates returned for this location');
  }

  return coords;
}

export async function resolveCoordinates(city, country) {
  if (!city?.trim() || !country?.trim()) {
    return null;
  }

  const freshCache = await readCachedCoordinates(city, country);
  if (freshCache) {
    return freshCache;
  }

  try {
    const coords = await fetchCoordinatesFromApi(city, country);
    await writeCachedCoordinates(city, country, coords);
    return coords;
  } catch {
    const staleCache = await readCachedCoordinates(city, country, true);
    if (staleCache) {
      return staleCache;
    }

    try {
      const deviceCoords = await getDeviceCoordinates();
      if (isValidCoordinates(deviceCoords)) {
        await writeCachedCoordinates(city, country, deviceCoords);
        return deviceCoords;
      }
    } catch {
      // fall through
    }
  }

  return null;
}

export async function fetchPrayerStatusForLocation(city, country, methodKey) {
  const coords = await resolveCoordinates(city, country);
  if (!coords) {
    return null;
  }

  const {currentPrayer, nextPrayer, prayers} = buildPrayerSchedule(
    coords.latitude,
    coords.longitude,
    methodKey,
  );

  return {
    currentPrayer,
    nextPrayer,
    prayers,
    locationLabel: [city, country].filter(Boolean).join(', '),
    updatedAt: new Date().toISOString(),
  };
}

export async function persistPrayerStatus(status) {
  if (!status) {
    return;
  }
  await AsyncStorage.setItem(PRAYER_STATUS_KEY, JSON.stringify(status));
}

export async function getStoredPrayerStatus() {
  try {
    const raw = await AsyncStorage.getItem(PRAYER_STATUS_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
