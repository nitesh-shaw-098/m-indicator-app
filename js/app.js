// M-Indicator Main Application Logic

const App = {
    // Application state
    state: {
        currentTab: 'home',
        isLoading: false,
        searchQuery: { from: '', to: '' },
        selectedLine: 'western',
        lastUpdateTime: null,
        isOnline: navigator.onLine
    },

    // Initialize the application
    init: function() {
        try {
            this.showLoadingScreen();
            this.setupEventListeners();
            this.initializeComponents();
            this.loadUserPreferences();
            this.setupNetworkListeners();
            this.initializeLocationServices();
            this.hideLoadingScreen();
            
            Components.Toast.show('Welcome to M-Indicator!', 'success');
            console.log('M-Indicator app initialized successfully');
        } catch (error) {
            Utils.handleError(error, 'App initialization');
            Components.Toast.show('Failed to initialize app', 'error');
        }
    },

    // Show/hide loading screen
    showLoadingScreen: function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    },

    hideLoadingScreen: function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1500); // Show for at least 1.5 seconds for better UX
        }
    },

    // Setup all event listeners
    setupEventListeners: function() {
        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Header actions
        document.getElementById('notifications-btn').addEventListener('click', this.showNotifications.bind(this));
        document.getElementById('settings-btn').addEventListener('click', () => Components.Settings.show());

        // Search functionality
        document.getElementById('search-trains').addEventListener('click', this.handleSearch.bind(this));
        document.getElementById('swap-stations').addEventListener('click', this.swapStations.bind(this));

        // Add favorite route
        document.getElementById('add-favorite').addEventListener('click', () => Components.Favorites.showAddDialog());

        // Schedule filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyScheduleFilter(filter);
            });
        });

        // Live tracking line selector
        const lineBtns = document.querySelectorAll('.line-btn');
        lineBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const line = e.target.dataset.line;
                this.switchLiveLine(line);
            });
        });

        // More options
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleMoreAction(action);
            });
        });

        // Enter key search
        ['from-station', 'to-station'].forEach(id => {
            document.getElementById(id).addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        });

        // Route planning options
        document.getElementById('journey-type').addEventListener('change', this.updateRouteOptions.bind(this));
        document.getElementById('journey-time').addEventListener('change', this.updateRouteOptions.bind(this));

        // Handle visibility change for live updates
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.state.currentTab === 'live') {
                this.refreshLiveData();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('from-station').focus();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.switchTab('schedule');
                        break;
                }
            }
        });
    },

    // Initialize components
    initializeComponents: function() {
        // Initialize autocomplete for search inputs
        Components.Autocomplete.init(document.getElementById('from-station'), {
            onSelect: (station) => {
                this.state.searchQuery.from = station.name;
            }
        });

        Components.Autocomplete.init(document.getElementById('to-station'), {
            onSelect: (station) => {
                this.state.searchQuery.to = station.name;
            }
        });

        // Load and display favorites
        Components.Favorites.render(document.getElementById('favorites-list'));

        // Initialize live trains display
        this.loadLiveTrains();

        // Setup periodic updates for live data
        setInterval(() => {
            if (this.state.currentTab === 'live') {
                this.refreshLiveData();
            }
        }, 30000); // Update every 30 seconds

        // Update time display
        this.updateTimeDisplay();
        setInterval(this.updateTimeDisplay.bind(this), 60000); // Update every minute
    },

    // Load user preferences
    loadUserPreferences: function() {
        const preferences = StorageManager.getPreferences();
        this.state.selectedLine = preferences.defaultLine;
        
        // Apply theme
        Components.Settings.applyTheme(preferences.theme);
        
        // Request notification permission if enabled
        if (preferences.notifications && Utils.supportsNotifications()) {
            Utils.requestNotificationPermission().catch(err => {
                console.log('Notification permission not granted:', err);
            });
        }
    },

    // Setup network status listeners
    setupNetworkListeners: function() {
        Utils.onNetworkChange((isOnline) => {
            this.state.isOnline = isOnline;
            const message = isOnline ? 'Back online!' : 'You are offline';
            const type = isOnline ? 'success' : 'warning';
            Components.Toast.show(message, type);
            
            if (isOnline) {
                this.refreshLiveData();
            }
        });
    },

    // Initialize location services
    initializeLocationServices: function() {
        if ('geolocation' in navigator) {
            // Try to get user location for nearest station feature
            Utils.getCurrentPosition().then(position => {
                const { latitude, longitude } = position.coords;
                const nearestStation = Utils.findNearestStation(latitude, longitude);
                
                if (nearestStation && nearestStation.distance < 2000) { // Within 2km
                    this.suggestNearestStation(nearestStation);
                }
            }).catch(err => {
                console.log('Location access denied or unavailable:', err);
            });
        }
    },

    // Suggest nearest station to user
    suggestNearestStation: function(station) {
        const distance = station.distance < 1000 ? 
            `${station.distance}m` : 
            `${(station.distance / 1000).toFixed(1)}km`;
            
        const message = `Nearest station: ${station.name} (${distance} away)`;
        
        const toast = Components.Toast.show(message, 'info', 5000);
        toast.style.cursor = 'pointer';
        toast.addEventListener('click', () => {
            document.getElementById('from-station').value = station.name;
            toast.remove();
        });
    },

    // Switch between tabs
    switchTab: function(tabName) {
        // Update active tab button
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        this.state.currentTab = tabName;

        // Load tab-specific data
        switch (tabName) {
            case 'home':
                this.loadHomeData();
                break;
            case 'live':
                this.loadLiveTrains();
                break;
            case 'routes':
                this.loadRouteOptions();
                break;
            case 'schedule':
                // Focus on search if no results
                if (!document.getElementById('schedule-results').hasChildNodes()) {
                    document.getElementById('from-station').focus();
                }
                break;
        }
    },

    // Load home tab data
    loadHomeData: function() {
        // Refresh favorites
        Components.Favorites.render(document.getElementById('favorites-list'));
        
        // Update weather (mock data)
        this.updateWeatherWidget();
        
        // Load recent searches
        this.loadRecentSearches();
    },

    // Update weather widget with mock data
    updateWeatherWidget: function() {
        const weatherConditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy'];
        const icons = ['fa-sun', 'fa-cloud-sun', 'fa-cloud', 'fa-cloud-rain'];
        const temperatures = [24, 26, 28, 30, 32];
        
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const randomIcon = icons[weatherConditions.indexOf(randomCondition)];
        const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
        
        document.querySelector('.weather-icon').className = `fas ${randomIcon} weather-icon`;
        document.querySelector('.weather-temp').textContent = `${randomTemp}°C`;
        document.querySelector('.weather-desc').textContent = Utils.capitalizeWords(randomCondition.replace('-', ' '));
    },

    // Load recent searches
    loadRecentSearches: function() {
        const recent = StorageManager.getRecentSearches();
        if (recent.length > 0) {
            // Could add a recent searches section to home tab
            console.log('Recent searches:', recent);
        }
    },

    // Handle search functionality
    handleSearch: function() {
        const from = document.getElementById('from-station').value.trim();
        const to = document.getElementById('to-station').value.trim();
        
        if (!from || !to) {
            Components.Toast.show('Please enter both departure and destination stations', 'warning');
            return;
        }
        
        if (from === to) {
            Components.Toast.show('Departure and destination cannot be the same', 'warning');
            return;
        }
        
        // Save to recent searches
        StorageManager.addRecentSearch({ from, to });
        
        this.searchTrains(from, to);
    },

    // Search for trains
    searchTrains: function(from, to) {
        const loader = Components.Loading.show('Searching trains...');
        
        // Simulate API delay
        setTimeout(() => {
            try {
                const results = MIndicatorData.getSchedule(from, to, 'all');
                this.displaySearchResults(results, from, to);
                
                // Switch to schedule tab if not already there
                if (this.state.currentTab !== 'schedule') {
                    this.switchTab('schedule');
                }
                
                Components.Loading.hide();
            } catch (error) {
                Components.Loading.hide();
                Utils.handleError(error, 'Train search');
                Components.Toast.show('Failed to search trains', 'error');
            }
        }, 1000);
    },

    // Display search results
    displaySearchResults: function(results, from, to) {
        const container = document.getElementById('schedule-results');
        const routeInfo = document.getElementById('route-info');
        
        // Show route information
        document.getElementById('route-from').textContent = from;
        document.getElementById('route-to').textContent = to;
        
        const fromStation = MIndicatorData.findStation(from);
        const toStation = MIndicatorData.findStation(to);
        
        if (fromStation && toStation) {
            const distance = Utils.calculateDistance(
                fromStation.coordinates[0], fromStation.coordinates[1],
                toStation.coordinates[0], toStation.coordinates[1]
            );
            document.getElementById('route-distance').textContent = `${distance.toFixed(1)} km`;
        }
        
        routeInfo.style.display = 'block';
        
        // Render results
        Components.SearchResults.render(container, results);
    },

    // Swap station inputs
    swapStations: function() {
        const fromInput = document.getElementById('from-station');
        const toInput = document.getElementById('to-station');
        
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
        
        // Add visual feedback
        document.querySelector('.swap-btn').style.transform = 'rotate(180deg)';
        setTimeout(() => {
            document.querySelector('.swap-btn').style.transform = '';
        }, 300);
    },

    // Apply schedule filter
    applyScheduleFilter: function(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        const from = document.getElementById('route-from').textContent;
        const to = document.getElementById('route-to').textContent;
        
        if (from && to && from !== 'From' && to !== 'To') {
            const results = filter === 'all' ? 
                MIndicatorData.getSchedule(from, to, 'all') :
                MIndicatorData.getSchedule(from, to, filter);
            
            Components.SearchResults.render(document.getElementById('schedule-results'), results);
        }
    },

    // Load live trains data
    loadLiveTrains: function() {
        const container = document.querySelector('.live-trains-container');
        const trains = MIndicatorData.liveTrains[this.state.selectedLine] || [];
        
        Components.LiveTrains.render(container, trains);
        
        this.state.lastUpdateTime = Date.now();
        this.updateLastUpdateDisplay();
    },

    // Switch live tracking line
    switchLiveLine: function(line) {
        this.state.selectedLine = line;
        
        // Update active line button
        document.querySelectorAll('.line-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.line === line);
        });
        
        this.loadLiveTrains();
    },

    // Refresh live data
    refreshLiveData: function() {
        if (!this.state.isOnline) return;
        
        // Simulate real-time updates by slightly modifying existing data
        const trains = MIndicatorData.liveTrains[this.state.selectedLine] || [];
        
        trains.forEach(train => {
            // Randomly update ETA
            const etaMinutes = parseInt(train.nextStationETA.split(' ')[0]) + Math.floor(Math.random() * 3) - 1;
            train.nextStationETA = `${Math.max(1, etaMinutes)} min`;
            
            // Occasionally update status
            if (Math.random() < 0.1) {
                train.status = Math.random() < 0.8 ? 'ontime' : 'delayed';
                train.delay = train.status === 'delayed' ? Math.floor(Math.random() * 10) + 2 : 0;
            }
        });
        
        if (this.state.currentTab === 'live') {
            const container = document.querySelector('.live-trains-container');
            Components.LiveTrains.render(container, trains);
            this.updateLastUpdateDisplay();
        }
    },

    // Update last update time display
    updateLastUpdateDisplay: function() {
        const timeElement = document.querySelector('.last-update-time');
        if (timeElement && this.state.lastUpdateTime) {
            const timeAgo = Math.floor((Date.now() - this.state.lastUpdateTime) / 1000);
            timeElement.textContent = timeAgo < 60 ? 
                `Updated ${timeAgo}s ago` : 
                `Updated ${Math.floor(timeAgo / 60)}m ago`;
        }
    },

    // Load route options
    loadRouteOptions: function() {
        const from = document.getElementById('from-station').value.trim();
        const to = document.getElementById('to-station').value.trim();
        
        if (from && to && from !== to) {
            const routes = MIndicatorData.routes.getRouteOptions(from, to);
            Components.RouteOptions.render(document.getElementById('route-results'), routes);
        }
    },

    // Update route options based on preferences
    updateRouteOptions: function() {
        this.loadRouteOptions();
    },

    // Handle more tab actions
    handleMoreAction: function(action) {
        switch (action) {
            case 'stations':
                this.showStationSelector();
                break;
            case 'fare':
                this.showFareCalculator();
                break;
            case 'maps':
                this.showRouteMaps();
                break;
            case 'offline':
                this.showOfflineOptions();
                break;
            case 'alerts':
                this.showAlertSettings();
                break;
            case 'feedback':
                this.showFeedbackForm();
                break;
        }
    },

    // Show station selector
    showStationSelector: function() {
        const content = `
            <div class="station-selector">
                <h2><i class="fas fa-building"></i> Station Information</h2>
                <div class="search-station">
                    <input type="text" id="station-search" placeholder="Search for a station...">
                </div>
                <div id="station-search-results"></div>
            </div>
        `;
        
        Components.Modal.open(content);
        
        // Initialize search
        setTimeout(() => {
            const searchInput = document.getElementById('station-search');
            Components.Autocomplete.init(searchInput, {
                onSelect: (station) => {
                    Components.Modal.close();
                    Components.StationInfo.show(station.name);
                }
            });
            searchInput.focus();
        }, 100);
    },

    // Show fare calculator
    showFareCalculator: function() {
        const content = `
            <div class="fare-calculator">
                <h2><i class="fas fa-rupee-sign"></i> Fare Calculator</h2>
                <div class="fare-form">
                    <div class="form-group">
                        <label for="fare-from">From Station</label>
                        <input type="text" id="fare-from" placeholder="Enter departure station">
                    </div>
                    <div class="form-group">
                        <label for="fare-to">To Station</label>
                        <input type="text" id="fare-to" placeholder="Enter destination station">
                    </div>
                    <div class="form-group">
                        <label for="ticket-class">Ticket Class</label>
                        <select id="ticket-class">
                            <option value="second">Second Class</option>
                            <option value="first">First Class</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="App.calculateFare()">Calculate Fare</button>
                </div>
                <div id="fare-result" style="display: none;"></div>
            </div>
        `;
        
        Components.Modal.open(content);
        
        // Initialize autocomplete
        setTimeout(() => {
            Components.Autocomplete.init(document.getElementById('fare-from'));
            Components.Autocomplete.init(document.getElementById('fare-to'));
        }, 100);
    },

    // Calculate fare
    calculateFare: function() {
        const from = document.getElementById('fare-from').value.trim();
        const to = document.getElementById('fare-to').value.trim();
        const ticketClass = document.getElementById('ticket-class').value;
        
        if (!from || !to) {
            Components.Toast.show('Please enter both stations', 'warning');
            return;
        }
        
        const fromStation = MIndicatorData.findStation(from);
        const toStation = MIndicatorData.findStation(to);
        
        if (!fromStation || !toStation) {
            Components.Toast.show('Station not found', 'error');
            return;
        }
        
        const fare = MIndicatorData.fareChart.calculateFare(fromStation.zone, toStation.zone, ticketClass);
        
        const resultDiv = document.getElementById('fare-result');
        resultDiv.innerHTML = `
            <div class="fare-breakdown">
                <h3>Fare Breakdown</h3>
                <div class="fare-details">
                    <div class="fare-row">
                        <span>From:</span>
                        <span>${fromStation.name} (Zone ${fromStation.zone})</span>
                    </div>
                    <div class="fare-row">
                        <span>To:</span>
                        <span>${toStation.name} (Zone ${toStation.zone})</span>
                    </div>
                    <div class="fare-row">
                        <span>Class:</span>
                        <span>${Utils.capitalizeWords(ticketClass)} Class</span>
                    </div>
                    <div class="fare-row total">
                        <span>Total Fare:</span>
                        <span>${Utils.formatCurrency(fare)}</span>
                    </div>
                </div>
            </div>
        `;
        resultDiv.style.display = 'block';
    },

    // Show route maps
    showRouteMaps: function() {
        const content = `
            <div class="route-maps">
                <h2><i class="fas fa-map"></i> Route Maps</h2>
                <div class="map-selector">
                    <button class="map-btn active" data-line="western">Western Line</button>
                    <button class="map-btn" data-line="central">Central Line</button>
                    <button class="map-btn" data-line="harbour">Harbour Line</button>
                </div>
                <div class="map-container">
                    <p>Interactive route maps would be displayed here.</p>
                    <p>In a production app, this would show:</p>
                    <ul>
                        <li>Visual train line representation</li>
                        <li>All stations with connections</li>
                        <li>Real-time train positions</li>
                        <li>Station facilities and amenities</li>
                    </ul>
                </div>
            </div>
        `;
        
        Components.Modal.open(content);
    },

    // Show offline options
    showOfflineOptions: function() {
        const content = `
            <div class="offline-options">
                <h2><i class="fas fa-download"></i> Offline Mode</h2>
                <p>Download train schedules for offline access</p>
                <div class="download-options">
                    <div class="download-item">
                        <div class="download-info">
                            <h4>Western Line Schedules</h4>
                            <p>Complete timetables for Western line trains</p>
                        </div>
                        <button class="btn btn-primary">Download</button>
                    </div>
                    <div class="download-item">
                        <div class="download-info">
                            <h4>Central Line Schedules</h4>
                            <p>Complete timetables for Central line trains</p>
                        </div>
                        <button class="btn btn-primary">Download</button>
                    </div>
                    <div class="download-item">
                        <div class="download-info">
                            <h4>Harbour Line Schedules</h4>
                            <p>Complete timetables for Harbour line trains</p>
                        </div>
                        <button class="btn btn-primary">Download</button>
                    </div>
                </div>
                <p class="offline-note">
                    <i class="fas fa-info-circle"></i>
                    Offline schedules are updated automatically when connected to WiFi
                </p>
            </div>
        `;
        
        Components.Modal.open(content);
    },

    // Show alert settings
    showAlertSettings: function() {
        const content = `
            <div class="alert-settings">
                <h2><i class="fas fa-bell"></i> Smart Alerts</h2>
                <div class="alert-options">
                    <div class="alert-option">
                        <label class="checkbox-label">
                            <input type="checkbox" checked>
                            <span class="checkbox-custom"></span>
                            Service disruption alerts
                        </label>
                    </div>
                    <div class="alert-option">
                        <label class="checkbox-label">
                            <input type="checkbox" checked>
                            <span class="checkbox-custom"></span>
                            Delay notifications
                        </label>
                    </div>
                    <div class="alert-option">
                        <label class="checkbox-label">
                            <input type="checkbox">
                            <span class="checkbox-custom"></span>
                            Schedule change updates
                        </label>
                    </div>
                    <div class="alert-option">
                        <label class="checkbox-label">
                            <input type="checkbox">
                            <span class="checkbox-custom"></span>
                            New route announcements
                        </label>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="Components.Modal.close()">Cancel</button>
                    <button class="btn btn-primary" onclick="Components.Modal.close()">Save Settings</button>
                </div>
            </div>
        `;
        
        Components.Modal.open(content);
    },

    // Show feedback form
    showFeedbackForm: function() {
        const content = `
            <div class="feedback-form">
                <h2><i class="fas fa-comment"></i> Feedback</h2>
                <form>
                    <div class="form-group">
                        <label for="feedback-type">Type</label>
                        <select id="feedback-type">
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="general">General Feedback</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="feedback-message">Message</label>
                        <textarea id="feedback-message" rows="4" placeholder="Please describe your feedback..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="feedback-email">Email (Optional)</label>
                        <input type="email" id="feedback-email" placeholder="your.email@example.com">
                    </div>
                </form>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="Components.Modal.close()">Cancel</button>
                    <button class="btn btn-primary" onclick="App.submitFeedback()">Submit Feedback</button>
                </div>
            </div>
        `;
        
        Components.Modal.open(content);
    },

    // Submit feedback
    submitFeedback: function() {
        const type = document.getElementById('feedback-type').value;
        const message = document.getElementById('feedback-message').value.trim();
        const email = document.getElementById('feedback-email').value.trim();
        
        if (!message) {
            Components.Toast.show('Please enter your feedback message', 'warning');
            return;
        }
        
        // In a real app, this would send to a server
        console.log('Feedback submitted:', { type, message, email });
        
        Components.Modal.close();
        Components.Toast.show('Thank you for your feedback!', 'success');
    },

    // Show notifications
    showNotifications: function() {
        const notifications = [
            {
                id: 1,
                title: 'Service Update',
                message: 'Western Line services running normally',
                time: '10 minutes ago',
                type: 'info'
            },
            {
                id: 2,
                title: 'Delay Alert',
                message: 'Central Line experiencing 5-minute delays',
                time: '25 minutes ago',
                type: 'warning'
            },
            {
                id: 3,
                title: 'Schedule Update',
                message: 'New AC local services added on Harbour Line',
                time: '2 hours ago',
                type: 'success'
            }
        ];

        const content = `
            <div class="notifications-panel">
                <h2><i class="fas fa-bell"></i> Notifications</h2>
                <div class="notifications-list">
                    ${notifications.map(notif => `
                        <div class="notification-item ${notif.type}">
                            <div class="notification-content">
                                <h4>${notif.title}</h4>
                                <p>${notif.message}</p>
                                <span class="notification-time">${notif.time}</span>
                            </div>
                            <button class="notification-close" onclick="this.parentElement.remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="App.clearAllNotifications()">Clear All</button>
                    <button class="btn btn-primary" onclick="Components.Modal.close()">Close</button>
                </div>
            </div>
        `;
        
        Components.Modal.open(content);
        
        // Mark notifications as read
        document.querySelector('.notification-badge').style.display = 'none';
    },

    // Clear all notifications
    clearAllNotifications: function() {
        document.querySelector('.notifications-list').innerHTML = '<p class="no-notifications">No new notifications</p>';
    },

    // Update time display
    updateTimeDisplay: function() {
        // Update any time-sensitive displays
        const timeElements = document.querySelectorAll('[data-time]');
        timeElements.forEach(element => {
            const targetTime = element.dataset.time;
            if (targetTime) {
                element.textContent = Utils.getTimeUntil(targetTime);
            }
        });
    },

    // Handle app errors gracefully
    handleError: function(error, context = '') {
        Utils.handleError(error, context);
        
        if (!this.state.isOnline) {
            Components.Toast.show('Some features require internet connection', 'warning');
        } else {
            Components.Toast.show('Something went wrong. Please try again.', 'error');
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Handle app lifecycle events
window.addEventListener('beforeunload', (e) => {
    // Save any pending data
    console.log('App closing...');
});

// Service Worker registration for PWA
if (Utils.supportsServiceWorker()) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

// Export for global access
if (typeof window !== 'undefined') {
    window.App = App;
}
