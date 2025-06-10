const getCalculationParams = async () => {
  let method = 'MWL';
  try {
    const storedMethod = await AsyncStorage.getItem('prayerCalcMethod');
    if (storedMethod) {
      method = storedMethod;
    }
  } catch (e) {
    console.warn('Could not load stored method, defaulting to MWL');
  }

  if (method === 'ICCI') {
    const params = CalculationMethod.Other();
    params.fajrAngle = 12;
    params.ishaAngle = 12;
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
    params.madhab = Madhab.Shafi;
    return params;
  }

  if (method === 'LONDON') {
    const params = CalculationMethod.Other();
    params.fajrAngle = 18;
    params.ishaAngle = 18;
    params.highLatitudeRule = HighLatitudeRule.AngleBased;
    params.madhab = Madhab.Hanafi;
    return params;
  }

  // Default: MWL
  const params = CalculationMethod.MuslimWorldLeague();
  params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  params.madhab = Madhab.Shafi;
  return params;
};
