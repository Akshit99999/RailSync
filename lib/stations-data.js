// Comprehensive directory of major Indian Railways stations with geo-coordinates and railway zones
export const POPULAR_STATIONS = [
  { code: 'NDLS', name: 'New Delhi', state: 'Delhi', zone: 'NR', lat: 28.6424, lng: 77.2215 },
  { code: 'MMCT', name: 'Mumbai Central', state: 'Maharashtra', zone: 'WR', lat: 18.9696, lng: 72.8193 },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', state: 'Maharashtra', zone: 'CR', lat: 18.9402, lng: 72.8356 },
  { code: 'HWH', name: 'Howrah Junction', state: 'West Bengal', zone: 'ER', lat: 22.5839, lng: 88.3426 },
  { code: 'MAS', name: 'Chennai Central', state: 'Tamil Nadu', zone: 'SR', lat: 13.0827, lng: 80.2755 },
  { code: 'SBC', name: 'KSR Bengaluru City', state: 'Karnataka', zone: 'SWR', lat: 12.9781, lng: 77.5695 },
  { code: 'SC', name: 'Secunderabad Junction', state: 'Telangana', zone: 'SCR', lat: 17.4344, lng: 78.5015 },
  { code: 'ADI', name: 'Ahmedabad Junction', state: 'Gujarat', zone: 'WR', lat: 23.0238, lng: 72.6009 },
  { code: 'PUNE', name: 'Pune Junction', state: 'Maharashtra', zone: 'CR', lat: 18.5284, lng: 73.8739 },
  { code: 'CNB', name: 'Kanpur Central', state: 'Uttar Pradesh', zone: 'NCR', lat: 26.4547, lng: 80.3507 },
  { code: 'PRYJ', name: 'Prayagraj Junction', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.4438, lng: 81.8285 },
  { code: 'BSB', name: 'Varanasi Junction', state: 'Uttar Pradesh', zone: 'NR', lat: 25.3268, lng: 82.9863 },
  { code: 'LKO', name: 'Lucknow Charbagh', state: 'Uttar Pradesh', zone: 'NR', lat: 26.8315, lng: 80.9232 },
  { code: 'PNBE', name: 'Patna Junction', state: 'Bihar', zone: 'ECR', lat: 25.6022, lng: 85.1376 },
  { code: 'BPL', name: 'Bhopal Junction', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.2662, lng: 77.4103 },
  { code: 'KOTA', name: 'Kota Junction', state: 'Rajasthan', zone: 'WCR', lat: 25.2138, lng: 75.8648 },
  { code: 'RTM', name: 'Ratlam Junction', state: 'Madhya Pradesh', zone: 'WR', lat: 23.3344, lng: 75.0375 },
  { code: 'BRC', name: 'Vadodara Junction', state: 'Gujarat', zone: 'WR', lat: 22.3107, lng: 73.1812 },
  { code: 'ST', name: 'Surat', state: 'Gujarat', zone: 'WR', lat: 21.2049, lng: 72.8407 },
  { code: 'MTJ', name: 'Mathura Junction', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.4924, lng: 77.6737 },
  { code: 'AGC', name: 'Agra Cantt', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.1591, lng: 77.9897 },
  { code: 'GWL', name: 'Gwalior Junction', state: 'Madhya Pradesh', zone: 'NCR', lat: 26.2163, lng: 78.1887 },
  { code: 'VGLJ', name: 'V Lakshmibai Jhansi', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.4484, lng: 78.5685 },
  { code: 'JP', name: 'Jaipur Junction', state: 'Rajasthan', zone: 'NWR', lat: 26.9196, lng: 75.7878 },
  { code: 'CDG', name: 'Chandigarh Junction', state: 'Punjab / Chandigarh', zone: 'NR', lat: 30.7027, lng: 76.8197 },
  { code: 'ASR', name: 'Amritsar Junction', state: 'Punjab', zone: 'NR', lat: 31.6340, lng: 74.8723 },
  { code: 'JAT', name: 'Jammu Tawi', state: 'Jammu & Kashmir', zone: 'NR', lat: 32.7061, lng: 74.8802 },
  { code: 'GHY', name: 'Guwahati', state: 'Assam', zone: 'NFR', lat: 26.1827, lng: 91.7516 },
  { code: 'BBS', name: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR', lat: 20.2648, lng: 85.8405 },
  { code: 'NGP', name: 'Nagpur Junction', state: 'Maharashtra', zone: 'CR', lat: 21.1524, lng: 79.0888 },
  { code: 'NZM', name: 'Hazrat Nizamuddin', state: 'Delhi', zone: 'NR', lat: 28.5888, lng: 77.2534 },
  { code: 'ANVT', name: 'Anand Vihar Terminal', state: 'Delhi', zone: 'NR', lat: 28.6508, lng: 77.3153 },
  { code: 'BDTS', name: 'Bandra Terminus', state: 'Maharashtra', zone: 'WR', lat: 19.0624, lng: 72.8405 },
  { code: 'YPR', name: 'Yesvantpur Junction', state: 'Karnataka', zone: 'SWR', lat: 13.0238, lng: 77.5501 },
  { code: 'TVC', name: 'Thiruvananthapuram Central', state: 'Kerala', zone: 'SR', lat: 8.4875, lng: 76.9532 },
  { code: 'ERS', name: 'Ernakulam Junction', state: 'Kerala', zone: 'SR', lat: 9.9678, lng: 76.2917 },
  { code: 'DDU', name: 'Pt Deen Dayal Upadhyaya Jn', state: 'Uttar Pradesh', zone: 'ECR', lat: 25.2818, lng: 83.1189 },
  { code: 'GKP', name: 'Gorakhpur Junction', state: 'Uttar Pradesh', zone: 'NER', lat: 26.7598, lng: 83.3813 },
  { code: 'HYB', name: 'Hyderabad Deccan (Nampally)', state: 'Telangana', zone: 'SCR', lat: 17.3924, lng: 78.4691 }
];

export function findStation(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toUpperCase();
  return POPULAR_STATIONS.filter(
    s => s.code.includes(q) || s.name.toUpperCase().includes(q) || s.state.toUpperCase().includes(q)
  );
}

export function getStationByCode(code) {
  if (!code) return null;
  const c = code.trim().toUpperCase();
  return POPULAR_STATIONS.find(s => s.code === c) || null;
}
