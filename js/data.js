// M-Indicator Data Management System
// Comprehensive Mumbai Local Train Database

const MIndicatorData = {
    // Station Data with Line Information
    stations: {
        // Western Line - Churchgate to Virar
        western: [
            { id: 'CG', name: 'Churchgate', line: 'western', zone: 1, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [18.9320, 72.8264] },
            { id: 'MAR', name: 'Marine Lines', line: 'western', zone: 1, facilities: ['food', 'atm'], coordinates: [18.9478, 72.8234] },
            { id: 'CST', name: 'Charni Road', line: 'western', zone: 1, facilities: ['food', 'parking'], coordinates: [18.9515, 72.8195] },
            { id: 'GRD', name: 'Grant Road', line: 'western', zone: 1, facilities: ['parking', 'food'], coordinates: [18.9635, 72.8137] },
            { id: 'BSR', name: 'Mumbai Central', line: 'western', zone: 1, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [18.9690, 72.8205] },
            { id: 'MAH', name: 'Mahalaxmi', line: 'western', zone: 1, facilities: ['parking'], coordinates: [18.9826, 72.8235] },
            { id: 'LPR', name: 'Lower Parel', line: 'western', zone: 1, facilities: ['parking', 'food', 'mall'], coordinates: [18.9963, 72.8266] },
            { id: 'ELP', name: 'Elphinstone Road', line: 'western', zone: 1, facilities: ['food'], coordinates: [19.0074, 72.8314] },
            { id: 'DDR', name: 'Dadar', line: 'western', zone: 1, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [19.0186, 72.8430] },
            { id: 'MTN', name: 'Matunga Road', line: 'western', zone: 1, facilities: ['food'], coordinates: [19.0278, 72.8447] },
            { id: 'MAH2', name: 'Mahim', line: 'western', zone: 1, facilities: ['food', 'parking'], coordinates: [19.0410, 72.8406] },
            { id: 'BND', name: 'Bandra', line: 'western', zone: 1, facilities: ['parking', 'food', 'atm', 'restroom', 'mall'], coordinates: [19.0544, 72.8370] },
            { id: 'KHR', name: 'Khar Road', line: 'western', zone: 1, facilities: ['food'], coordinates: [19.0688, 72.8376] },
            { id: 'STB', name: 'Santacruz', line: 'western', zone: 1, facilities: ['parking', 'food'], coordinates: [19.0810, 72.8410] },
            { id: 'VLP', name: 'Vile Parle', line: 'western', zone: 1, facilities: ['parking', 'food', 'atm'], coordinates: [19.0988, 72.8472] },
            { id: 'AND', name: 'Andheri', line: 'western', zone: 2, facilities: ['parking', 'food', 'atm', 'restroom', 'mall'], coordinates: [19.1197, 72.8464] },
            { id: 'JOG', name: 'Jogeshwari', line: 'western', zone: 2, facilities: ['parking', 'food'], coordinates: [19.1349, 72.8489] },
            { id: 'RAM', name: 'Ram Mandir', line: 'western', zone: 2, facilities: ['food'], coordinates: [19.1420, 72.8501] },
            { id: 'GOR', name: 'Goregaon', line: 'western', zone: 2, facilities: ['parking', 'food', 'mall'], coordinates: [19.1540, 72.8506] },
            { id: 'MLD', name: 'Malad', line: 'western', zone: 2, facilities: ['parking', 'food', 'atm'], coordinates: [19.1868, 72.8492] },
            { id: 'KDV', name: 'Kandivali', line: 'western', zone: 2, facilities: ['parking', 'food'], coordinates: [19.2041, 72.8503] },
            { id: 'BHY', name: 'Borivali', line: 'western', zone: 2, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [19.2307, 72.8567] },
            { id: 'DHN', name: 'Dahisar', line: 'western', zone: 3, facilities: ['parking', 'food'], coordinates: [19.2544, 72.8648] },
            { id: 'MRA', name: 'Mira Road', line: 'western', zone: 3, facilities: ['parking', 'food'], coordinates: [19.2820, 72.8737] },
            { id: 'BHP', name: 'Bhayander', line: 'western', zone: 3, facilities: ['food'], coordinates: [19.3017, 72.8596] },
            { id: 'NAI', name: 'Naigaon', line: 'western', zone: 3, facilities: ['food'], coordinates: [19.3468, 72.8597] },
            { id: 'VAS', name: 'Vasai Road', line: 'western', zone: 3, facilities: ['parking', 'food', 'atm'], coordinates: [19.3668, 72.8131] },
            { id: 'NLR', name: 'Nalasopara', line: 'western', zone: 3, facilities: ['food'], coordinates: [19.4218, 72.7908] },
            { id: 'VRR', name: 'Virar', line: 'western', zone: 3, facilities: ['parking', 'food', 'restroom'], coordinates: [19.4559, 72.8081] }
        ],

        // Central Line - CST to Kasara/Khopoli
        central: [
            { id: 'CSTM', name: 'CST Mumbai', line: 'central', zone: 1, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [18.9398, 72.8355] },
            { id: 'SAN', name: 'Sandhurst Road', line: 'central', zone: 1, facilities: ['food'], coordinates: [18.9455, 72.8433] },
            { id: 'MAJ', name: 'Masjid', line: 'central', zone: 1, facilities: ['food'], coordinates: [18.9593, 72.8324] },
            { id: 'BYC', name: 'Byculla', line: 'central', zone: 1, facilities: ['parking', 'food'], coordinates: [18.9765, 72.8331] },
            { id: 'CHN', name: 'Chinchpokli', line: 'central', zone: 1, facilities: ['food'], coordinates: [18.9904, 72.8298] },
            { id: 'CLA', name: 'Curry Road', line: 'central', zone: 1, facilities: ['food'], coordinates: [19.0023, 72.8316] },
            { id: 'PTN', name: 'Parel', line: 'central', zone: 1, facilities: ['food', 'mall'], coordinates: [19.0103, 72.8338] },
            { id: 'DDR2', name: 'Dadar', line: 'central', zone: 1, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [19.0186, 72.8430] },
            { id: 'MTG', name: 'Matunga', line: 'central', zone: 1, facilities: ['food'], coordinates: [19.0278, 72.8556] },
            { id: 'SIO', name: 'Sion', line: 'central', zone: 1, facilities: ['parking', 'food'], coordinates: [19.0434, 72.8610] },
            { id: 'KDL', name: 'Kurla', line: 'central', zone: 1, facilities: ['parking', 'food', 'atm'], coordinates: [19.0728, 72.8794] },
            { id: 'VDR', name: 'Vidyavihar', line: 'central', zone: 1, facilities: ['food'], coordinates: [19.0822, 72.8977] },
            { id: 'GHT', name: 'Ghatkopar', line: 'central', zone: 1, facilities: ['parking', 'food', 'atm', 'mall'], coordinates: [19.0856, 72.9083] },
            { id: 'VKD', name: 'Vikhroli', line: 'central', zone: 2, facilities: ['parking', 'food'], coordinates: [19.1077, 72.9264] },
            { id: 'KJT', name: 'Kanjurmarg', line: 'central', zone: 2, facilities: ['food'], coordinates: [19.1297, 72.9372] },
            { id: 'BND2', name: 'Bhandup', line: 'central', zone: 2, facilities: ['parking', 'food'], coordinates: [19.1443, 72.9367] },
            { id: 'NHV', name: 'Nahur', line: 'central', zone: 2, facilities: ['food'], coordinates: [19.1506, 72.9617] },
            { id: 'MLV', name: 'Mulund', line: 'central', zone: 2, facilities: ['parking', 'food'], coordinates: [19.1728, 72.9568] },
            { id: 'THN', name: 'Thane', line: 'central', zone: 2, facilities: ['parking', 'food', 'atm', 'restroom', 'mall'], coordinates: [19.1972, 72.9673] },
            { id: 'KLY', name: 'Kalyan', line: 'central', zone: 3, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [19.2437, 73.1355] }
        ],

        // Harbour Line - CST to Panvel
        harbour: [
            { id: 'CSTM2', name: 'CST Mumbai', line: 'harbour', zone: 1, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [18.9398, 72.8355] },
            { id: 'SAN2', name: 'Sandhurst Road', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [18.9455, 72.8433] },
            { id: 'DOC', name: 'Dockyard Road', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [18.9678, 72.8446] },
            { id: 'REY', name: 'Reay Road', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [18.9747, 72.8538] },
            { id: 'COT', name: 'Cotton Green', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [18.9858, 72.8562] },
            { id: 'SEW', name: 'Sewri', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [18.9996, 72.8554] },
            { id: 'WAD', name: 'Wadala Road', line: 'harbour', zone: 1, facilities: ['parking', 'food'], coordinates: [19.0144, 72.8577] },
            { id: 'GTB', name: 'GTB Nagar', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [19.0279, 72.8639] },
            { id: 'CHB', name: 'Chunabhatti', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [19.0446, 72.8787] },
            { id: 'KDL2', name: 'Kurla', line: 'harbour', zone: 1, facilities: ['parking', 'food', 'atm'], coordinates: [19.0728, 72.8794] },
            { id: 'TNH', name: 'Tilak Nagar', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [19.0656, 72.8847] },
            { id: 'CHT', name: 'Chembur', line: 'harbour', zone: 1, facilities: ['parking', 'food'], coordinates: [19.0634, 72.8977] },
            { id: 'GVD', name: 'Govandi', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [19.0554, 72.9121] },
            { id: 'MNK', name: 'Mankhurd', line: 'harbour', zone: 1, facilities: ['food'], coordinates: [19.0431, 72.9320] },
            { id: 'VPD', name: 'Vashi', line: 'harbour', zone: 2, facilities: ['parking', 'food', 'atm', 'mall'], coordinates: [19.077, 72.9988] },
            { id: 'SNP', name: 'Sanpada', line: 'harbour', zone: 2, facilities: ['food'], coordinates: [19.0708, 73.0114] },
            { id: 'JUI', name: 'Juinagar', line: 'harbour', zone: 2, facilities: ['food'], coordinates: [19.0643, 73.0279] },
            { id: 'NRL', name: 'Nerul', line: 'harbour', zone: 2, facilities: ['parking', 'food'], coordinates: [19.0333, 73.0166] },
            { id: 'BLD', name: 'Belapur CBD', line: 'harbour', zone: 2, facilities: ['parking', 'food'], coordinates: [19.0158, 73.0346] },
            { id: 'KHR2', name: 'Kharghar', line: 'harbour', zone: 3, facilities: ['parking', 'food'], coordinates: [19.0489, 73.0676] },
            { id: 'PNV', name: 'Panvel', line: 'harbour', zone: 3, facilities: ['parking', 'food', 'atm', 'restroom'], coordinates: [18.9894, 73.1206] }
        ]
    },

    // Train Schedule Data
    schedules: {
        // Sample schedules for different routes and train types
        western: {
            'CG-VRR': {
                slow: [
                    { departure: '05:27', arrival: '08:42', duration: '3h 15m', platform: 2, trainNumber: 'WR-S-001', status: 'ontime' },
                    { departure: '05:35', arrival: '08:50', duration: '3h 15m', platform: 3, trainNumber: 'WR-S-002', status: 'ontime' },
                    { departure: '05:43', arrival: '08:58', duration: '3h 15m', platform: 2, trainNumber: 'WR-S-003', status: 'ontime' },
                    { departure: '05:51', arrival: '09:06', duration: '3h 15m', platform: 3, trainNumber: 'WR-S-004', status: 'ontime' },
                    { departure: '05:59', arrival: '09:14', duration: '3h 15m', platform: 2, trainNumber: 'WR-S-005', status: 'ontime' },
                    { departure: '06:07', arrival: '09:22', duration: '3h 15m', platform: 3, trainNumber: 'WR-S-006', status: 'ontime' },
                    { departure: '06:15', arrival: '09:30', duration: '3h 15m', platform: 2, trainNumber: 'WR-S-007', status: 'ontime' },
                    { departure: '06:23', arrival: '09:38', duration: '3h 15m', platform: 3, trainNumber: 'WR-S-008', status: 'ontime' },
                    { departure: '06:31', arrival: '09:46', duration: '3h 15m', platform: 2, trainNumber: 'WR-S-009', status: 'delayed' },
                    { departure: '06:39', arrival: '09:54', duration: '3h 15m', platform: 3, trainNumber: 'WR-S-010', status: 'ontime' }
                ],
                fast: [
                    { departure: '06:27', arrival: '07:42', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-001', status: 'ontime' },
                    { departure: '06:38', arrival: '07:53', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-002', status: 'ontime' },
                    { departure: '06:49', arrival: '08:04', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-003', status: 'ontime' },
                    { departure: '07:00', arrival: '08:15', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-004', status: 'ontime' },
                    { departure: '07:11', arrival: '08:26', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-005', status: 'ontime' },
                    { departure: '07:22', arrival: '08:37', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-006', status: 'delayed' },
                    { departure: '07:33', arrival: '08:48', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-007', status: 'ontime' },
                    { departure: '07:44', arrival: '08:59', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-008', status: 'ontime' },
                    { departure: '07:55', arrival: '09:10', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-009', status: 'ontime' },
                    { departure: '08:06', arrival: '09:21', duration: '1h 15m', platform: 3, trainNumber: 'WR-F-010', status: 'ontime' }
                ],
                ladies: [
                    { departure: '09:55', arrival: '11:10', duration: '1h 15m', platform: 2, trainNumber: 'WR-L-001', status: 'ontime' },
                    { departure: '16:43', arrival: '17:58', duration: '1h 15m', platform: 2, trainNumber: 'WR-L-002', status: 'ontime' }
                ]
            },
            'CG-BHY': {
                slow: [
                    { departure: '05:32', arrival: '06:47', duration: '1h 15m', platform: 2, trainNumber: 'WR-S-B01', status: 'ontime' },
                    { departure: '05:40', arrival: '06:55', duration: '1h 15m', platform: 3, trainNumber: 'WR-S-B02', status: 'ontime' },
                    { departure: '05:48', arrival: '07:03', duration: '1h 15m', platform: 2, trainNumber: 'WR-S-B03', status: 'ontime' }
                ],
                fast: [
                    { departure: '06:32', arrival: '07:17', duration: '45m', platform: 3, trainNumber: 'WR-F-B01', status: 'ontime' },
                    { departure: '06:43', arrival: '07:28', duration: '45m', platform: 3, trainNumber: 'WR-F-B02', status: 'ontime' }
                ]
            }
        },

        central: {
            'CSTM-KLY': {
                slow: [
                    { departure: '05:25', arrival: '07:40', duration: '2h 15m', platform: 4, trainNumber: 'CR-S-001', status: 'ontime' },
                    { departure: '05:33', arrival: '07:48', duration: '2h 15m', platform: 5, trainNumber: 'CR-S-002', status: 'ontime' },
                    { departure: '05:41', arrival: '07:56', duration: '2h 15m', platform: 4, trainNumber: 'CR-S-003', status: 'ontime' }
                ],
                fast: [
                    { departure: '06:25', arrival: '07:20', duration: '55m', platform: 5, trainNumber: 'CR-F-001', status: 'ontime' },
                    { departure: '06:36', arrival: '07:31', duration: '55m', platform: 5, trainNumber: 'CR-F-002', status: 'ontime' }
                ]
            }
        },

        harbour: {
            'CSTM-PNV': {
                slow: [
                    { departure: '05:30', arrival: '07:15', duration: '1h 45m', platform: 6, trainNumber: 'HR-S-001', status: 'ontime' },
                    { departure: '05:38', arrival: '07:23', duration: '1h 45m', platform: 7, trainNumber: 'HR-S-002', status: 'ontime' }
                ],
                fast: [
                    { departure: '06:30', arrival: '07:35', duration: '1h 05m', platform: 7, trainNumber: 'HR-F-001', status: 'ontime' }
                ]
            }
        }
    },

    // Live Train Tracking Data
    liveTrains: {
        western: [
            {
                trainNumber: 'WR-F-012',
                route: 'Churchgate → Virar',
                currentStation: 'Andheri',
                nextStation: 'Jogeshwari',
                nextStationETA: '3 min',
                status: 'ontime',
                delay: 0,
                coaches: 12,
                crowdLevel: 'moderate'
            },
            {
                trainNumber: 'WR-S-025',
                route: 'Virar → Churchgate',
                currentStation: 'Bandra',
                nextStation: 'Mahim',
                nextStationETA: '2 min',
                status: 'delayed',
                delay: 5,
                coaches: 12,
                crowdLevel: 'high'
            },
            {
                trainNumber: 'WR-F-033',
                route: 'Churchgate → Borivali',
                currentStation: 'Malad',
                nextStation: 'Kandivali',
                nextStationETA: '4 min',
                status: 'ontime',
                delay: 0,
                coaches: 12,
                crowdLevel: 'low'
            }
        ],
        central: [
            {
                trainNumber: 'CR-F-018',
                route: 'CST → Kalyan',
                currentStation: 'Kurla',
                nextStation: 'Vidyavihar',
                nextStationETA: '2 min',
                status: 'ontime',
                delay: 0,
                coaches: 12,
                crowdLevel: 'moderate'
            },
            {
                trainNumber: 'CR-S-042',
                route: 'Kalyan → CST',
                currentStation: 'Thane',
                nextStation: 'Mulund',
                nextStationETA: '5 min',
                status: 'delayed',
                delay: 8,
                coaches: 12,
                crowdLevel: 'high'
            }
        ],
        harbour: [
            {
                trainNumber: 'HR-F-007',
                route: 'CST → Panvel',
                currentStation: 'Vashi',
                nextStation: 'Sanpada',
                nextStationETA: '3 min',
                status: 'ontime',
                delay: 0,
                coaches: 12,
                crowdLevel: 'moderate'
            }
        ]
    },

    // Route Planning Data
    routes: {
        // Sample route options between stations
        getRouteOptions: function(from, to) {
            // This is a simplified route calculation
            // In a real app, this would use sophisticated algorithms
            const fromStation = this.findStation(from);
            const toStation = this.findStation(to);
            
            if (!fromStation || !toStation) return [];

            const routes = [];
            
            // Direct route (same line)
            if (fromStation.line === toStation.line) {
                routes.push({
                    id: 'direct',
                    type: 'Direct',
                    duration: this.calculateDuration(fromStation, toStation),
                    cost: this.calculateCost(fromStation, toStation),
                    changes: 0,
                    steps: [
                        {
                            instruction: `Take ${fromStation.line} line train from ${fromStation.name}`,
                            from: fromStation.name,
                            to: toStation.name,
                            duration: this.calculateDuration(fromStation, toStation),
                            trainType: 'Local'
                        }
                    ]
                });
            } else {
                // Route with interchange at Dadar
                routes.push({
                    id: 'via-dadar',
                    type: 'Via Dadar',
                    duration: this.calculateDuration(fromStation, toStation) + 10, // Add interchange time
                    cost: this.calculateCost(fromStation, toStation),
                    changes: 1,
                    steps: [
                        {
                            instruction: `Take ${fromStation.line} line train from ${fromStation.name} to Dadar`,
                            from: fromStation.name,
                            to: 'Dadar',
                            duration: '25m',
                            trainType: 'Local'
                        },
                        {
                            instruction: 'Change at Dadar (Platform change: 3 min)',
                            from: 'Dadar',
                            to: 'Dadar',
                            duration: '3m',
                            trainType: 'Walk'
                        },
                        {
                            instruction: `Take ${toStation.line} line train from Dadar to ${toStation.name}`,
                            from: 'Dadar',
                            to: toStation.name,
                            duration: '30m',
                            trainType: 'Local'
                        }
                    ]
                });
            }

            return routes;
        }
    },

    // Fare Calculation
    fareChart: {
        // Zone-wise fare structure (in INR)
        zones: {
            '1-1': { second: 5, first: 25 },
            '1-2': { second: 10, first: 50 },
            '1-3': { second: 15, first: 75 },
            '2-2': { second: 5, first: 25 },
            '2-3': { second: 10, first: 50 },
            '3-3': { second: 5, first: 25 }
        },
        
        calculateFare: function(fromZone, toZone, ticketClass = 'second') {
            const zoneKey = `${Math.min(fromZone, toZone)}-${Math.max(fromZone, toZone)}`;
            return this.zones[zoneKey] ? this.zones[zoneKey][ticketClass] : 0;
        }
    },

    // Service Updates and Announcements
    serviceUpdates: [
        {
            id: 1,
            time: '10:30 AM',
            line: 'Western',
            message: 'Services running normally on all lines',
            status: 'normal',
            priority: 'low'
        },
        {
            id: 2,
            time: '10:15 AM',
            line: 'Central',
            message: '5-minute delay expected due to heavy rush',
            status: 'delay',
            priority: 'medium'
        },
        {
            id: 3,
            time: '09:45 AM',
            line: 'Harbour',
            message: 'Additional services introduced for peak hours',
            status: 'normal',
            priority: 'low'
        }
    ],

    // Utility Functions
    findStation: function(stationName) {
        for (const line in this.stations) {
            const station = this.stations[line].find(s => 
                s.name.toLowerCase().includes(stationName.toLowerCase()) ||
                s.id.toLowerCase() === stationName.toLowerCase()
            );
            if (station) return station;
        }
        return null;
    },

    findStationsByLine: function(lineName) {
        return this.stations[lineName] || [];
    },

    calculateDuration: function(fromStation, toStation) {
        // Simplified duration calculation based on distance
        const distance = Math.abs(
            this.stations[fromStation.line].indexOf(fromStation) - 
            this.stations[toStation.line].indexOf(toStation)
        );
        return `${Math.max(15, distance * 3)}m`;
    },

    calculateCost: function(fromStation, toStation) {
        return this.fareChart.calculateFare(fromStation.zone, toStation.zone);
    },

    getSchedule: function(fromId, toId, trainType = 'all') {
        const line = this.findStation(fromId)?.line;
        if (!line) return [];

        const routeKey = `${fromId}-${toId}`;
        const lineSchedules = this.schedules[line];
        
        if (!lineSchedules || !lineSchedules[routeKey]) {
            // Return sample data if exact route not found
            return this.generateSampleSchedule(fromId, toId, trainType);
        }

        if (trainType === 'all') {
            return [
                ...lineSchedules[routeKey].slow || [],
                ...lineSchedules[routeKey].fast || [],
                ...lineSchedules[routeKey].ladies || []
            ];
        }

        return lineSchedules[routeKey][trainType] || [];
    },

    generateSampleSchedule: function(fromId, toId, trainType) {
        // Generate sample schedule data for routes not explicitly defined
        const schedule = [];
        const currentTime = new Date();
        const fromStation = this.findStation(fromId);
        const toStation = this.findStation(toId);
        
        if (!fromStation || !toStation) return [];

        for (let i = 0; i < 10; i++) {
            const departureTime = new Date(currentTime.getTime() + (i * 15 * 60000)); // Every 15 minutes
            const travelTime = trainType === 'fast' ? 30 : 45; // minutes
            const arrivalTime = new Date(departureTime.getTime() + (travelTime * 60000));

            schedule.push({
                departure: this.formatTime(departureTime),
                arrival: this.formatTime(arrivalTime),
                duration: `${travelTime}m`,
                platform: Math.floor(Math.random() * 6) + 1,
                trainNumber: `${fromStation.line.toUpperCase()}-${trainType.charAt(0).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
                status: Math.random() > 0.8 ? 'delayed' : 'ontime'
            });
        }

        return schedule;
    },

    formatTime: function(date) {
        return date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    },

    // Search functionality
    searchStations: function(query) {
        if (!query || query.length < 2) return [];
        
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const line in this.stations) {
            const stations = this.stations[line].filter(station => 
                station.name.toLowerCase().includes(lowerQuery)
            );
            results.push(...stations);
        }
        
        // Remove duplicates and limit results
        const uniqueResults = results.filter((station, index, self) => 
            index === self.findIndex(s => s.name === station.name)
        );
        
        return uniqueResults.slice(0, 8);
    }
};

// Local Storage Management
const StorageManager = {
    keys: {
        favorites: 'mindicator_favorites',
        preferences: 'mindicator_preferences',
        recentSearches: 'mindicator_recent_searches'
    },

    getFavorites: function() {
        try {
            return JSON.parse(localStorage.getItem(this.keys.favorites)) || [];
        } catch {
            return [];
        }
    },

    addFavorite: function(favorite) {
        const favorites = this.getFavorites();
        const exists = favorites.find(f => f.from === favorite.from && f.to === favorite.to);
        
        if (!exists) {
            favorites.unshift(favorite);
            localStorage.setItem(this.keys.favorites, JSON.stringify(favorites.slice(0, 10))); // Keep only 10 favorites
        }
    },

    removeFavorite: function(index) {
        const favorites = this.getFavorites();
        favorites.splice(index, 1);
        localStorage.setItem(this.keys.favorites, JSON.stringify(favorites));
    },

    getPreferences: function() {
        try {
            return JSON.parse(localStorage.getItem(this.keys.preferences)) || {
                theme: 'light',
                notifications: true,
                defaultLine: 'western',
                language: 'en'
            };
        } catch {
            return {
                theme: 'light',
                notifications: true,
                defaultLine: 'western',
                language: 'en'
            };
        }
    },

    savePreferences: function(preferences) {
        localStorage.setItem(this.keys.preferences, JSON.stringify(preferences));
    },

    getRecentSearches: function() {
        try {
            return JSON.parse(localStorage.getItem(this.keys.recentSearches)) || [];
        } catch {
            return [];
        }
    },

    addRecentSearch: function(search) {
        const recent = this.getRecentSearches();
        const exists = recent.findIndex(r => r.from === search.from && r.to === search.to);
        
        if (exists !== -1) {
            recent.splice(exists, 1);
        }
        
        recent.unshift({
            ...search,
            timestamp: Date.now()
        });
        
        localStorage.setItem(this.keys.recentSearches, JSON.stringify(recent.slice(0, 5))); // Keep only 5 recent searches
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.MIndicatorData = MIndicatorData;
    window.StorageManager = StorageManager;
}
