// M-Indicator UI Components and Interactive Functionality

const Components = {
    // Autocomplete Component
    Autocomplete: {
        init: function(inputElement, options = {}) {
            const dropdown = document.getElementById('autocomplete-dropdown');
            let currentFocus = -1;
            let timeout;

            const defaultOptions = {
                minChars: 2,
                delay: 300,
                maxResults: 8,
                onSelect: () => {},
                searchFunction: MIndicatorData.searchStations.bind(MIndicatorData)
            };

            const config = { ...defaultOptions, ...options };

            const showResults = (results) => {
                dropdown.innerHTML = '';
                dropdown.classList.remove('show');
                currentFocus = -1;

                if (results.length === 0) return;

                results.forEach((station, index) => {
                    const item = Utils.createElement('div', 'autocomplete-item');
                    item.innerHTML = `
                        <div class="station-name">${station.name}</div>
                        <div class="station-line">${Utils.capitalizeWords(station.line)} Line</div>
                    `;
                    
                    item.addEventListener('click', () => {
                        inputElement.value = station.name;
                        dropdown.classList.remove('show');
                        config.onSelect(station);
                    });

                    dropdown.appendChild(item);
                });

                // Position dropdown
                const rect = inputElement.getBoundingClientRect();
                dropdown.style.top = rect.bottom + 'px';
                dropdown.style.left = rect.left + 'px';
                dropdown.style.width = rect.width + 'px';
                dropdown.classList.add('show');
            };

            const searchStations = Utils.debounce((query) => {
                if (query.length >= config.minChars) {
                    const results = config.searchFunction(query).slice(0, config.maxResults);
                    showResults(results);
                } else {
                    dropdown.classList.remove('show');
                }
            }, config.delay);

            // Input event listener
            inputElement.addEventListener('input', (e) => {
                searchStations(e.target.value.trim());
            });

            // Keyboard navigation
            inputElement.addEventListener('keydown', (e) => {
                const items = dropdown.querySelectorAll('.autocomplete-item');
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentFocus++;
                    if (currentFocus >= items.length) currentFocus = 0;
                    this.setActive(items, currentFocus);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentFocus--;
                    if (currentFocus < 0) currentFocus = items.length - 1;
                    this.setActive(items, currentFocus);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentFocus > -1 && items[currentFocus]) {
                        items[currentFocus].click();
                    }
                } else if (e.key === 'Escape') {
                    dropdown.classList.remove('show');
                    inputElement.blur();
                }
            });

            // Hide dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!inputElement.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        },

        setActive: function(items, currentFocus) {
            items.forEach((item, index) => {
                item.classList.toggle('highlighted', index === currentFocus);
            });
        }
    },

    // Modal Component
    Modal: {
        open: function(content, options = {}) {
            const modal = document.getElementById('modal-overlay');
            const modalContent = document.getElementById('modal-content');
            
            modalContent.innerHTML = content;
            modal.classList.add('show');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Auto-close option
            if (options.autoClose) {
                setTimeout(() => this.close(), options.autoClose);
            }
            
            // Close on backdrop click
            if (options.closeOnBackdrop !== false) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) this.close();
                });
            }
            
            // ESC key to close
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.close();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        },

        close: function() {
            const modal = document.getElementById('modal-overlay');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },

    // Bottom Sheet Component
    BottomSheet: {
        show: function(content, options = {}) {
            const bottomSheet = document.getElementById('bottom-sheet');
            const bottomSheetContent = document.getElementById('bottom-sheet-content');
            
            bottomSheetContent.innerHTML = content;
            bottomSheet.classList.add('show');
            
            // Handle swipe down to close on mobile
            if (Utils.isMobile()) {
                Utils.addTouchSupport(bottomSheet, {
                    ondown: () => this.hide(),
                    threshold: 100
                });
            }
            
            // Close on backdrop click (area above the sheet)
            bottomSheet.addEventListener('click', (e) => {
                if (e.target === bottomSheet) this.hide();
            });
        },

        hide: function() {
            const bottomSheet = document.getElementById('bottom-sheet');
            bottomSheet.classList.remove('show');
        }
    },

    // Toast Notifications
    Toast: {
        show: function(message, type = 'info', duration = 3000) {
            // Remove existing toast
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
                existingToast.remove();
            }

            const toast = Utils.createElement('div', `toast toast-${type}`);
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas ${this.getIcon(type)}"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // Add styles
            Object.assign(toast.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: this.getBackgroundColor(type),
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: '10000',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '400px',
                animation: 'slideInRight 0.3s ease'
            });

            document.body.appendChild(toast);

            // Close button
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.remove();
            });

            // Auto remove
            if (duration > 0) {
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.style.animation = 'slideOutRight 0.3s ease';
                        setTimeout(() => toast.remove(), 300);
                    }
                }, duration);
            }

            return toast;
        },

        getIcon: function(type) {
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };
            return icons[type] || icons.info;
        },

        getBackgroundColor: function(type) {
            const colors = {
                success: '#27AE60',
                error: '#E74C3C',
                warning: '#F39C12',
                info: '#3498DB'
            };
            return colors[type] || colors.info;
        }
    },

    // Loading Component
    Loading: {
        show: function(message = 'Loading...') {
            this.hide(); // Remove existing loader
            
            const loader = Utils.createElement('div', 'loading-overlay');
            loader.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                    </div>
                    <div class="loading-message">${message}</div>
                </div>
            `;

            // Add styles
            Object.assign(loader.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9999',
                color: 'white'
            });

            document.body.appendChild(loader);
            return loader;
        },

        hide: function() {
            const loader = document.querySelector('.loading-overlay');
            if (loader) {
                loader.remove();
            }
        }
    },

    // Search Results Component
    SearchResults: {
        render: function(container, results, options = {}) {
            container.innerHTML = '';
            
            if (results.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No trains found</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                `;
                return;
            }

            results.forEach(train => {
                const resultElement = Utils.createElement('div', 'train-result');
                resultElement.innerHTML = `
                    <div class="train-time">
                        <div class="departure-time">${train.departure}</div>
                        <div class="arrival-time">Arr: ${train.arrival}</div>
                    </div>
                    <div class="train-details">
                        <div class="train-type">${Utils.formatTrainNumber(train.trainNumber)}</div>
                        <div class="train-duration">${train.duration}</div>
                    </div>
                    <div class="train-info-extra">
                        <div class="platform-info">Platform ${train.platform}</div>
                        <div class="train-status-indicator ${train.status}">
                            ${train.status === 'ontime' ? 'On Time' : 'Delayed'}
                        </div>
                    </div>
                `;

                // Add click handler for train details
                resultElement.addEventListener('click', () => {
                    this.showTrainDetails(train);
                });

                container.appendChild(resultElement);
            });
        },

        showTrainDetails: function(train) {
            const content = `
                <div class="train-detail-modal">
                    <h2><i class="fas fa-train"></i> ${Utils.formatTrainNumber(train.trainNumber)}</h2>
                    <div class="train-detail-info">
                        <div class="detail-row">
                            <span class="label">Departure:</span>
                            <span class="value">${train.departure}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Arrival:</span>
                            <span class="value">${train.arrival}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Duration:</span>
                            <span class="value">${train.duration}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Platform:</span>
                            <span class="value">${train.platform}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value status-${train.status}">
                                ${train.status === 'ontime' ? 'On Time' : 'Delayed'}
                            </span>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="Components.Modal.close()">Close</button>
                        <button class="btn btn-secondary" onclick="Components.setReminder('${train.trainNumber}', '${train.departure}')">Set Reminder</button>
                    </div>
                </div>
            `;
            
            Components.Modal.open(content);
        }
    },

    // Live Trains Component
    LiveTrains: {
        render: function(container, trains) {
            container.innerHTML = '';
            
            if (trains.length === 0) {
                container.innerHTML = `
                    <div class="no-live-data">
                        <i class="fas fa-broadcast-tower"></i>
                        <h3>No live data available</h3>
                        <p>Live tracking will resume shortly</p>
                    </div>
                `;
                return;
            }

            trains.forEach(train => {
                const trainElement = Utils.createElement('div', 'live-train-item');
                trainElement.innerHTML = `
                    <div class="train-info">
                        <div>
                            <div class="train-number">${train.trainNumber}</div>
                            <div class="train-route">${train.route}</div>
                        </div>
                        <div class="train-status">
                            <div class="current-location">Currently at: ${train.currentStation}</div>
                            <div class="delay-info ${train.status}">
                                ${train.status === 'ontime' ? 'On Time' : `Delayed by ${train.delay} min`}
                            </div>
                        </div>
                    </div>
                    <div class="next-stations">
                        <div class="next-station">Next: ${train.nextStation} (${train.nextStationETA})</div>
                        <div class="crowd-level">
                            <i class="fas fa-users"></i>
                            Crowd: ${Utils.capitalizeWords(train.crowdLevel)}
                        </div>
                    </div>
                `;

                // Add click handler for more details
                trainElement.addEventListener('click', () => {
                    this.showLiveTrainDetails(train);
                });

                container.appendChild(trainElement);
            });
        },

        showLiveTrainDetails: function(train) {
            const content = `
                <div class="live-train-detail">
                    <h2><i class="fas fa-broadcast-tower pulse"></i> ${train.trainNumber}</h2>
                    <div class="route-info">
                        <h3>${train.route}</h3>
                    </div>
                    <div class="current-status">
                        <div class="status-card">
                            <div class="status-label">Current Location</div>
                            <div class="status-value">${train.currentStation}</div>
                        </div>
                        <div class="status-card">
                            <div class="status-label">Next Station</div>
                            <div class="status-value">${train.nextStation}</div>
                        </div>
                        <div class="status-card">
                            <div class="status-label">ETA</div>
                            <div class="status-value">${train.nextStationETA}</div>
                        </div>
                        <div class="status-card">
                            <div class="status-label">Status</div>
                            <div class="status-value status-${train.status}">
                                ${train.status === 'ontime' ? 'On Time' : `${train.delay} min delay`}
                            </div>
                        </div>
                        <div class="status-card">
                            <div class="status-label">Coaches</div>
                            <div class="status-value">${train.coaches}</div>
                        </div>
                        <div class="status-card">
                            <div class="status-label">Crowd Level</div>
                            <div class="status-value crowd-${train.crowdLevel}">
                                ${Utils.capitalizeWords(train.crowdLevel)}
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="Components.Modal.close()">Close</button>
                        <button class="btn btn-secondary" onclick="Components.trackTrain('${train.trainNumber}')">Track Train</button>
                    </div>
                </div>
            `;
            
            Components.Modal.open(content);
        }
    },

    // Route Options Component
    RouteOptions: {
        render: function(container, routes) {
            container.innerHTML = '';
            
            if (routes.length === 0) {
                container.innerHTML = `
                    <div class="no-routes">
                        <i class="fas fa-route"></i>
                        <h3>No routes found</h3>
                        <p>Please check your station names</p>
                    </div>
                `;
                return;
            }

            routes.forEach((route, index) => {
                const routeElement = Utils.createElement('div', 'route-option');
                if (index === 0) routeElement.classList.add('selected');

                routeElement.innerHTML = `
                    <div class="route-summary">
                        <div class="route-duration">${route.duration} min</div>
                        <div class="route-cost">${Utils.formatCurrency(route.cost)}</div>
                    </div>
                    <div class="route-meta">
                        <span class="route-type">${route.type}</span>
                        <span class="route-changes">${route.changes} change${route.changes !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="route-steps">
                        ${route.steps.map((step, stepIndex) => `
                            <div class="route-step">
                                <div class="step-icon">${stepIndex + 1}</div>
                                <div class="step-details">
                                    <div class="step-instruction">${step.instruction}</div>
                                    <div class="step-time">${step.duration}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

                routeElement.addEventListener('click', () => {
                    container.querySelectorAll('.route-option').forEach(r => r.classList.remove('selected'));
                    routeElement.classList.add('selected');
                });

                container.appendChild(routeElement);
            });
        }
    },

    // Favorites Component
    Favorites: {
        render: function(container) {
            const favorites = StorageManager.getFavorites();
            container.innerHTML = '';
            
            if (favorites.length === 0) {
                container.innerHTML = `
                    <div class="no-favorites">
                        <i class="fas fa-heart"></i>
                        <p>No favorite routes yet</p>
                        <button class="btn btn-primary" onclick="Components.Favorites.showAddDialog()">
                            Add Favorite Route
                        </button>
                    </div>
                `;
                return;
            }

            favorites.forEach((favorite, index) => {
                const favoriteElement = Utils.createElement('div', 'favorite-item');
                favoriteElement.innerHTML = `
                    <div class="favorite-route">
                        <div class="favorite-stations">${favorite.from} → ${favorite.to}</div>
                        <div class="favorite-time">Added ${this.formatDate(favorite.timestamp)}</div>
                    </div>
                    <div class="favorite-actions">
                        <button class="favorite-btn" onclick="Components.Favorites.search('${favorite.from}', '${favorite.to}')" title="Search">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="favorite-btn" onclick="Components.Favorites.remove(${index})" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(favoriteElement);
            });
        },

        showAddDialog: function() {
            const content = `
                <div class="add-favorite-dialog">
                    <h2><i class="fas fa-heart"></i> Add Favorite Route</h2>
                    <div class="form-group">
                        <label for="fav-from">From Station</label>
                        <input type="text" id="fav-from" placeholder="Enter departure station">
                    </div>
                    <div class="form-group">
                        <label for="fav-to">To Station</label>
                        <input type="text" id="fav-to" placeholder="Enter destination station">
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="Components.Modal.close()">Cancel</button>
                        <button class="btn btn-primary" onclick="Components.Favorites.add()">Add Favorite</button>
                    </div>
                </div>
            `;
            
            Components.Modal.open(content);
            
            // Initialize autocomplete for the inputs
            setTimeout(() => {
                Components.Autocomplete.init(document.getElementById('fav-from'));
                Components.Autocomplete.init(document.getElementById('fav-to'));
            }, 100);
        },

        add: function() {
            const from = document.getElementById('fav-from').value.trim();
            const to = document.getElementById('fav-to').value.trim();
            
            if (!from || !to) {
                Components.Toast.show('Please enter both stations', 'warning');
                return;
            }
            
            if (from === to) {
                Components.Toast.show('From and To stations cannot be the same', 'warning');
                return;
            }

            const favorite = {
                from,
                to,
                timestamp: Date.now()
            };

            StorageManager.addFavorite(favorite);
            Components.Modal.close();
            Components.Toast.show('Favorite route added!', 'success');
            
            // Refresh favorites display
            this.render(document.getElementById('favorites-list'));
        },

        remove: function(index) {
            if (confirm('Remove this favorite route?')) {
                StorageManager.removeFavorite(index);
                Components.Toast.show('Favorite removed', 'info');
                this.render(document.getElementById('favorites-list'));
            }
        },

        search: function(from, to) {
            // Set the search inputs and trigger search
            document.getElementById('from-station').value = from;
            document.getElementById('to-station').value = to;
            
            // Switch to schedule tab and search
            App.switchTab('schedule');
            App.searchTrains(from, to);
        },

        formatDate: function(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'today';
            if (diffDays === 1) return 'yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            
            return date.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short' 
            });
        }
    },

    // Station Info Component
    StationInfo: {
        show: function(stationName) {
            const station = MIndicatorData.findStation(stationName);
            
            if (!station) {
                Components.Toast.show('Station not found', 'error');
                return;
            }

            const facilities = station.facilities.map(facility => {
                const icons = {
                    parking: 'fa-parking',
                    food: 'fa-utensils',
                    atm: 'fa-credit-card',
                    restroom: 'fa-restroom',
                    mall: 'fa-shopping-bag'
                };
                return `<span class="facility"><i class="fas ${icons[facility] || 'fa-check'}"></i> ${Utils.capitalizeWords(facility)}</span>`;
            }).join('');

            const content = `
                <div class="station-info-modal">
                    <h2><i class="fas fa-building"></i> ${station.name}</h2>
                    <div class="station-details">
                        <div class="detail-section">
                            <h3>Line Information</h3>
                            <p><strong>Line:</strong> ${Utils.capitalizeWords(station.line)} Line</p>
                            <p><strong>Zone:</strong> ${station.zone}</p>
                        </div>
                        <div class="detail-section">
                            <h3>Facilities</h3>
                            <div class="facilities-list">
                                ${facilities || '<span class="no-facilities">No specific facilities listed</span>'}
                            </div>
                        </div>
                        <div class="detail-section">
                            <h3>Location</h3>
                            <p><strong>Coordinates:</strong> ${station.coordinates[0]}, ${station.coordinates[1]}</p>
                            <button class="btn btn-secondary" onclick="Components.StationInfo.showOnMap(${station.coordinates[0]}, ${station.coordinates[1]})">
                                <i class="fas fa-map-marker-alt"></i> View on Map
                            </button>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="Components.Modal.close()">Close</button>
                    </div>
                </div>
            `;
            
            Components.Modal.open(content);
        },

        showOnMap: function(lat, lng) {
            if (Utils.isMobile()) {
                window.open(`geo:${lat},${lng}`, '_blank');
            } else {
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
            }
        }
    },

    // Settings/Preferences Component
    Settings: {
        show: function() {
            const preferences = StorageManager.getPreferences();
            
            const content = `
                <div class="settings-modal">
                    <h2><i class="fas fa-cog"></i> Settings</h2>
                    <div class="settings-form">
                        <div class="setting-group">
                            <label for="default-line">Default Line</label>
                            <select id="default-line">
                                <option value="western" ${preferences.defaultLine === 'western' ? 'selected' : ''}>Western Line</option>
                                <option value="central" ${preferences.defaultLine === 'central' ? 'selected' : ''}>Central Line</option>
                                <option value="harbour" ${preferences.defaultLine === 'harbour' ? 'selected' : ''}>Harbour Line</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="enable-notifications" ${preferences.notifications ? 'checked' : ''}>
                                <span class="checkbox-custom"></span>
                                Enable Notifications
                            </label>
                        </div>
                        <div class="setting-group">
                            <label for="theme">Theme</label>
                            <select id="theme">
                                <option value="light" ${preferences.theme === 'light' ? 'selected' : ''}>Light</option>
                                <option value="dark" ${preferences.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                <option value="auto" ${preferences.theme === 'auto' ? 'selected' : ''}>Auto</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="Components.Modal.close()">Cancel</button>
                        <button class="btn btn-primary" onclick="Components.Settings.save()">Save Settings</button>
                    </div>
                </div>
            `;
            
            Components.Modal.open(content);
        },

        save: function() {
            const preferences = {
                defaultLine: document.getElementById('default-line').value,
                notifications: document.getElementById('enable-notifications').checked,
                theme: document.getElementById('theme').value,
                language: 'en' // Fixed for now
            };
            
            StorageManager.savePreferences(preferences);
            Components.Modal.close();
            Components.Toast.show('Settings saved successfully!', 'success');
            
            // Apply theme change
            this.applyTheme(preferences.theme);
        },

        applyTheme: function(theme) {
            document.body.classList.remove('theme-light', 'theme-dark');
            
            if (theme === 'auto') {
                // Use system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
            } else {
                document.body.classList.add(`theme-${theme}`);
            }
        }
    },

    // Utility functions for components
    setReminder: function(trainNumber, departureTime) {
        if (!Utils.supportsNotifications()) {
            Components.Toast.show('Notifications not supported on this device', 'warning');
            return;
        }

        Utils.requestNotificationPermission().then(() => {
            const [hours, minutes] = departureTime.split(':').map(Number);
            const now = new Date();
            const reminderTime = new Date();
            reminderTime.setHours(hours, minutes - 10, 0, 0); // 10 minutes before

            if (reminderTime <= now) {
                reminderTime.setDate(reminderTime.getDate() + 1);
            }

            const timeUntilReminder = reminderTime.getTime() - now.getTime();
            
            setTimeout(() => {
                Utils.showNotification(`Train Reminder`, {
                    body: `${trainNumber} departs in 10 minutes at ${departureTime}`,
                    icon: '/assets/icon-192x192.png'
                });
            }, timeUntilReminder);

            Components.Toast.show(`Reminder set for ${Utils.formatTime(departureTime)}`, 'success');
            Components.Modal.close();
        }).catch(() => {
            Components.Toast.show('Please enable notifications to set reminders', 'warning');
        });
    },

    trackTrain: function(trainNumber) {
        Components.Toast.show(`Now tracking ${trainNumber}`, 'info');
        Components.Modal.close();
        // In a real app, this would start real-time tracking
    }
};

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .pulse {
        animation: pulse 2s infinite;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .no-results, .no-live-data, .no-routes, .no-favorites {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .no-results i, .no-live-data i, .no-routes i, .no-favorites i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--primary-color);
    }

    .status-ontime { color: var(--success-color); }
    .status-delayed { color: var(--warning-color); }
    
    .crowd-low { color: var(--success-color); }
    .crowd-moderate { color: var(--warning-color); }
    .crowd-high { color: var(--error-color); }

    .facilities-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .facility {
        background: var(--primary-light);
        color: var(--primary-dark);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .settings-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .setting-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
    }

    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: var(--primary-color);
        color: white;
    }

    .btn-secondary {
        background: var(--text-light);
        color: var(--text-primary);
    }

    .btn:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Components = Components;
}
