// Directory of Indian Railways stations with geo-coordinates, railway zones, and divisions
export const POPULAR_STATIONS = [
  // Delhi NCR
  { code: 'NDLS', name: 'New Delhi', state: 'Delhi', zone: 'NR', lat: 28.6424, lng: 77.2215 },
  { code: 'DLI', name: 'Old Delhi Junction', state: 'Delhi', zone: 'NR', lat: 28.6617, lng: 77.2280 },
  { code: 'NZM', name: 'Hazrat Nizamuddin', state: 'Delhi', zone: 'NR', lat: 28.5888, lng: 77.2534 },
  { code: 'ANVT', name: 'Anand Vihar Terminal', state: 'Delhi', zone: 'NR', lat: 28.6508, lng: 77.3153 },
  { code: 'DEC', name: 'Delhi Cantt', state: 'Delhi', zone: 'NR', lat: 28.5958, lng: 77.1264 },
  { code: 'GZB', name: 'Ghaziabad Junction', state: 'Uttar Pradesh', zone: 'NR', lat: 28.6644, lng: 77.4334 },

  // Maharashtra / Western / Central
  { code: 'MMCT', name: 'Mumbai Central', state: 'Maharashtra', zone: 'WR', lat: 18.9696, lng: 72.8193 },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', state: 'Maharashtra', zone: 'CR', lat: 18.9402, lng: 72.8356 },
  { code: 'BDTS', name: 'Bandra Terminus', state: 'Maharashtra', zone: 'WR', lat: 19.0624, lng: 72.8405 },
  { code: 'DR', name: 'Dadar Central', state: 'Maharashtra', zone: 'CR', lat: 19.0178, lng: 72.8436 },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', state: 'Maharashtra', zone: 'CR', lat: 19.0694, lng: 72.8911 },
  { code: 'TNA', name: 'Thane', state: 'Maharashtra', zone: 'CR', lat: 19.1860, lng: 72.9759 },
  { code: 'KYN', name: 'Kalyan Junction', state: 'Maharashtra', zone: 'CR', lat: 19.2354, lng: 73.1306 },
  { code: 'PUNE', name: 'Pune Junction', state: 'Maharashtra', zone: 'CR', lat: 18.5284, lng: 73.8739 },
  { code: 'NGP', name: 'Nagpur Junction', state: 'Maharashtra', zone: 'CR', lat: 21.1524, lng: 79.0888 },
  { code: 'NK', name: 'Nashik Road', state: 'Maharashtra', zone: 'CR', lat: 19.9575, lng: 73.8344 },
  { code: 'BSL', name: 'Bhusaval Junction', state: 'Maharashtra', zone: 'CR', lat: 21.0455, lng: 75.7885 },
  { code: 'AWB', name: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra', zone: 'SCR', lat: 19.8660, lng: 75.3183 },
  { code: 'KOP', name: 'Kolhapur SCSMT', state: 'Maharashtra', zone: 'CR', lat: 16.7027, lng: 74.2415 },
  { code: 'SUR', name: 'Solapur', state: 'Maharashtra', zone: 'CR', lat: 17.6599, lng: 75.9064 },

  // West Bengal / Eastern
  { code: 'HWH', name: 'Howrah Junction', state: 'West Bengal', zone: 'ER', lat: 22.5839, lng: 88.3426 },
  { code: 'SDAH', name: 'Sealdah', state: 'West Bengal', zone: 'ER', lat: 22.5675, lng: 88.3711 },
  { code: 'KOAA', name: 'Kolkata Chitpur', state: 'West Bengal', zone: 'ER', lat: 22.6025, lng: 88.3769 },
  { code: 'SHM', name: 'Shalimar', state: 'West Bengal', zone: 'SER', lat: 22.5574, lng: 88.3183 },
  { code: 'KGP', name: 'Kharagpur Junction', state: 'West Bengal', zone: 'SER', lat: 22.3382, lng: 87.3235 },
  { code: 'ASN', name: 'Asansol Junction', state: 'West Bengal', zone: 'ER', lat: 23.6841, lng: 86.9634 },
  { code: 'DGR', name: 'Durgapur', state: 'West Bengal', zone: 'ER', lat: 23.4998, lng: 87.3075 },
  { code: 'MLDT', name: 'Malda Town', state: 'West Bengal', zone: 'ER', lat: 25.0118, lng: 88.1362 },
  { code: 'NJP', name: 'New Jalpaiguri Junction', state: 'West Bengal', zone: 'NFR', lat: 26.6844, lng: 88.4419 },

  // Tamil Nadu / Southern
  { code: 'MAS', name: 'Chennai Central', state: 'Tamil Nadu', zone: 'SR', lat: 13.0827, lng: 80.2755 },
  { code: 'MS', name: 'Chennai Egmore', state: 'Tamil Nadu', zone: 'SR', lat: 13.0784, lng: 80.2608 },
  { code: 'CBE', name: 'Coimbatore Junction', state: 'Tamil Nadu', zone: 'SR', lat: 11.0016, lng: 76.9628 },
  { code: 'MDU', name: 'Madurai Junction', state: 'Tamil Nadu', zone: 'SR', lat: 9.9198, lng: 78.1139 },
  { code: 'TPJ', name: 'Tiruchchirappalli Junction', state: 'Tamil Nadu', zone: 'SR', lat: 10.7933, lng: 78.6836 },
  { code: 'SA', name: 'Salem Junction', state: 'Tamil Nadu', zone: 'SR', lat: 11.6669, lng: 78.1278 },
  { code: 'ED', name: 'Erode Junction', state: 'Tamil Nadu', zone: 'SR', lat: 11.3410, lng: 77.7172 },
  { code: 'TEN', name: 'Tirunelveli Junction', state: 'Tamil Nadu', zone: 'SR', lat: 8.7292, lng: 77.6976 },
  { code: 'RMM', name: 'Rameswaram', state: 'Tamil Nadu', zone: 'SR', lat: 9.2882, lng: 79.3129 },

  // Karnataka / South Western
  { code: 'SBC', name: 'KSR Bengaluru City', state: 'Karnataka', zone: 'SWR', lat: 12.9781, lng: 77.5695 },
  { code: 'YPR', name: 'Yesvantpur Junction', state: 'Karnataka', zone: 'SWR', lat: 13.0238, lng: 77.5501 },
  { code: 'SMVB', name: 'Sir M Visvesvaraya Terminal Bengaluru', state: 'Karnataka', zone: 'SWR', lat: 13.0039, lng: 77.6534 },
  { code: 'MYS', name: 'Mysuru Junction', state: 'Karnataka', zone: 'SWR', lat: 12.3164, lng: 76.6433 },
  { code: 'UBL', name: 'SSS Hubballi Junction', state: 'Karnataka', zone: 'SWR', lat: 15.3533, lng: 75.1481 },
  { code: 'MAQ', name: 'Mangaluru Central', state: 'Karnataka', zone: 'SR', lat: 12.8631, lng: 74.8427 },
  { code: 'BGM', name: 'Belagavi', state: 'Karnataka', zone: 'SWR', lat: 15.8497, lng: 74.5089 },

  // Telangana & Andhra Pradesh / South Central
  { code: 'SC', name: 'Secunderabad Junction', state: 'Telangana', zone: 'SCR', lat: 17.4344, lng: 78.5015 },
  { code: 'HYB', name: 'Hyderabad Deccan (Nampally)', state: 'Telangana', zone: 'SCR', lat: 17.3924, lng: 78.4691 },
  { code: 'KCG', name: 'Kacheguda', state: 'Telangana', zone: 'SCR', lat: 17.3871, lng: 78.4984 },
  { code: 'BZA', name: 'Vijayawada Junction', state: 'Andhra Pradesh', zone: 'SCR', lat: 16.5186, lng: 80.6198 },
  { code: 'VSKP', name: 'Visakhapatnam Junction', state: 'Andhra Pradesh', zone: 'ECoR', lat: 17.7214, lng: 83.2878 },
  { code: 'TPTY', name: 'Tirupati', state: 'Andhra Pradesh', zone: 'SCR', lat: 13.6288, lng: 79.4192 },
  { code: 'GNT', name: 'Guntur Junction', state: 'Andhra Pradesh', zone: 'SCR', lat: 16.2995, lng: 80.4435 },
  { code: 'RU', name: 'Renigunta Junction', state: 'Andhra Pradesh', zone: 'SCR', lat: 13.6517, lng: 79.5165 },

  // Gujarat / Western
  { code: 'ADI', name: 'Ahmedabad Junction', state: 'Gujarat', zone: 'WR', lat: 23.0238, lng: 72.6009 },
  { code: 'BRC', name: 'Vadodara Junction', state: 'Gujarat', zone: 'WR', lat: 22.3107, lng: 73.1812 },
  { code: 'ST', name: 'Surat', state: 'Gujarat', zone: 'WR', lat: 21.2049, lng: 72.8407 },
  { code: 'RJT', name: 'Rajkot Junction', state: 'Gujarat', zone: 'WR', lat: 22.3100, lng: 70.8022 },
  { code: 'BVC', name: 'Bhavnagar Terminus', state: 'Gujarat', zone: 'WR', lat: 21.7645, lng: 72.1519 },
  { code: 'VAPI', name: 'Vapi', state: 'Gujarat', zone: 'WR', lat: 20.3714, lng: 72.9044 },
  { code: 'BH', name: 'Bharuch Junction', state: 'Gujarat', zone: 'WR', lat: 21.7051, lng: 72.9959 },
  { code: 'BL', name: 'Valsad', state: 'Gujarat', zone: 'WR', lat: 20.6104, lng: 72.9342 },

  // Rajasthan / North Western
  { code: 'JP', name: 'Jaipur Junction', state: 'Rajasthan', zone: 'NWR', lat: 26.9196, lng: 75.7878 },
  { code: 'JU', name: 'Jodhpur Junction', state: 'Rajasthan', zone: 'NWR', lat: 26.2844, lng: 73.0229 },
  { code: 'AII', name: 'Ajmer Junction', state: 'Rajasthan', zone: 'NWR', lat: 26.4526, lng: 74.6399 },
  { code: 'UDZ', name: 'Udaipur City', state: 'Rajasthan', zone: 'NWR', lat: 24.5772, lng: 73.7006 },
  { code: 'BKN', name: 'Bikaner Junction', state: 'Rajasthan', zone: 'NWR', lat: 28.0182, lng: 73.3168 },
  { code: 'KOTA', name: 'Kota Junction', state: 'Rajasthan', zone: 'WCR', lat: 25.2138, lng: 75.8648 },
  { code: 'ABR', name: 'Abu Road', state: 'Rajasthan', zone: 'NWR', lat: 24.4795, lng: 72.7797 },

  // Uttar Pradesh & Uttarakhand / Northern & North Central
  { code: 'CNB', name: 'Kanpur Central', state: 'Uttar Pradesh', zone: 'NCR', lat: 26.4547, lng: 80.3507 },
  { code: 'LKO', name: 'Lucknow Charbagh', state: 'Uttar Pradesh', zone: 'NR', lat: 26.8315, lng: 80.9232 },
  { code: 'LJN', name: 'Lucknow Junction NER', state: 'Uttar Pradesh', zone: 'NER', lat: 26.8322, lng: 80.9215 },
  { code: 'PRYJ', name: 'Prayagraj Junction', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.4438, lng: 81.8285 },
  { code: 'BSB', name: 'Varanasi Junction', state: 'Uttar Pradesh', zone: 'NR', lat: 25.3268, lng: 82.9863 },
  { code: 'DDU', name: 'Pt Deen Dayal Upadhyaya Jn (Mughalsarai)', state: 'Uttar Pradesh', zone: 'ECR', lat: 25.2818, lng: 83.1189 },
  { code: 'AGC', name: 'Agra Cantt', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.1591, lng: 77.9897 },
  { code: 'AF', name: 'Agra Fort', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.1802, lng: 78.0175 },
  { code: 'MTJ', name: 'Mathura Junction', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.4924, lng: 77.6737 },
  { code: 'GKP', name: 'Gorakhpur Junction', state: 'Uttar Pradesh', zone: 'NER', lat: 26.7598, lng: 83.3813 },
  { code: 'BE', name: 'Bareilly Junction', state: 'Uttar Pradesh', zone: 'NR', lat: 28.3377, lng: 79.4140 },
  { code: 'MB', name: 'Moradabad Junction', state: 'Uttar Pradesh', zone: 'NR', lat: 28.8316, lng: 78.7758 },
  { code: 'MTC', name: 'Meerut City', state: 'Uttar Pradesh', zone: 'NR', lat: 28.9766, lng: 77.6978 },
  { code: 'AY', name: 'Ayodhya Dham Junction', state: 'Uttar Pradesh', zone: 'NR', lat: 26.7997, lng: 82.2039 },
  { code: 'HW', name: 'Haridwar Junction', state: 'Uttarakhand', zone: 'NR', lat: 29.9457, lng: 78.1517 },
  { code: 'DDN', name: 'Dehradun', state: 'Uttarakhand', zone: 'NR', lat: 30.3155, lng: 78.0322 },

  // Madhya Pradesh / West Central
  { code: 'BPL', name: 'Bhopal Junction', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.2662, lng: 77.4103 },
  { code: 'RKMP', name: 'Rani Kamalapati (Habibganj)', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.2183, lng: 77.4374 },
  { code: 'GWL', name: 'Gwalior Junction', state: 'Madhya Pradesh', zone: 'NCR', lat: 26.2163, lng: 78.1887 },
  { code: 'VGLJ', name: 'V Lakshmibai Jhansi', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.4484, lng: 78.5685 },
  { code: 'JBP', name: 'Jabalpur Junction', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.1678, lng: 79.9540 },
  { code: 'INDB', name: 'Indore Junction', state: 'Madhya Pradesh', zone: 'WR', lat: 22.7177, lng: 75.8682 },
  { code: 'UJN', name: 'Ujjain Junction', state: 'Madhya Pradesh', zone: 'WR', lat: 23.1824, lng: 75.7772 },
  { code: 'RTM', name: 'Ratlam Junction', state: 'Madhya Pradesh', zone: 'WR', lat: 23.3344, lng: 75.0375 },
  { code: 'ET', name: 'Itarsi Junction', state: 'Madhya Pradesh', zone: 'WCR', lat: 22.6124, lng: 77.7607 },

  // Bihar & Jharkhand / East Central
  { code: 'PNBE', name: 'Patna Junction', state: 'Bihar', zone: 'ECR', lat: 25.6022, lng: 85.1376 },
  { code: 'DNR', name: 'Danapur', state: 'Bihar', zone: 'ECR', lat: 25.6322, lng: 85.0428 },
  { code: 'GAYA', name: 'Gaya Junction', state: 'Bihar', zone: 'ECR', lat: 24.8052, lng: 84.9994 },
  { code: 'MFP', name: 'Muzaffarpur Junction', state: 'Bihar', zone: 'ECR', lat: 26.1219, lng: 85.3888 },
  { code: 'BJU', name: 'Barauni Junction', state: 'Bihar', zone: 'ECR', lat: 25.4746, lng: 85.9868 },
  { code: 'DBG', name: 'Darbhanga Junction', state: 'Bihar', zone: 'ECR', lat: 26.1554, lng: 85.8970 },
  { code: 'DHN', name: 'Dhanbad Junction', state: 'Jharkhand', zone: 'ECR', lat: 23.7917, lng: 86.4304 },
  { code: 'RNC', name: 'Ranchi Junction', state: 'Jharkhand', zone: 'SER', lat: 23.3516, lng: 85.3348 },
  { code: 'TATA', name: 'Tatanagar Junction', state: 'Jharkhand', zone: 'SER', lat: 22.7667, lng: 86.2024 },

  // Punjab, Haryana, Himachal & J&K
  { code: 'CDG', name: 'Chandigarh Junction', state: 'Punjab / Chandigarh', zone: 'NR', lat: 30.7027, lng: 76.8197 },
  { code: 'UMB', name: 'Ambala Cantt Junction', state: 'Haryana', zone: 'NR', lat: 30.3342, lng: 76.8378 },
  { code: 'ASR', name: 'Amritsar Junction', state: 'Punjab', zone: 'NR', lat: 31.6340, lng: 74.8723 },
  { code: 'LDH', name: 'Ludhiana Junction', state: 'Punjab', zone: 'NR', lat: 30.9069, lng: 75.8576 },
  { code: 'JUC', name: 'Jalandhar City', state: 'Punjab', zone: 'NR', lat: 31.3260, lng: 75.5762 },
  { code: 'JAT', name: 'Jammu Tawi', state: 'Jammu & Kashmir', zone: 'NR', lat: 32.7061, lng: 74.8802 },
  { code: 'SVDK', name: 'SMVD Katra (Vaishno Devi)', state: 'Jammu & Kashmir', zone: 'NR', lat: 32.9904, lng: 74.9317 },
  { code: 'KLK', name: 'Kalka', state: 'Haryana', zone: 'NR', lat: 30.8356, lng: 76.9348 },

  // Odisha & Chhattisgarh / East Coast & SECR
  { code: 'BBS', name: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR', lat: 20.2648, lng: 85.8405 },
  { code: 'PURI', name: 'Puri Terminus', state: 'Odisha', zone: 'ECoR', lat: 19.8135, lng: 85.8312 },
  { code: 'CTC', name: 'Cuttack Junction', state: 'Odisha', zone: 'ECoR', lat: 20.4630, lng: 85.8893 },
  { code: 'ROU', name: 'Rourkela Junction', state: 'Odisha', zone: 'SER', lat: 22.2272, lng: 84.8536 },
  { code: 'R', name: 'Raipur Junction', state: 'Chhattisgarh', zone: 'SECR', lat: 21.2583, lng: 81.6300 },
  { code: 'BSP', name: 'Bilaspur Junction', state: 'Chhattisgarh', zone: 'SECR', lat: 22.0797, lng: 82.1409 },
  { code: 'DURG', name: 'Durg Junction', state: 'Chhattisgarh', zone: 'SECR', lat: 21.1904, lng: 81.2849 },

  // Kerala & Goa
  { code: 'TVC', name: 'Thiruvananthapuram Central', state: 'Kerala', zone: 'SR', lat: 8.4875, lng: 76.9532 },
  { code: 'ERS', name: 'Ernakulam Junction (South)', state: 'Kerala', zone: 'SR', lat: 9.9678, lng: 76.2917 },
  { code: 'ERN', name: 'Ernakulam Town (North)', state: 'Kerala', zone: 'SR', lat: 9.9982, lng: 76.2934 },
  { code: 'CLT', name: 'Kozhikode (Calicut)', state: 'Kerala', zone: 'SR', lat: 11.2480, lng: 75.7839 },
  { code: 'TCR', name: 'Thrissur', state: 'Kerala', zone: 'SR', lat: 10.5186, lng: 76.2084 },
  { code: 'MAO', name: 'Madgaon Junction', state: 'Goa', zone: 'KR', lat: 15.2736, lng: 73.9680 },
  { code: 'KRMI', name: 'Karmali', state: 'Goa', zone: 'KR', lat: 15.4951, lng: 73.9213 },

  // Northeast / NFR
  { code: 'GHY', name: 'Guwahati', state: 'Assam', zone: 'NFR', lat: 26.1827, lng: 91.7516 },
  { code: 'KYQ', name: 'Kamakhya Junction', state: 'Assam', zone: 'NFR', lat: 26.1558, lng: 91.7058 },
  { code: 'DBRG', name: 'Dibrugarh', state: 'Assam', zone: 'NFR', lat: 27.4728, lng: 94.9120 },
  { code: 'AGTL', name: 'Agartala', state: 'Tripura', zone: 'NFR', lat: 23.7915, lng: 91.2782 }
];

export function findStation(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toUpperCase();
  
  // Exact match first
  const exact = POPULAR_STATIONS.filter(s => s.code === q);
  if (exact.length > 0) return exact;

  // Code prefix match
  const codeMatches = POPULAR_STATIONS.filter(s => s.code.startsWith(q));
  
  // Name starts with
  const namePrefix = POPULAR_STATIONS.filter(s => s.name.toUpperCase().startsWith(q) && !codeMatches.includes(s));

  // Name or state includes
  const contains = POPULAR_STATIONS.filter(
    s => (s.code.includes(q) || s.name.toUpperCase().includes(q) || s.state.toUpperCase().includes(q)) &&
         !codeMatches.includes(s) &&
         !namePrefix.includes(s)
  );

  return [...codeMatches, ...namePrefix, ...contains];
}

export function getStationByCode(code) {
  if (!code) return null;
  const c = code.trim().toUpperCase();
  return POPULAR_STATIONS.find(s => s.code === c) || null;
}
