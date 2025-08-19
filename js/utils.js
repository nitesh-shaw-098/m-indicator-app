// M-Indicator Utility Functions

const Utils = {
    // DOM Helper Functions
    createElement: function(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    getElement: function(selector) {
        return document.querySelector(selector);
    },

    getElements: function(selector) {
        return document.querySelectorAll(selector);
    },

    addEventListeners: function(elements, event, handler) {
        if (typeof elements === 'string') {
            elements = this.getElements(elements);
        }
        if (elements.length) {
            elements.forEach(element => element.addEventListener(event, handler));
        } else if (elements.addEventListener) {
            elements.addEventListener(event, handler);
        }
    },

    // Animation Helpers
    fadeIn: function(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    fadeOut: function(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(element.style.opacity) || 1;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    slideUp: function(element, duration = 300) {
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.maxHeight = '0px';
        }, 10);
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.removeProperty('max-height');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition');
        }, duration);
    },

    slideDown: function(element, duration = 300) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        
        element.style.maxHeight = '0px';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.maxHeight = height + 'px';
        }, 10);
        
        setTimeout(() => {
            element.style.removeProperty('max-height');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition');
        }, duration);
    },

    // Time and Date Utilities
    getCurrentTime: function() {
        return new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    },

    getCurrentDate: function() {
        return new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatTime: function(timeString) {
        // Convert 24-hour time to 12-hour format
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    },

    formatDuration: function(minutes) {
        if (minutes < 60) {
            return `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    },

    getTimeUntil: function(targetTime) {
        const [hours, minutes] = targetTime.split(':').map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        
        // If target time is in the past today, assume it's tomorrow
        if (target < now) {
            target.setDate(target.getDate() + 1);
        }
        
        const diffMs = target - now;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffMinutes < 1) return 'Now';
        if (diffMinutes < 60) return `${diffMinutes}m`;
        
        const hours_diff = Math.floor(diffMinutes / 60);
        const minutes_diff = diffMinutes % 60;
        return `${hours_diff}h ${minutes_diff}m`;
    },

    // Data Formatting
    formatStationName: function(name) {
        // Capitalize first letter of each word
        return name.split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
    },

    formatTrainNumber: function(trainNumber) {
        return trainNumber.replace(/-/g, ' ').toUpperCase();
    },

    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    // Distance and Location
    calculateDistance: function(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.degToRad(lat2 - lat1);
        const dLon = this.degToRad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    },

    degToRad: function(deg) {
        return deg * (Math.PI/180);
    },

    // Device and Browser Detection
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isIOS: function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },

    isAndroid: function() {
        return /Android/.test(navigator.userAgent);
    },

    supportsServiceWorker: function() {
        return 'serviceWorker' in navigator;
    },

    supportsNotifications: function() {
        return 'Notification' in window;
    },

    // Geolocation
    getCurrentPosition: function() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    },

    findNearestStation: function(userLat, userLon) {
        let nearestStation = null;
        let minDistance = Infinity;

        // Check all stations
        for (const line in MIndicatorData.stations) {
            MIndicatorData.stations[line].forEach(station => {
                const [stationLat, stationLon] = station.coordinates;
                const distance = this.calculateDistance(userLat, userLon, stationLat, stationLon);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestStation = {
                        ...station,
                        distance: Math.round(distance * 1000) // Convert to meters
                    };
                }
            });
        }

        return nearestStation;
    },

    // URL and Query String
    getQueryParam: function(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    setQueryParam: function(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    },

    // Local Storage with Expiry
    setStorageWithExpiry: function(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    getStorageWithExpiry: function(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            const now = new Date();
            
            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            return item.value;
        } catch {
            localStorage.removeItem(key);
            return null;
        }
    },

    // Network Status
    isOnline: function() {
        return navigator.onLine;
    },

    onNetworkChange: function(callback) {
        window.addEventListener('online', () => callback(true));
        window.addEventListener('offline', () => callback(false));
    },

    // Notifications
    requestNotificationPermission: async function() {
        if (!this.supportsNotifications()) {
            throw new Error('Notifications not supported');
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            throw new Error('Notifications denied by user');
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    showNotification: function(title, options = {}) {
        if (!this.supportsNotifications() || Notification.permission !== 'granted') {
            return null;
        }

        const defaultOptions = {
            icon: '/assets/icon-192x192.png',
            badge: '/assets/icon-192x192.png',
            vibrate: [200, 100, 200],
            tag: 'mindicator',
            ...options
        };

        return new Notification(title, defaultOptions);
    },

    // Debounce and Throttle
    debounce: function(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Array and Object Utilities
    groupBy: function(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            result[group] = result[group] || [];
            result[group].push(item);
            return result;
        }, {});
    },

    sortBy: function(array, key, ascending = true) {
        return array.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });
    },

    // String Utilities
    capitalizeWords: function(str) {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    slugify: function(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    },

    // Color Utilities
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex: function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    // Performance Monitoring
    measurePerformance: function(name, fn) {
        const startTime = performance.now();
        const result = fn();
        const endTime = performance.now();
        console.log(`${name} took ${endTime - startTime} milliseconds`);
        return result;
    },

    // Error Handling
    handleError: function(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // In production, you might want to send errors to a logging service
        if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'exception', {
                description: `${context}: ${error.message}`,
                fatal: false
            });
        }
    },

    // Touch and Gesture Support
    addTouchSupport: function(element, options = {}) {
        let startX, startY, distX, distY;
        const threshold = options.threshold || 50;
        const allowedTime = options.allowedTime || 300;
        
        element.addEventListener('touchstart', (e) => {
            const touchobj = e.changedTouches[0];
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
        }, false);

        element.addEventListener('touchend', (e) => {
            const touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            const elapsedTime = new Date().getTime() - startTime;
            
            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= 100) {
                    const direction = distX < 0 ? 'left' : 'right';
                    if (options[`on${direction}`]) {
                        options[`on${direction}`](e);
                    }
                } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= 100) {
                    const direction = distY < 0 ? 'up' : 'down';
                    if (options[`on${direction}`]) {
                        options[`on${direction}`](e);
                    }
                }
            }
        }, false);
    },

    // Copy to Clipboard
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },

    // Share API
    canShare: function() {
        return navigator.share !== undefined;
    },

    share: async function(data) {
        if (this.canShare()) {
            try {
                await navigator.share(data);
                return true;
            } catch (err) {
                console.log('Error sharing:', err);
                return false;
            }
        }
        return false;
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}
