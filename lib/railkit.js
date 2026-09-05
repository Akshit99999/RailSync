import {
  configure,
  trackTrain as rkTrackTrain,
  checkPNRStatus as rkCheckPNRStatus,
  searchTrainBetweenStations as rkSearchTrainBetweenStations,
  trainByNumber as rkTrainByNumber,
} from 'railkit';
import { getStationByCode } from './stations-data';

// Initialize RailKit if API key is present
const apiKey = process.env.RAILKIT_API_KEY;
if (apiKey) {
  try {
    configure(apiKey);
  } catch (err) {
    console.warn('RailKit configuration warning:', err.message);
  }
}

// Built-in realistic fallback routes for offline/demo development
const DEMO_TRAINS = {
  '12952': {
    trainNumber: '12952',
    trainName: 'NEW DELHI - MUMBAI CENTRAL TEJAS RAJDHANI',
    origin: 'NDLS',
    destination: 'MMCT',
    departureTime: '16:55',
    arrivalTime: '08:35',
    currentStatus: 'Departed KOTA JN (KOTA) • Running 12 mins late',
    delayMinutes: 12,
    lastReportedStation: 'KOTA',
    nextStation: 'RTM',
    speed: '124 km/h',
    distanceCovered: '465 km',
    totalDistance: '1386 km',
    coordinates: { lat: 24.3, lng: 75.4 }, // Near Shamgarh/Bhawani Mandi
    route: [
      { code: 'NDLS', name: 'New Delhi', platform: '1', scheduledArrival: '--:--', scheduledDeparture: '16:55', actualArrival: '--:--', actualDeparture: '16:55', delay: 0, status: 'departed', lat: 28.6424, lng: 77.2215 },
      { code: 'MTJ', name: 'Mathura Jn', platform: '3', scheduledArrival: '18:53', scheduledDeparture: '18:55', actualArrival: '18:58', actualDeparture: '19:00', delay: 5, status: 'departed', lat: 27.4924, lng: 77.6737 },
      { code: 'KOTA', name: 'Kota Jn', platform: '1A', scheduledArrival: '21:30', scheduledDeparture: '21:40', actualArrival: '21:40', actualDeparture: '21:52', delay: 12, status: 'departed', lat: 25.2138, lng: 75.8648 },
      { code: 'RTM', name: 'Ratlam Jn', platform: '4', scheduledArrival: '00:15', scheduledDeparture: '00:18', actualArrival: '00:27', actualDeparture: '00:30', delay: 12, status: 'upcoming', lat: 23.3344, lng: 75.0375 },
      { code: 'BRC', name: 'Vadodara Jn', platform: '1', scheduledArrival: '03:45', scheduledDeparture: '03:55', actualArrival: '03:55', actualDeparture: '04:05', delay: 10, status: 'upcoming', lat: 22.3107, lng: 73.1812 },
      { code: 'ST', name: 'Surat', platform: '2', scheduledArrival: '05:13', scheduledDeparture: '05:18', actualArrival: '05:21', actualDeparture: '05:26', delay: 8, status: 'upcoming', lat: 21.2049, lng: 72.8407 },
      { code: 'BVI', name: 'Borivali', platform: '7', scheduledArrival: '07:40', scheduledDeparture: '07:42', actualArrival: '07:44', actualDeparture: '07:46', delay: 4, status: 'upcoming', lat: 19.2290, lng: 72.8573 },
      { code: 'MMCT', name: 'Mumbai Central', platform: '5', scheduledArrival: '08:35', scheduledDeparture: '--:--', actualArrival: '08:35', actualDeparture: '--:--', delay: 0, status: 'upcoming', lat: 18.9696, lng: 72.8193 }
    ]
  },
  '22436': {
    trainNumber: '22436',
    trainName: 'VANDE BHARAT EXPRESS',
    origin: 'NDLS',
    destination: 'BSB',
    departureTime: '06:00',
    arrivalTime: '14:00',
    currentStatus: 'Approaching PRAYAGRAJ JN (PRYJ) • Right Time',
    delayMinutes: 0,
    lastReportedStation: 'CNB',
    nextStation: 'PRYJ',
    speed: '130 km/h',
    distanceCovered: '634 km',
    totalDistance: '759 km',
    coordinates: { lat: 25.75, lng: 81.3 }, // Near Fatehpur/Sirathu
    route: [
      { code: 'NDLS', name: 'New Delhi', platform: '16', scheduledArrival: '--:--', scheduledDeparture: '06:00', actualArrival: '--:--', actualDeparture: '06:00', delay: 0, status: 'departed', lat: 28.6424, lng: 77.2215 },
      { code: 'CNB', name: 'Kanpur Central', platform: '5', scheduledArrival: '10:08', scheduledDeparture: '10:10', actualArrival: '10:08', actualDeparture: '10:10', delay: 0, status: 'departed', lat: 26.4547, lng: 80.3507 },
      { code: 'PRYJ', name: 'Prayagraj Jn', platform: '6', scheduledArrival: '12:08', scheduledDeparture: '12:10', actualArrival: '12:08', actualDeparture: '12:10', delay: 0, status: 'upcoming', lat: 25.4438, lng: 81.8285 },
      { code: 'BSB', name: 'Varanasi Jn', platform: '1', scheduledArrival: '14:00', scheduledDeparture: '--:--', actualArrival: '14:00', actualDeparture: '--:--', delay: 0, status: 'upcoming', lat: 25.3268, lng: 82.9863 }
    ]
  },
  '12002': {
    trainNumber: '12002',
    trainName: 'BHOPAL SHATABDI EXPRESS',
    origin: 'NDLS',
    destination: 'RKMP',
    departureTime: '06:00',
    arrivalTime: '14:40',
    currentStatus: 'Departed GWALIOR JN (GWL) • 7 mins delay',
    delayMinutes: 7,
    lastReportedStation: 'GWL',
    nextStation: 'VGLJ',
    speed: '120 km/h',
    distanceCovered: '318 km',
    totalDistance: '708 km',
    coordinates: { lat: 25.8, lng: 78.35 },
    route: [
      { code: 'NDLS', name: 'New Delhi', platform: '1', scheduledArrival: '--:--', scheduledDeparture: '06:00', actualArrival: '--:--', actualDeparture: '06:00', delay: 0, status: 'departed', lat: 28.6424, lng: 77.2215 },
      { code: 'MTJ', name: 'Mathura Jn', platform: '1', scheduledArrival: '07:19', scheduledDeparture: '07:20', actualArrival: '07:21', actualDeparture: '07:22', delay: 2, status: 'departed', lat: 27.4924, lng: 77.6737 },
      { code: 'AGC', name: 'Agra Cantt', platform: '1', scheduledArrival: '07:50', scheduledDeparture: '07:55', actualArrival: '07:52', actualDeparture: '07:57', delay: 2, status: 'departed', lat: 27.1591, lng: 77.9897 },
      { code: 'GWL', name: 'Gwalior Jn', platform: '1', scheduledArrival: '09:23', scheduledDeparture: '09:28', actualArrival: '09:30', actualDeparture: '09:35', delay: 7, status: 'departed', lat: 26.2163, lng: 78.1887 },
      { code: 'VGLJ', name: 'V Lakshmibai Jhansi', platform: '2', scheduledArrival: '10:45', scheduledDeparture: '10:53', actualArrival: '10:50', actualDeparture: '10:58', delay: 5, status: 'upcoming', lat: 25.4484, lng: 78.5685 },
      { code: 'BPL', name: 'Bhopal Jn', platform: '1', scheduledArrival: '14:07', scheduledDeparture: '14:12', actualArrival: '14:10', actualDeparture: '14:15', delay: 3, status: 'upcoming', lat: 23.2662, lng: 77.4103 },
      { code: 'RKMP', name: 'Rani Kamalapati', platform: '5', scheduledArrival: '14:40', scheduledDeparture: '--:--', actualArrival: '14:40', actualDeparture: '--:--', delay: 0, status: 'upcoming', lat: 23.2183, lng: 77.4374 }
    ]
  }
};

/**
 * Track train with live RailKit call or fallback
 */
export async function trackTrainLive(trainNumber, date = 'today') {
  const cleanNumber = String(trainNumber || '').trim();
  if (cleanNumber.length !== 5) {
    return { success: false, error: 'Train number must be a 5-digit string (e.g. 12952).' };
  }

  // 1. Try RailKit if API key is configured
  if (apiKey) {
    try {
      const res = await rkTrackTrain(cleanNumber, date);
      if (res && res.success && res.data) {
        return { success: true, data: res.data, source: 'railkit-live' };
      }
      if (res && res.error) {
        console.warn('RailKit live tracking error:', res.error);
      }
    } catch (err) {
      console.warn('RailKit call failed, falling back to simulator:', err.message);
    }
  }

  // 2. Demo fallback
  if (DEMO_TRAINS[cleanNumber]) {
    return { success: true, data: DEMO_TRAINS[cleanNumber], source: 'simulator' };
  }

  // Generate an intelligent realistic route for unlisted train numbers
  return {
    success: true,
    data: {
      trainNumber: cleanNumber,
      trainName: `EXP ${cleanNumber} SUPERFAST`,
      origin: 'NDLS',
      destination: 'HWH',
      departureTime: '17:10',
      arrivalTime: '10:45',
      currentStatus: `Running on schedule • Cleared Block Section`,
      delayMinutes: 5,
      lastReportedStation: 'CNB',
      nextStation: 'PRYJ',
      speed: '108 km/h',
      distanceCovered: '440 km',
      totalDistance: '1445 km',
      coordinates: { lat: 26.0, lng: 80.9 },
      route: [
        { code: 'NDLS', name: 'New Delhi', platform: '14', scheduledArrival: '--:--', scheduledDeparture: '17:10', actualArrival: '--:--', actualDeparture: '17:10', delay: 0, status: 'departed', lat: 28.6424, lng: 77.2215 },
        { code: 'CNB', name: 'Kanpur Central', platform: '4', scheduledArrival: '21:30', scheduledDeparture: '21:35', actualArrival: '21:35', actualDeparture: '21:40', delay: 5, status: 'departed', lat: 26.4547, lng: 80.3507 },
        { code: 'PRYJ', name: 'Prayagraj Jn', platform: '5', scheduledArrival: '23:45', scheduledDeparture: '23:50', actualArrival: '23:50', actualDeparture: '23:55', delay: 5, status: 'upcoming', lat: 25.4438, lng: 81.8285 },
        { code: 'DDU', name: 'Pt Deen Dayal Upadhyaya Jn', platform: '2', scheduledArrival: '02:25', scheduledDeparture: '02:35', actualArrival: '02:30', actualDeparture: '02:40', delay: 5, status: 'upcoming', lat: 25.2818, lng: 83.1189 },
        { code: 'HWH', name: 'Howrah Jn', platform: '9', scheduledArrival: '10:45', scheduledDeparture: '--:--', actualArrival: '10:50', actualDeparture: '--:--', delay: 5, status: 'upcoming', lat: 22.5839, lng: 88.3426 }
      ]
    },
    source: 'simulator'
  };
}

/**
 * Check PNR status
 */
export async function getPNRDetails(pnr) {
  const cleanPnr = String(pnr || '').replace(/\D/g, '');
  if (cleanPnr.length !== 10) {
    return { success: false, error: 'PNR must be exactly 10 digits.' };
  }

  if (apiKey) {
    try {
      const res = await rkCheckPNRStatus(cleanPnr);
      if (res && res.success && res.data) {
        return { success: true, data: res.data, source: 'railkit-live' };
      }
      if (res && res.error) {
        console.warn('RailKit PNR error:', res.error);
      }
    } catch (err) {
      console.warn('RailKit PNR call failed, falling back:', err.message);
    }
  }

  // Realistic mock PNR
  return {
    success: true,
    data: {
      pnr: cleanPnr,
      trainNumber: '12952',
      trainName: 'NEW DELHI - MUMBAI TEJAS RAJDHANI',
      doj: '05-Sep-2026',
      fromStation: 'NDLS',
      fromStationName: 'New Delhi',
      toStation: 'MMCT',
      toStationName: 'Mumbai Central',
      boardingPoint: 'NDLS',
      reservationClass: '3A (AC 3 Tier)',
      chartStatus: 'CHART PREPARED',
      bookingStatus: 'CONFIRMED',
      passengers: [
        {
          number: 1,
          bookingStatus: 'CNF / B3 / 21 / LB',
          currentStatus: 'CNF',
          coach: 'B3',
          berth: '21',
          berthType: 'LOWER BERTH (LB)',
          concession: 'NONE'
        },
        {
          number: 2,
          bookingStatus: 'CNF / B3 / 22 / MB',
          currentStatus: 'CNF',
          coach: 'B3',
          berth: '22',
          berthType: 'MIDDLE BERTH (MB)',
          concession: 'NONE'
        }
      ]
    },
    source: 'simulator'
  };
}

/**
 * Search trains between stations
 */
export async function findTrainsBetween(fromCode, toCode, date = '') {
  const from = String(fromCode || '').trim().toUpperCase();
  const to = String(toCode || '').trim().toUpperCase();

  if (!from || !to) {
    return { success: false, error: 'Both origin and destination station codes are required.' };
  }

  if (apiKey) {
    try {
      const res = await rkSearchTrainBetweenStations(from, to, date);
      if (res && res.success && res.data) {
        return { success: true, data: res.data, source: 'railkit-live' };
      }
      if (res && res.error) {
        console.warn('RailKit search error:', res.error);
      }
    } catch (err) {
      console.warn('RailKit train search failed, using fallback:', err.message);
    }
  }

  // Fallback train matches
  const sampleTrains = [
    {
      trainNumber: '12952',
      trainName: 'TEJAS RAJDHANI EXP',
      departureTime: '16:55',
      arrivalTime: '08:35',
      duration: '15h 40m',
      fromStation: from,
      toStation: to,
      runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      classes: ['1A', '2A', '3A']
    },
    {
      trainNumber: '12954',
      trainName: 'AUGUST KRANTI RAJDHANI',
      departureTime: '17:15',
      arrivalTime: '10:05',
      duration: '16h 50m',
      fromStation: from,
      toStation: to,
      runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      classes: ['1A', '2A', '3A']
    },
    {
      trainNumber: '12910',
      trainName: 'GARIB RATH EXPRESS',
      departureTime: '15:35',
      arrivalTime: '08:10',
      duration: '16h 35m',
      fromStation: from,
      toStation: to,
      runningDays: ['W', 'F', 'S'],
      classes: ['3A']
    }
  ];

  return {
    success: true,
    data: sampleTrains,
    source: 'simulator'
  };
}
