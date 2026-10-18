// RailSync Relational Database Query Engine (DBMS Layer)
// Simulates relational schema operations with joins, filtering, and indexing.

import { POPULAR_STATIONS, getStationByCode } from './stations-data';

// Relational in-memory store representing SQL tables
export const RELATIONAL_DB = {
  stations: POPULAR_STATIONS,

  trains: [
    {
      trainNumber: '12952',
      trainName: 'Tejas Rajdhani Express',
      trainType: 'RAJDHANI',
      origin: 'NDLS',
      destination: 'MMCT',
      totalDistanceKm: 1386,
      hasPantry: true,
      daysOfRun: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      trainType: 'VANDE_BHARAT',
      origin: 'NDLS',
      destination: 'BSB',
      totalDistanceKm: 759,
      hasPantry: true,
      daysOfRun: [2, 3, 5, 6, 7],
    },
    {
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi Express',
      trainType: 'SHATABDI',
      origin: 'NDLS',
      destination: 'RKMP',
      totalDistanceKm: 708,
      hasPantry: true,
      daysOfRun: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      trainNumber: '12302',
      trainName: 'Howrah Rajdhani Express',
      trainType: 'RAJDHANI',
      origin: 'NDLS',
      destination: 'HWH',
      totalDistanceKm: 1450,
      hasPantry: true,
      daysOfRun: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      trainNumber: '12260',
      trainName: 'Sealdah AC Duronto Express',
      trainType: 'SUPERFAST',
      origin: 'NDLS',
      destination: 'SDAH',
      totalDistanceKm: 1458,
      hasPantry: true,
      daysOfRun: [1, 3, 4, 7],
    },
  ],

  // Train Schedules (Stop Progression Table)
  schedules: [
    { trainNumber: '12952', stationCode: 'NDLS', stopNumber: 1, arrival: null, departure: '16:55', distanceKm: 0, platform: '3' },
    { trainNumber: '12952', stationCode: 'KOTA', stopNumber: 2, arrival: '21:30', departure: '21:40', distanceKm: 465, platform: '1' },
    { trainNumber: '12952', stationCode: 'RTM', stopNumber: 3, arrival: '00:35', departure: '00:40', distanceKm: 731, platform: '4' },
    { trainNumber: '12952', stationCode: 'BRC', stopNumber: 4, arrival: '03:45', departure: '03:55', distanceKm: 992, platform: '2' },
    { trainNumber: '12952', stationCode: 'ST', stopNumber: 5, arrival: '05:13', departure: '05:18', distanceKm: 1122, platform: '1' },
    { trainNumber: '12952', stationCode: 'BVI', stopNumber: 6, arrival: '07:58', departure: '08:00', distanceKm: 1356, platform: '7' },
    { trainNumber: '12952', stationCode: 'MMCT', stopNumber: 7, arrival: '08:35', departure: null, distanceKm: 1386, platform: '1' },
  ],
};

/**
 * SQL JOIN equivalent: Query train details with full intermediate schedule and station meta
 */
export function queryTrainWithSchedule(trainNum) {
  const train = RELATIONAL_DB.trains.find((t) => t.trainNumber === trainNum);
  if (!train) return null;

  const scheduleStops = RELATIONAL_DB.schedules
    .filter((s) => s.trainNumber === trainNum)
    .sort((a, b) => a.stopNumber - b.stopNumber)
    .map((s) => {
      const station = getStationByCode(s.stationCode);
      return {
        ...s,
        stationName: station?.name || s.stationCode,
        zone: station?.zone || 'NR',
        lat: station?.lat,
        lng: station?.lng,
      };
    });

  return {
    ...train,
    originStation: getStationByCode(train.origin),
    destinationStation: getStationByCode(train.destination),
    stops: scheduleStops,
  };
}

/**
 * SQL WHERE + JOIN equivalent: Search direct trains between two station codes
 */
export function queryTrainsBetweenStations(fromCode, toCode) {
  const fCode = fromCode.toUpperCase();
  const tCode = toCode.toUpperCase();

  // Find direct trains where from_stop < to_stop
  const results = [];

  RELATIONAL_DB.trains.forEach((train) => {
    const stops = RELATIONAL_DB.schedules.filter((s) => s.trainNumber === train.trainNumber);
    const fromStop = stops.find((s) => s.stationCode === fCode);
    const toStop = stops.find((s) => s.stationCode === tCode);

    if (fromStop && toStop && fromStop.stopNumber < toStop.stopNumber) {
      results.push({
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        trainType: train.trainType,
        fromStation: fCode,
        toStation: tCode,
        departureTime: fromStop.departure,
        arrivalTime: toStop.arrival,
        journeyDistanceKm: toStop.distanceKm - fromStop.distanceKm,
        classes: ['1A', '2A', '3A'],
        hasPantry: train.hasPantry,
      });
    }
  });

  return results;
}
