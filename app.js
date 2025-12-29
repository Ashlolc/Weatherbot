/**
 * WeatherBot - 3D Weather Experience
 * Main Application JavaScript - Enhanced Version
 */

// ============ Configuration ============
const CONFIG = {
    weatherApiUrl: 'https://api.openweathermap.org/data/2.5',
    geoApiUrl: 'https://api.openweathermap.org/geo/1.0',
    airQualityUrl: 'https://api.openweathermap.org/data/2.5/air_pollution',
    radarTileUrl: 'https://tile.openweathermap.org/map',
    nexradTileUrl: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi',
    defaultLocation: { lat: 40.7128, lon: -74.0060, name: 'New York, NY' },
    debounceDelay: 300,
    weatherIcons: {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    },
    moonPhases: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
    aqiLevels: ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
    aqiColors: ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97'],
    nexradSites: {
        'KOKX': { lat: 40.8656, lon: -72.8639, name: 'New York City, NY' },
        'KBOX': { lat: 41.9558, lon: -71.1369, name: 'Boston, MA' },
        'KDIX': { lat: 39.9469, lon: -74.4108, name: 'Philadelphia, PA' },
        'KBGM': { lat: 42.1997, lon: -75.9847, name: 'Binghamton, NY' },
        'KBUF': { lat: 42.9489, lon: -78.7369, name: 'Buffalo, NY' },
        'KFFC': { lat: 33.3636, lon: -84.5658, name: 'Atlanta, GA' },
        'KMIA': { lat: 25.6111, lon: -80.4128, name: 'Miami, FL' },
        'KTBW': { lat: 27.7056, lon: -82.4017, name: 'Tampa, FL' },
        'KCLX': { lat: 32.6556, lon: -81.0422, name: 'Charleston, SC' },
        'KMHX': { lat: 34.7761, lon: -76.8761, name: 'Morehead City, NC' },
        'KLOT': { lat: 41.6044, lon: -88.0847, name: 'Chicago, IL' },
        'KDTX': { lat: 42.6997, lon: -83.4717, name: 'Detroit, MI' },
        'KIWX': { lat: 41.3586, lon: -85.7000, name: 'Fort Wayne, IN' },
        'KMKX': { lat: 42.9678, lon: -88.5506, name: 'Milwaukee, WI' },
        'KMPX': { lat: 44.8489, lon: -93.5653, name: 'Minneapolis, MN' },
        'KFWS': { lat: 32.5731, lon: -97.3031, name: 'Dallas/Fort Worth, TX' },
        'KEWX': { lat: 29.7039, lon: -98.0286, name: 'Austin/San Antonio, TX' },
        'KHGX': { lat: 29.4719, lon: -95.0792, name: 'Houston, TX' },
        'KTLX': { lat: 35.3331, lon: -97.2778, name: 'Oklahoma City, OK' },
        'KINX': { lat: 36.1750, lon: -95.5644, name: 'Tulsa, OK' },
        'KFSD': { lat: 43.5878, lon: -96.7292, name: 'Sioux Falls, SD' },
        'KABR': { lat: 45.4558, lon: -98.4131, name: 'Aberdeen, SD' },
        'KBIS': { lat: 46.7708, lon: -100.7606, name: 'Bismarck, ND' },
        'KMVX': { lat: 47.5283, lon: -97.3256, name: 'Fargo, ND' },
        'KFTG': { lat: 39.7867, lon: -104.5458, name: 'Denver, CO' },
        'KGJX': { lat: 39.0622, lon: -108.2139, name: 'Grand Junction, CO' },
        'KRIW': { lat: 43.0661, lon: -108.4772, name: 'Riverton, WY' },
        'KSLC': { lat: 40.9683, lon: -111.9300, name: 'Salt Lake City, UT' },
        'KMUX': { lat: 37.1550, lon: -121.8983, name: 'San Francisco, CA' },
        'KVTX': { lat: 34.4117, lon: -119.1792, name: 'Los Angeles, CA' },
        'KNKX': { lat: 32.9189, lon: -117.0419, name: 'San Diego, CA' },
        'KATX': { lat: 48.1947, lon: -122.4958, name: 'Seattle, WA' },
        'KRTX': { lat: 45.7150, lon: -122.9653, name: 'Portland, OR' },
        'PACG': { lat: 56.8528, lon: -135.5294, name: 'Juneau, AK' },
        'PAHG': { lat: 60.7258, lon: -151.3514, name: 'Anchorage, AK' },
        'PAPD': { lat: 65.0350, lon: -147.5014, name: 'Fairbanks, AK' },
        'PHKM': { lat: 20.1256, lon: -155.7781, name: 'Kohala, HI' },
        'PHMO': { lat: 21.1328, lon: -157.1803, name: 'Molokai, HI' },
        'PHWA': { lat: 19.0950, lon: -155.5686, name: 'South Shore, HI' }
    },
    nexradProducts: {
        'N0Q': { name: 'Base Reflectivity', desc: 'Shows precipitation intensity. Higher values indicate heavier precipitation or larger particles.' },
        'N0U': { name: 'Base Velocity', desc: 'Shows wind velocity relative to the radar. Green = toward radar, red = away from radar. Used for rotation detection.' },
        'N0C': { name: 'Correlation Coefficient', desc: 'Indicates the consistency of precipitation type. Low values suggest mixed precipitation or debris (e.g., tornado debris).' },
        'N0H': { name: 'Hydrometeor Classification', desc: 'Classifies precipitation type (rain, snow, hail, etc.) using dual-polarization data.' },
        'N0K': { name: 'Specific Differential Phase', desc: 'Estimates rainfall rate, particularly useful for heavy rain events and flash flood warnings.' },
        'N0X': { name: 'Differential Reflectivity', desc: 'Indicates the shape of precipitation particles. Helps distinguish rain from hail.' },
        'DVL': { name: 'Vertically Integrated Liquid', desc: 'Total water content in a column of atmosphere. High values indicate severe storm potential.' },
        'EET': { name: 'Enhanced Echo Tops', desc: 'Height of radar echoes. Taller storms often produce more severe weather.' }
    }
};

// ============ State Management ============
const state = {
    deviceMode: localStorage.getItem('deviceMode') || null,
    tempUnit: localStorage.getItem('tempUnit') || 'metric',
    weatherApiKey: localStorage.getItem('weatherApiKey') || '',
    aiProvider: localStorage.getItem('aiProvider') || '',
    apiKeys: {
        openai: localStorage.getItem('openaiKey') || '',
        claude: localStorage.getItem('claudeKey') || '',
        google: localStorage.getItem('googleKey') || '',
        mistral: localStorage.getItem('mistralKey') || '',
        moonshot: localStorage.getItem('moonshotKey') || ''
    },
    currentLocation: JSON.parse(localStorage.getItem('currentLocation')) || null,
    savedLocations: JSON.parse(localStorage.getItem('savedLocations')) || [],
    currentWeather: null,
    forecast: null,
    airQuality: null,
    map: null,
    radarLayer: null,
    lightningMap: null,
    lightningMarkers: [],
    nexradMap: null,
    nexradLayer: null,
    stormCountdownInterval: null,
    chatHistory: [],
    weatherBackground: 'clear'
};

// ============ DOM Elements ============
const elements = {};

function initElements() {
    elements.deviceModal = document.getElementById('deviceModal');
    elements.app = document.getElementById('app');
    elements.locationInput = document.getElementById('locationInput');
    elements.autocompleteDropdown = document.getElementById('autocompleteDropdown');
    elements.locateBtn = document.getElementById('locateBtn');
    elements.dashboardView = document.getElementById('dashboardView');
    elements.radarView = document.getElementById('radarView');
    elements.nexradView = document.getElementById('nexradView');
    elements.chatSidebar = document.getElementById('chatSidebar');
    elements.chatMessages = document.getElementById('chatMessages');
    elements.chatInput = document.getElementById('chatInput');
    elements.sendChatBtn = document.getElementById('sendChatBtn');
    elements.settingsModal = document.getElementById('settingsModal');
    elements.loadingOverlay = document.getElementById('loadingOverlay');
    elements.weatherIcon = document.getElementById('weatherIcon');
    elements.locationName = document.getElementById('locationName');
    elements.temperature = document.getElementById('temperature');
    elements.weatherDesc = document.getElementById('weatherDesc');
    elements.feelsLike = document.getElementById('feelsLike');
    elements.humidity = document.getElementById('humidity');
    elements.wind = document.getElementById('wind');
    elements.uvIndex = document.getElementById('uvIndex');
    elements.pressure = document.getElementById('pressure');
    elements.visibility = document.getElementById('visibility');
    elements.dewPoint = document.getElementById('dewPoint');
    elements.sunrise = document.getElementById('sunrise');
    elements.sunset = document.getElementById('sunset');
    elements.moonPhase = document.getElementById('moonPhase');
    elements.aqi = document.getElementById('aqi');
    elements.alertsContainer = document.getElementById('alertsContainer');
    elements.hourlyForecast = document.getElementById('hourlyForecast');
    elements.dailyForecast = document.getElementById('dailyForecast');
    elements.radarMap = document.getElementById('radarMap');
    elements.savedLocationsContainer = document.getElementById('savedLocationsContainer');
    elements.weatherBackground = document.getElementById('weatherBackground');
    // New elements
    elements.windArrow = document.getElementById('windArrow');
    elements.windSpeedCompass = document.getElementById('windSpeedCompass');
    elements.windGusts = document.getElementById('windGusts');
    elements.stormTrackerCard = document.getElementById('stormTrackerCard');
    elements.stormTrackerContent = document.getElementById('stormTrackerContent');
    elements.precipBars = document.getElementById('precipBars');
    elements.precipTimes = document.getElementById('precipTimes');
    elements.outfitIcon = document.getElementById('outfitIcon');
    elements.outfitSummary = document.getElementById('outfitSummary');
    elements.outfitItems = document.getElementById('outfitItems');
    elements.lightningMap = document.getElementById('lightningMap');
    elements.strikeCount = document.getElementById('strikeCount');
    elements.advancedRadarSection = document.getElementById('advancedRadarSection');
    elements.nexradMap = document.getElementById('nexradMap');
    elements.nexradSite = document.getElementById('nexradSite');
    elements.nexradProduct = document.getElementById('nexradProduct');
    elements.nexradTilt = document.getElementById('nexradTilt');
    elements.nexradSiteInfo = document.getElementById('nexradSiteInfo');
    elements.nexradScanTime = document.getElementById('nexradScanTime');
    elements.productDescription = document.getElementById('productDescription');
}

// ============ Utility Functions ============
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatTemp(temp) {
    if (temp === undefined || temp === null) return '--°';
    const unit = state.tempUnit === 'metric' ? '°C' : '°F';
    return `${Math.round(temp)}${unit}`;
}

function formatTime(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatTimeFromUnix(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatFullDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function getWeatherIcon(iconCode) {
    return CONFIG.weatherIcons[iconCode] || '🌡️';
}

function getMoonPhase() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const c = Math.floor(365.25 * year);
    const e = Math.floor(30.6 * month);
    const jd = c + e + day - 694039.09;
    const phase = jd / 29.53058867;
    const phaseIndex = Math.floor((phase - Math.floor(phase)) * 8);

    return {
        icon: CONFIG.moonPhases[phaseIndex],
        name: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
               'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'][phaseIndex]
    };
}

function getWeatherBackground(weatherMain) {
    const backgrounds = {
        'clear': 'weather-clear',
        'clouds': 'weather-cloudy',
        'rain': 'weather-rainy',
        'drizzle': 'weather-rainy',
        'thunderstorm': 'weather-stormy',
        'snow': 'weather-snowy',
        'mist': 'weather-foggy',
        'fog': 'weather-foggy',
        'haze': 'weather-foggy'
    };
    return backgrounds[weatherMain.toLowerCase()] || 'weather-clear';
}

function showLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.add('hidden');
    }
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00c853' : '#333'};
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============ Markdown Parser for Chat ============
function parseMarkdown(text) {
    if (!text) return '';

    // Escape HTML first
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^## (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^# (.*$)/gm, '<h2>$1</h2>');

    // Lists
    html = html.replace(/^\s*[-*+] (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Numbered lists
    html = html.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
    }

    return html;
}

// ============ Device Detection & Setup ============
function initDeviceModal() {
    if (state.deviceMode) {
        applyDeviceMode(state.deviceMode);
        elements.deviceModal.classList.add('hidden');
        elements.app.classList.remove('hidden');
        initApp();
    } else {
        elements.deviceModal.classList.remove('hidden');
        elements.app.classList.add('hidden');
    }

    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.device;
            state.deviceMode = mode;
            localStorage.setItem('deviceMode', mode);
            applyDeviceMode(mode);
            elements.deviceModal.classList.add('hidden');
            elements.app.classList.remove('hidden');
            initApp();
        });
    });
}

function applyDeviceMode(mode) {
    document.body.classList.toggle('mobile-mode', mode === 'mobile');
    const deviceModeSelect = document.getElementById('deviceMode');
    if (deviceModeSelect) deviceModeSelect.value = mode;
}

// ============ App Initialization ============
async function initApp() {
    setupEventListeners();
    setupNavigation();
    setupSettings();
    updateChatState();
    renderSavedLocations();

    if (state.currentLocation && state.weatherApiKey) {
        await loadWeatherData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
    } else if (state.weatherApiKey) {
        getUserLocation();
    } else {
        showPlaceholderData();
    }

    initRadarMap();
}

function showPlaceholderData() {
    if (elements.locationName) elements.locationName.textContent = 'Set your location';
    if (elements.temperature) elements.temperature.textContent = '--°';
    if (elements.weatherDesc) elements.weatherDesc.textContent = 'Add your API key in settings to get started';
    if (elements.feelsLike) elements.feelsLike.textContent = 'Feels like --°';
}

// ============ Event Listeners ============
function setupEventListeners() {
    // Location input with autocomplete
    if (elements.locationInput) {
        elements.locationInput.addEventListener('input', debounce(handleLocationInput, CONFIG.debounceDelay));
        elements.locationInput.addEventListener('focus', () => {
            if (elements.autocompleteDropdown && elements.autocompleteDropdown.children.length > 0) {
                elements.autocompleteDropdown.classList.add('show');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && elements.autocompleteDropdown) {
            elements.autocompleteDropdown.classList.remove('show');
        }
    });

    // Geolocation button
    if (elements.locateBtn) {
        elements.locateBtn.addEventListener('click', getUserLocation);
    }

    // Save location button
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    if (saveLocationBtn) {
        saveLocationBtn.addEventListener('click', saveCurrentLocation);
    }

    // Chat
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');

    if (openChatBtn) openChatBtn.addEventListener('click', openChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', closeChat);
    if (elements.sendChatBtn) elements.sendChatBtn.addEventListener('click', sendChatMessage);
    if (elements.chatInput) {
        elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    // Clear chat button
    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }

    // Settings
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const aiProviderSelect = document.getElementById('aiProvider');

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
    if (aiProviderSelect) aiProviderSelect.addEventListener('change', handleProviderChange);

    // Radar layer change
    const radarLayerSelect = document.getElementById('radarLayer');
    if (radarLayerSelect) {
        radarLayerSelect.addEventListener('change', updateRadarLayer);
    }

    // Advanced NEXRAD controls - event listeners for selects only (buttons use onclick)
    const nexradSiteSelect = document.getElementById('nexradSite');
    const nexradProductSelect = document.getElementById('nexradProduct');
    const nexradTiltSelect = document.getElementById('nexradTilt');

    if (nexradSiteSelect) {
        nexradSiteSelect.addEventListener('change', updateNexradRadar);
    }

    if (nexradProductSelect) {
        nexradProductSelect.addEventListener('change', updateNexradRadar);
    }

    if (nexradTiltSelect) {
        nexradTiltSelect.addEventListener('change', updateNexradRadar);
    }

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareWeather);
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshWeather);
    }
}

function setupNavigation() {
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);

            document.querySelectorAll('.nav-btn[data-view]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchView(view) {
    const satelliteView = document.getElementById('satelliteView');
    const socialView = document.getElementById('socialView');

    if (elements.dashboardView) elements.dashboardView.classList.toggle('hidden', view !== 'dashboard');
    if (elements.radarView) elements.radarView.classList.toggle('hidden', view !== 'radar');
    if (elements.nexradView) elements.nexradView.classList.toggle('hidden', view !== 'nexrad');
    if (satelliteView) satelliteView.classList.toggle('hidden', view !== 'satellite');
    if (socialView) socialView.classList.toggle('hidden', view !== 'social');

    if (view === 'radar') {
        setTimeout(() => {
            if (state.radarMap) state.radarMap.invalidateSize();
            if (state.lightningMap) state.lightningMap.invalidateSize();
            initRadarAnimation();
            initBlitzortungLightning();
        }, 100);
    }

    if (view === 'nexrad') {
        // Wait for the view to be visible before initializing
        setTimeout(() => {
            if (!state.nexradMap) {
                initNexradRadar();
            }
            if (state.nexradMap) {
                state.nexradMap.invalidateSize();
            }
        }, 150);
    }

    if (view === 'satellite') {
        setTimeout(() => {
            if (!satelliteState.map) {
                initSatelliteView();
            }
            if (satelliteState.map) {
                satelliteState.map.invalidateSize();
            }
        }, 150);
    }

    if (view === 'social') {
        setTimeout(() => {
            if (!socialState.map) {
                initSocialView();
            }
            if (socialState.map) {
                socialState.map.invalidateSize();
            }
        }, 150);
    }
}

// ============ Saved Locations ============
function saveCurrentLocation() {
    if (!state.currentLocation) {
        showNotification('No location to save', 'error');
        return;
    }

    const exists = state.savedLocations.some(
        loc => loc.lat === state.currentLocation.lat && loc.lon === state.currentLocation.lon
    );

    if (exists) {
        showNotification('Location already saved', 'info');
        return;
    }

    state.savedLocations.push({ ...state.currentLocation });
    localStorage.setItem('savedLocations', JSON.stringify(state.savedLocations));
    renderSavedLocations();
    showNotification('Location saved!', 'success');
}

function removeSavedLocation(index) {
    state.savedLocations.splice(index, 1);
    localStorage.setItem('savedLocations', JSON.stringify(state.savedLocations));
    renderSavedLocations();
}

function renderSavedLocations() {
    const container = elements.savedLocationsContainer;
    if (!container) return;

    if (state.savedLocations.length === 0) {
        container.innerHTML = '<div class="no-saved">No saved locations</div>';
        return;
    }

    container.innerHTML = state.savedLocations.map((loc, index) => `
        <div class="saved-location-item" data-index="${index}">
            <div class="saved-location-info" data-lat="${loc.lat}" data-lon="${loc.lon}" data-name="${loc.name}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>${loc.name}</span>
            </div>
            <button class="remove-saved-btn" data-index="${index}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.saved-location-info').forEach(item => {
        item.addEventListener('click', () => {
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const name = item.dataset.name;
            loadWeatherData(lat, lon, name);
        });
    });

    container.querySelectorAll('.remove-saved-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeSavedLocation(parseInt(btn.dataset.index));
        });
    });
}

// ============ Location Search & Autocomplete ============
async function handleLocationInput(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        if (elements.autocompleteDropdown) {
            elements.autocompleteDropdown.classList.remove('show');
            elements.autocompleteDropdown.innerHTML = '';
        }
        return;
    }

    if (!state.weatherApiKey) {
        showNotification('Please add your weather API key in settings', 'error');
        return;
    }

    try {
        const response = await fetch(
            `${CONFIG.geoApiUrl}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${state.weatherApiKey}`
        );
        const locations = await response.json();

        if (!elements.autocompleteDropdown) return;

        if (locations.length === 0) {
            elements.autocompleteDropdown.innerHTML = `
                <div class="autocomplete-item">
                    <span class="location-info">
                        <span class="location-name">No locations found</span>
                    </span>
                </div>
            `;
        } else {
            elements.autocompleteDropdown.innerHTML = locations.map(loc => `
                <div class="autocomplete-item" data-lat="${loc.lat}" data-lon="${loc.lon}" data-name="${loc.name}${loc.state ? ', ' + loc.state : ''}, ${loc.country}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span class="location-info">
                        <span class="location-name">${loc.name}</span>
                        <span class="location-region">${loc.state ? loc.state + ', ' : ''}${loc.country}</span>
                    </span>
                </div>
            `).join('');

            elements.autocompleteDropdown.querySelectorAll('.autocomplete-item[data-lat]').forEach(item => {
                item.addEventListener('click', () => {
                    const lat = parseFloat(item.dataset.lat);
                    const lon = parseFloat(item.dataset.lon);
                    const name = item.dataset.name;

                    state.currentLocation = { lat, lon, name };
                    localStorage.setItem('currentLocation', JSON.stringify(state.currentLocation));

                    elements.locationInput.value = name;
                    elements.autocompleteDropdown.classList.remove('show');

                    loadWeatherData(lat, lon, name);
                });
            });
        }

        elements.autocompleteDropdown.classList.add('show');
    } catch (error) {
        console.error('Error fetching locations:', error);
        showNotification('Error searching locations', 'error');
    }
}

function getUserLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }

    if (!state.weatherApiKey) {
        showNotification('Please add your weather API key in settings first', 'error');
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude: lat, longitude: lon } = position.coords;

            try {
                const response = await fetch(
                    `${CONFIG.geoApiUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${state.weatherApiKey}`
                );
                const data = await response.json();
                const name = data[0] ? `${data[0].name}, ${data[0].country}` : 'Current Location';

                state.currentLocation = { lat, lon, name };
                localStorage.setItem('currentLocation', JSON.stringify(state.currentLocation));
                if (elements.locationInput) elements.locationInput.value = name;

                await loadWeatherData(lat, lon, name);
            } catch (error) {
                console.error('Error reverse geocoding:', error);
                await loadWeatherData(lat, lon, 'Current Location');
            }
        },
        (error) => {
            hideLoading();
            showNotification('Unable to get your location. Please search manually.', 'error');
            console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
}

function refreshWeather() {
    if (state.currentLocation) {
        loadWeatherData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
        showNotification('Weather refreshed!', 'success');
    }
}

// ============ Weather Data ============
async function loadWeatherData(lat, lon, name) {
    if (!state.weatherApiKey) {
        hideLoading();
        showNotification('Please add your weather API key in settings', 'error');
        return;
    }

    showLoading();
    state.currentLocation = { lat, lon, name };
    localStorage.setItem('currentLocation', JSON.stringify(state.currentLocation));

    try {
        // Fetch all data in parallel
        const [currentRes, forecastRes, airQualityRes] = await Promise.all([
            fetch(`${CONFIG.weatherApiUrl}/weather?lat=${lat}&lon=${lon}&units=${state.tempUnit}&appid=${state.weatherApiKey}`),
            fetch(`${CONFIG.weatherApiUrl}/forecast?lat=${lat}&lon=${lon}&units=${state.tempUnit}&appid=${state.weatherApiKey}`),
            fetch(`${CONFIG.airQualityUrl}?lat=${lat}&lon=${lon}&appid=${state.weatherApiKey}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error('Failed to fetch weather data');
        }

        state.currentWeather = await currentRes.json();
        state.forecast = await forecastRes.json();

        if (airQualityRes.ok) {
            state.airQuality = await airQualityRes.json();
        }

        renderCurrentWeather(name);
        renderHourlyForecast();
        renderDailyForecast();
        renderAirQuality();
        updateWeatherBackground();
        updateRadarCenter(lat, lon);
        fetchAlerts(lat, lon);
        // New features
        updateWindCompass();
        updateStormTracker();
        renderPrecipTimeline();
        renderOutfitRecommendations();
        simulateLightning();

    } catch (error) {
        console.error('Error loading weather data:', error);
        showNotification('Error loading weather data. Check your API key.', 'error');
    } finally {
        hideLoading();
    }
}

function renderCurrentWeather(locationName) {
    const weather = state.currentWeather;
    if (!weather) return;

    const iconCode = weather.weather[0].icon;
    const iconEmoji = getWeatherIcon(iconCode);
    const moonPhase = getMoonPhase();

    // Update weather icon
    const iconSphere = document.querySelector('.icon-sphere');
    if (iconSphere) iconSphere.textContent = iconEmoji;

    // Basic info
    if (elements.locationName) elements.locationName.textContent = locationName || weather.name;
    if (elements.temperature) elements.temperature.textContent = formatTemp(weather.main.temp);
    if (elements.weatherDesc) elements.weatherDesc.textContent = weather.weather[0].description;
    if (elements.feelsLike) elements.feelsLike.textContent = `Feels like ${formatTemp(weather.main.feels_like)}`;

    // Details
    if (elements.humidity) elements.humidity.textContent = `${weather.main.humidity}%`;
    if (elements.wind) {
        const windSpeed = state.tempUnit === 'metric'
            ? `${Math.round(weather.wind.speed * 3.6)} km/h`
            : `${Math.round(weather.wind.speed)} mph`;
        elements.wind.textContent = windSpeed;
    }
    if (elements.pressure) elements.pressure.textContent = `${weather.main.pressure} hPa`;
    if (elements.visibility) elements.visibility.textContent = `${(weather.visibility / 1000).toFixed(1)} km`;

    // Calculate dew point
    if (elements.dewPoint) {
        const temp = weather.main.temp;
        const humidity = weather.main.humidity;
        const dewPoint = temp - ((100 - humidity) / 5);
        elements.dewPoint.textContent = formatTemp(dewPoint);
    }

    // Sun times
    if (elements.sunrise) elements.sunrise.textContent = formatTimeFromUnix(weather.sys.sunrise);
    if (elements.sunset) elements.sunset.textContent = formatTimeFromUnix(weather.sys.sunset);

    // Moon phase
    if (elements.moonPhase) {
        elements.moonPhase.innerHTML = `${moonPhase.icon} <span>${moonPhase.name}</span>`;
    }

    // UV Index (estimate based on time and conditions)
    if (elements.uvIndex) {
        const now = Date.now() / 1000;
        const isDay = now > weather.sys.sunrise && now < weather.sys.sunset;
        const cloudFactor = weather.clouds.all / 100;
        let uvEstimate = isDay ? Math.round((1 - cloudFactor * 0.7) * 7) : 0;
        elements.uvIndex.textContent = uvEstimate;
    }
}

function renderAirQuality() {
    if (!state.airQuality || !elements.aqi) return;

    const aqi = state.airQuality.list[0].main.aqi;
    const level = CONFIG.aqiLevels[aqi - 1] || 'Unknown';
    const color = CONFIG.aqiColors[aqi - 1] || '#999';

    elements.aqi.innerHTML = `<span style="color: ${color}">${level}</span>`;
}

// ============ Wind Compass ============
function updateWindCompass() {
    const weather = state.currentWeather;
    if (!weather || !elements.windArrow) return;

    const windDeg = weather.wind.deg || 0;
    const windSpeed = weather.wind.speed || 0;
    const windGust = weather.wind.gust || windSpeed;

    // Convert to km/h for metric
    const speedKmh = state.tempUnit === 'metric'
        ? Math.round(windSpeed * 3.6)
        : Math.round(windSpeed);
    const gustKmh = state.tempUnit === 'metric'
        ? Math.round(windGust * 3.6)
        : Math.round(windGust);
    const unit = state.tempUnit === 'metric' ? 'km/h' : 'mph';

    // Rotate arrow (wind direction points TO where wind is going, add 180 to show FROM direction)
    elements.windArrow.style.transform = `translate(-50%, -100%) rotate(${windDeg}deg)`;

    if (elements.windSpeedCompass) {
        elements.windSpeedCompass.textContent = speedKmh;
    }

    if (elements.windGusts) {
        elements.windGusts.textContent = gustKmh > speedKmh
            ? `Gusts: ${gustKmh} ${unit}`
            : `Steady wind`;
    }
}

// ============ Storm Tracker ============
function updateStormTracker() {
    const forecast = state.forecast;
    const weather = state.currentWeather;
    if (!forecast || !weather || !elements.stormTrackerContent || !elements.stormTrackerCard) return;

    // Clear existing interval
    if (state.stormCountdownInterval) {
        clearInterval(state.stormCountdownInterval);
    }

    const storms = [];
    const now = Date.now() / 1000;

    // Check forecast for storms
    forecast.list.forEach((item, index) => {
        const condition = item.weather[0].main.toLowerCase();
        const windSpeed = item.wind.speed * 3.6; // km/h
        const rainChance = item.pop || 0;

        if (condition.includes('thunderstorm') ||
            condition.includes('storm') ||
            (rainChance > 0.7 && windSpeed > 40)) {

            const timeUntil = item.dt - now;
            if (timeUntil > 0 && timeUntil < 48 * 3600) { // Within 48 hours
                storms.push({
                    type: condition.includes('thunderstorm') ? 'Thunderstorm' : 'Severe Weather',
                    arrivalTime: item.dt,
                    timeUntil: timeUntil,
                    windSpeed: Math.round(windSpeed),
                    rainChance: Math.round(rainChance * 100),
                    temp: item.main.temp,
                    icon: item.weather[0].icon
                });
            }
        }
    });

    // Check current conditions for active storms
    const currentCondition = weather.weather[0].main.toLowerCase();
    if (currentCondition.includes('thunderstorm')) {
        storms.unshift({
            type: 'Thunderstorm Active',
            arrivalTime: now,
            timeUntil: 0,
            windSpeed: Math.round(weather.wind.speed * 3.6),
            rainChance: 100,
            temp: weather.main.temp,
            icon: weather.weather[0].icon,
            active: true
        });
    }

    if (storms.length === 0) {
        elements.stormTrackerCard.classList.remove('has-storm');
        elements.stormTrackerContent.innerHTML = `
            <div class="no-storms">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                <span>No severe weather detected in the next 48 hours</span>
            </div>
        `;
        return;
    }

    elements.stormTrackerCard.classList.add('has-storm');

    function renderStorms() {
        const currentTime = Date.now() / 1000;
        elements.stormTrackerContent.innerHTML = storms.slice(0, 3).map(storm => {
            const timeRemaining = storm.arrivalTime - currentTime;
            let countdownText = 'NOW';

            if (timeRemaining > 0) {
                const hours = Math.floor(timeRemaining / 3600);
                const minutes = Math.floor((timeRemaining % 3600) / 60);
                const seconds = Math.floor(timeRemaining % 60);

                if (hours > 0) {
                    countdownText = `${hours}h ${minutes}m`;
                } else if (minutes > 0) {
                    countdownText = `${minutes}m ${seconds}s`;
                } else {
                    countdownText = `${seconds}s`;
                }
            }

            return `
                <div class="storm-item">
                    <div class="storm-header">
                        <div class="storm-type">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                            </svg>
                            ${storm.type}
                        </div>
                        <div class="storm-countdown">${storm.active ? '⚡ ACTIVE' : countdownText}</div>
                    </div>
                    <div class="storm-details">
                        <div class="storm-detail">
                            <div class="storm-detail-value">${storm.windSpeed} km/h</div>
                            <div>Wind</div>
                        </div>
                        <div class="storm-detail">
                            <div class="storm-detail-value">${storm.rainChance}%</div>
                            <div>Rain Chance</div>
                        </div>
                        <div class="storm-detail">
                            <div class="storm-detail-value">${formatTemp(storm.temp)}</div>
                            <div>Temperature</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderStorms();
    state.stormCountdownInterval = setInterval(renderStorms, 1000);
}

// ============ Precipitation Timeline ============
function renderPrecipTimeline() {
    const forecast = state.forecast;
    if (!forecast || !elements.precipBars || !elements.precipTimes) return;

    const hourlyData = forecast.list.slice(0, 12);
    const maxChance = Math.max(...hourlyData.map(h => h.pop || 0), 0.1);

    elements.precipBars.innerHTML = hourlyData.map(item => {
        const chance = (item.pop || 0) * 100;
        const height = Math.max((chance / 100) * 80, 4);
        let intensity = 'none';

        if (chance >= 70) intensity = 'heavy';
        else if (chance >= 40) intensity = 'moderate';
        else if (chance > 0) intensity = 'light';

        return `
            <div class="precip-bar ${intensity}"
                 style="height: ${height}px"
                 data-chance="${Math.round(chance)}%"
                 title="${Math.round(chance)}% chance of precipitation">
            </div>
        `;
    }).join('');

    // Show times at intervals
    const times = hourlyData.filter((_, i) => i % 3 === 0).map(item => {
        const date = new Date(item.dt * 1000);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    });

    elements.precipTimes.innerHTML = times.map(t => `<span>${t}</span>`).join('');
}

// ============ Outfit Recommendations ============
function renderOutfitRecommendations() {
    const weather = state.currentWeather;
    if (!weather || !elements.outfitSummary || !elements.outfitItems) return;

    const temp = weather.main.temp;
    const feelsLike = weather.main.feels_like;
    const condition = weather.weather[0].main.toLowerCase();
    const windSpeed = weather.wind.speed * 3.6; // km/h
    const humidity = weather.main.humidity;
    const isRaining = condition.includes('rain') || condition.includes('drizzle');
    const isSnowing = condition.includes('snow');
    const isStormy = condition.includes('thunderstorm');

    let mainIcon = '👕';
    let summary = '';
    const items = [];

    // Temperature-based recommendations (Celsius)
    const tempC = state.tempUnit === 'metric' ? temp : (temp - 32) * 5/9;

    if (tempC < -10) {
        mainIcon = '🧥';
        summary = 'Bundle up! Extreme cold requires heavy winter gear.';
        items.push({ icon: '🧥', name: 'Heavy winter coat' });
        items.push({ icon: '🧣', name: 'Scarf' });
        items.push({ icon: '🧤', name: 'Insulated gloves' });
        items.push({ icon: '🎿', name: 'Thermal layers' });
        items.push({ icon: '👢', name: 'Insulated boots' });
        items.push({ icon: '🧢', name: 'Warm hat' });
    } else if (tempC < 0) {
        mainIcon = '🧥';
        summary = 'Very cold today. Layer up with warm winter clothing.';
        items.push({ icon: '🧥', name: 'Winter coat' });
        items.push({ icon: '🧣', name: 'Scarf' });
        items.push({ icon: '🧤', name: 'Gloves' });
        items.push({ icon: '👢', name: 'Winter boots' });
    } else if (tempC < 10) {
        mainIcon = '🧥';
        summary = 'Chilly weather. A warm jacket is recommended.';
        items.push({ icon: '🧥', name: 'Warm jacket' });
        items.push({ icon: '👖', name: 'Long pants' });
        items.push({ icon: '👟', name: 'Closed shoes' });
    } else if (tempC < 18) {
        mainIcon = '🧥';
        summary = 'Cool and comfortable. Light layers work well.';
        items.push({ icon: '🧥', name: 'Light jacket' });
        items.push({ icon: '👕', name: 'Long sleeve shirt' });
        items.push({ icon: '👖', name: 'Pants or jeans' });
    } else if (tempC < 25) {
        mainIcon = '👕';
        summary = 'Pleasant weather! Casual comfortable clothing is perfect.';
        items.push({ icon: '👕', name: 'T-shirt or light top' });
        items.push({ icon: '👖', name: 'Pants or shorts' });
        items.push({ icon: '👟', name: 'Comfortable shoes' });
    } else if (tempC < 32) {
        mainIcon = '👕';
        summary = 'Warm weather. Light, breathable fabrics recommended.';
        items.push({ icon: '👕', name: 'Light breathable shirt' });
        items.push({ icon: '🩳', name: 'Shorts' });
        items.push({ icon: '👡', name: 'Sandals or light shoes' });
        items.push({ icon: '🧢', name: 'Sun hat' });
    } else {
        mainIcon = '🩳';
        summary = 'Hot! Wear minimal, light-colored clothing. Stay hydrated!';
        items.push({ icon: '👕', name: 'Light tank top' });
        items.push({ icon: '🩳', name: 'Shorts' });
        items.push({ icon: '👡', name: 'Sandals' });
        items.push({ icon: '🧴', name: 'Sunscreen' });
        items.push({ icon: '🧢', name: 'Sun protection' });
    }

    // Weather condition additions
    if (isRaining || isStormy) {
        items.push({ icon: '☔', name: 'Umbrella' });
        items.push({ icon: '🧥', name: 'Waterproof jacket' });
    }

    if (isSnowing) {
        items.push({ icon: '👢', name: 'Waterproof boots' });
    }

    if (windSpeed > 30) {
        items.push({ icon: '🧥', name: 'Windbreaker' });
    }

    if (humidity > 80 && tempC > 20) {
        summary += ' High humidity - moisture-wicking fabrics recommended.';
    }

    elements.outfitIcon.textContent = mainIcon;
    elements.outfitSummary.textContent = summary;
    elements.outfitItems.innerHTML = items.slice(0, 6).map(item => `
        <div class="outfit-item">
            <span class="outfit-item-icon">${item.icon}</span>
            <span>${item.name}</span>
        </div>
    `).join('');
}

// ============ Lightning Map ============
function initLightningMap() {
    if (!elements.lightningMap || state.lightningMap) return;

    state.lightningMap = L.map('lightningMap', {
        center: [state.currentLocation?.lat || 40.7128, state.currentLocation?.lon || -74.0060],
        zoom: 8,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 18
    }).addTo(state.lightningMap);

    // Initial simulation based on weather
    simulateLightning();
}

function simulateLightning() {
    if (!state.lightningMap || !state.currentWeather) return;

    // Clear existing markers
    state.lightningMarkers.forEach(marker => state.lightningMap.removeLayer(marker));
    state.lightningMarkers = [];

    const weather = state.currentWeather;
    const condition = weather.weather[0].main.toLowerCase();
    const lat = state.currentLocation?.lat || 40.7128;
    const lon = state.currentLocation?.lon || -74.0060;

    let strikeCount = 0;

    // Generate lightning based on storm conditions
    if (condition.includes('thunderstorm')) {
        // Active thunderstorm - many recent strikes
        strikeCount = Math.floor(Math.random() * 20) + 10;

        for (let i = 0; i < strikeCount; i++) {
            const offsetLat = (Math.random() - 0.5) * 0.8;
            const offsetLon = (Math.random() - 0.5) * 0.8;
            const age = Math.random();

            let ageClass = 'recent';
            if (age > 0.6) ageClass = 'medium';
            if (age > 0.85) ageClass = 'old';

            const strikeIcon = L.divIcon({
                className: 'lightning-strike ' + ageClass,
                iconSize: [12, 12]
            });

            const marker = L.marker([lat + offsetLat, lon + offsetLon], { icon: strikeIcon })
                .addTo(state.lightningMap);

            state.lightningMarkers.push(marker);
        }
    } else if (condition.includes('rain') && Math.random() > 0.7) {
        // Some rain might have distant lightning
        strikeCount = Math.floor(Math.random() * 5);

        for (let i = 0; i < strikeCount; i++) {
            const offsetLat = (Math.random() - 0.5) * 1.5;
            const offsetLon = (Math.random() - 0.5) * 1.5;

            const strikeIcon = L.divIcon({
                className: 'lightning-strike old',
                iconSize: [12, 12]
            });

            const marker = L.marker([lat + offsetLat, lon + offsetLon], { icon: strikeIcon })
                .addTo(state.lightningMap);

            state.lightningMarkers.push(marker);
        }
    }

    if (elements.strikeCount) {
        elements.strikeCount.textContent = strikeCount;
    }

    // Center map on location
    state.lightningMap.setView([lat, lon], 8);
}

// ============ NEXRAD Radar ============
function initNexradRadar() {
    const mapContainer = document.getElementById('nexradMap');
    if (!mapContainer || state.nexradMap) return;

    // Create map centered on US
    state.nexradMap = L.map('nexradMap', {
        center: [39.8283, -98.5795],
        zoom: 4,
        zoomControl: true
    });

    // Add dark base layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 18
    }).addTo(state.nexradMap);

    // Initialize state for layers
    state.nexradProduct = 'N0Q';
    state.selectedSite = null;
    state.radarVisible = true;
    state.warningsVisible = false;
    state.countiesVisible = false;
    state.warningsLayer = null;
    state.countiesLayer = null;
    state.siteMarkers = [];

    // Add radar site markers
    addRadarSiteMarkers();

    // Setup overlay button listeners
    setupNexradControls();

    // Update time display
    updateNexradTime();
}

function addRadarSiteMarkers() {
    if (!state.nexradMap) return;

    // Clear existing markers
    state.siteMarkers.forEach(marker => state.nexradMap.removeLayer(marker));
    state.siteMarkers = [];

    // Create custom radar icon
    const radarIcon = L.divIcon({
        className: 'radar-site-marker',
        html: `<div class="radar-marker-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="8"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    const selectedIcon = L.divIcon({
        className: 'radar-site-marker selected',
        html: `<div class="radar-marker-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="8"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add marker for each site
    Object.entries(CONFIG.nexradSites).forEach(([siteId, siteInfo]) => {
        const marker = L.marker([siteInfo.lat, siteInfo.lon], { icon: radarIcon })
            .addTo(state.nexradMap);

        // Add tooltip with site info
        marker.bindTooltip(`<strong>${siteId}</strong><br>${siteInfo.name}`, {
            direction: 'top',
            offset: [0, -10]
        });

        // Click handler to load this site's radar
        marker.on('click', () => {
            // Update selected state
            state.selectedSite = siteId;

            // Update all markers
            state.siteMarkers.forEach(m => {
                const id = m.siteId;
                if (id === siteId) {
                    m.setIcon(selectedIcon);
                } else {
                    m.setIcon(radarIcon);
                }
            });

            // Load radar for this site
            loadSiteRadar(siteId, siteInfo);
        });

        marker.siteId = siteId;
        state.siteMarkers.push(marker);
    });
}

function loadSiteRadar(siteId, siteInfo) {
    if (!state.nexradMap || !state.radarVisible) return;

    // Remove existing radar layer
    if (state.nexradLayer) {
        state.nexradMap.removeLayer(state.nexradLayer);
    }

    // Use national composite WMS (reliable) and zoom to site
    let wmsUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi';
    let layerName = 'nexrad-n0q-900913';

    if (state.nexradProduct === 'N0U') {
        wmsUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0u.cgi';
        layerName = 'nexrad-n0u-900913';
    } else if (state.nexradProduct === 'N0C') {
        wmsUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0c.cgi';
        layerName = 'nexrad-n0c-900913';
    }

    state.nexradLayer = L.tileLayer.wms(wmsUrl, {
        layers: layerName,
        format: 'image/png',
        transparent: true,
        opacity: 0.7
    }).addTo(state.nexradMap);

    // Zoom to the selected site location
    state.nexradMap.setView([siteInfo.lat, siteInfo.lon], 8);

    // Update info bar
    const productEl = document.getElementById('nexradProductName');
    if (productEl) {
        const productNames = { 'N0Q': 'Reflectivity', 'N0U': 'Velocity', 'N0C': 'Correlation' };
        productEl.textContent = `${siteId} - ${productNames[state.nexradProduct] || 'Reflectivity'}`;
    }

    updateNexradTime();
}

function setupNexradControls() {
    // Product buttons
    document.querySelectorAll('.nexrad-btn[data-product]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nexrad-btn[data-product]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.nexradProduct = btn.dataset.product;

            // Reload selected site with new product
            if (state.selectedSite) {
                const siteInfo = CONFIG.nexradSites[state.selectedSite];
                if (siteInfo) {
                    loadSiteRadar(state.selectedSite, siteInfo);
                }
            }

            updateNexradLegend();
        });
    });

    // Radar toggle
    const toggleRadar = document.getElementById('toggleRadar');
    if (toggleRadar) {
        toggleRadar.addEventListener('click', () => {
            state.radarVisible = !state.radarVisible;
            toggleRadar.classList.toggle('active', state.radarVisible);
            if (state.radarVisible && state.selectedSite) {
                const siteInfo = CONFIG.nexradSites[state.selectedSite];
                if (siteInfo) loadSiteRadar(state.selectedSite, siteInfo);
            } else if (state.nexradLayer) {
                state.nexradMap.removeLayer(state.nexradLayer);
                state.nexradLayer = null;
            }
        });
    }

    // Warnings toggle
    const toggleWarnings = document.getElementById('toggleWarnings');
    if (toggleWarnings) {
        toggleWarnings.addEventListener('click', () => {
            state.warningsVisible = !state.warningsVisible;
            toggleWarnings.classList.toggle('active', state.warningsVisible);
            if (state.warningsVisible) {
                loadWarningsLayer();
            } else if (state.warningsLayer) {
                state.nexradMap.removeLayer(state.warningsLayer);
                state.warningsLayer = null;
            }
        });
    }

    // Counties toggle
    const toggleCounties = document.getElementById('toggleCounties');
    if (toggleCounties) {
        toggleCounties.addEventListener('click', () => {
            state.countiesVisible = !state.countiesVisible;
            toggleCounties.classList.toggle('active', state.countiesVisible);
            if (state.countiesVisible) {
                loadCountiesLayer();
            } else if (state.countiesLayer) {
                state.nexradMap.removeLayer(state.countiesLayer);
                state.countiesLayer = null;
            }
        });
    }
}

function loadWarningsLayer() {
    if (!state.nexradMap) return;

    // Remove existing warnings layer
    if (state.warningsLayer) {
        state.nexradMap.removeLayer(state.warningsLayer);
    }

    // Add NWS warnings WMS layer from IEM
    state.warningsLayer = L.tileLayer.wms('https://mesonet.agron.iastate.edu/cgi-bin/wms/us/wwa.cgi', {
        layers: 'warnings_c',
        format: 'image/png',
        transparent: true,
        opacity: 0.8
    }).addTo(state.nexradMap);
}

function loadCountiesLayer() {
    if (!state.nexradMap) return;

    // Remove existing counties layer
    if (state.countiesLayer) {
        state.nexradMap.removeLayer(state.countiesLayer);
    }

    // Add county borders WMS layer
    state.countiesLayer = L.tileLayer.wms('https://mesonet.agron.iastate.edu/cgi-bin/wms/us/counties.cgi', {
        layers: 'uscounties',
        format: 'image/png',
        transparent: true,
        opacity: 0.5
    }).addTo(state.nexradMap);
}

function updateNexradLegend() {
    const legendBar = document.getElementById('legendBar');
    const legendLabels = document.querySelector('.legend-labels-vertical');
    const legendUnit = document.querySelector('.legend-unit');

    if (!legendBar) return;

    if (state.nexradProduct === 'N0U') {
        // Velocity legend
        legendBar.style.background = 'linear-gradient(to bottom, #00ff00, #008800, #000000, #880000, #ff0000)';
        if (legendLabels) legendLabels.innerHTML = '<span>+64</span><span>+32</span><span>0</span><span>-32</span><span>-64</span>';
        if (legendUnit) legendUnit.textContent = 'kts';
    } else if (state.nexradProduct === 'N0C') {
        // Correlation coefficient legend
        legendBar.style.background = 'linear-gradient(to bottom, #ffffff, #00ff00, #ffff00, #ff0000, #000000)';
        if (legendLabels) legendLabels.innerHTML = '<span>1.00</span><span>0.95</span><span>0.85</span><span>0.70</span><span>0.20</span>';
        if (legendUnit) legendUnit.textContent = 'CC';
    } else {
        // Reflectivity legend
        legendBar.style.background = 'linear-gradient(to bottom, #ff00ff, #ff0000, #ff6600, #ffff00, #00ff00, #00ffff, #0066ff, #000066)';
        if (legendLabels) legendLabels.innerHTML = '<span>75+</span><span>60</span><span>40</span><span>20</span><span>0</span><span>-30</span>';
        if (legendUnit) legendUnit.textContent = 'dBZ';
    }
}

function updateNexradTime() {
    const timeEl = document.getElementById('nexradTime');
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString();
    }
}

function renderHourlyForecast() {
    const forecast = state.forecast;
    if (!forecast || !elements.hourlyForecast) return;

    const hourlyData = forecast.list.slice(0, 8);

    elements.hourlyForecast.innerHTML = hourlyData.map(item => {
        const rainChance = item.pop ? Math.round(item.pop * 100) : 0;
        return `
            <div class="hourly-item">
                <div class="time">${formatTime(item.dt, forecast.city.timezone)}</div>
                <div class="icon">${getWeatherIcon(item.weather[0].icon)}</div>
                <div class="temp">${formatTemp(item.main.temp)}</div>
                ${rainChance > 0 ? `<div class="rain-chance">💧 ${rainChance}%</div>` : ''}
            </div>
        `;
    }).join('');
}

function renderDailyForecast() {
    const forecast = state.forecast;
    if (!forecast || !elements.dailyForecast) return;

    const dailyMap = new Map();
    forecast.list.forEach(item => {
        const day = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(day)) {
            dailyMap.set(day, {
                dt: item.dt,
                temps: [],
                icons: [],
                descriptions: [],
                rain: []
            });
        }
        const dayData = dailyMap.get(day);
        dayData.temps.push(item.main.temp);
        dayData.icons.push(item.weather[0].icon);
        dayData.descriptions.push(item.weather[0].description);
        dayData.rain.push(item.pop || 0);
    });

    const dailyData = Array.from(dailyMap.values()).slice(0, 7).map(day => {
        // Get most common icon (midday preference)
        const middayIconIndex = Math.floor(day.icons.length / 2);
        return {
            dt: day.dt,
            tempMax: Math.max(...day.temps),
            tempMin: Math.min(...day.temps),
            icon: day.icons[middayIconIndex] || day.icons[0],
            description: day.descriptions[middayIconIndex] || day.descriptions[0],
            rainChance: Math.round(Math.max(...day.rain) * 100)
        };
    });

    elements.dailyForecast.innerHTML = dailyData.map(day => `
        <div class="daily-item">
            <div class="day-info">
                <div class="day">${formatDay(day.dt)}</div>
                <div class="condition">${day.description}</div>
            </div>
            <div class="icon">${getWeatherIcon(day.icon)}</div>
            ${day.rainChance > 0 ? `<div class="rain-chance">💧 ${day.rainChance}%</div>` : '<div class="rain-chance"></div>'}
            <div class="temps">
                <span class="temp-high">${formatTemp(day.tempMax)}</span>
                <span class="temp-low">${formatTemp(day.tempMin)}</span>
            </div>
        </div>
    `).join('');
}

function updateWeatherBackground() {
    if (!state.currentWeather || !elements.weatherBackground) return;

    const weatherMain = state.currentWeather.weather[0].main;
    const bgClass = getWeatherBackground(weatherMain);

    elements.weatherBackground.className = 'weather-background ' + bgClass;
}

async function fetchAlerts(lat, lon) {
    const weather = state.currentWeather;
    if (!weather || !elements.alertsContainer) return;

    const alerts = [];
    const temp = weather.main.temp;
    const windSpeed = weather.wind.speed;
    const weatherMain = weather.weather[0].main.toLowerCase();
    const visibility = weather.visibility;

    // Temperature alerts
    if (state.tempUnit === 'metric') {
        if (temp > 35) {
            alerts.push({ type: 'severe', title: 'Extreme Heat Warning', desc: `Temperature of ${formatTemp(temp)}. Stay hydrated, avoid outdoor activities, and seek air conditioning.` });
        } else if (temp > 30) {
            alerts.push({ type: 'warning', title: 'Heat Advisory', desc: 'High temperatures expected. Drink plenty of water and limit sun exposure.' });
        } else if (temp < -15) {
            alerts.push({ type: 'severe', title: 'Extreme Cold Warning', desc: `Temperature of ${formatTemp(temp)}. Risk of frostbite. Stay indoors if possible.` });
        } else if (temp < -5) {
            alerts.push({ type: 'warning', title: 'Cold Weather Advisory', desc: 'Dangerously cold temperatures. Dress warmly and limit outdoor exposure.' });
        }
    }

    // Wind alerts
    const windKmh = windSpeed * 3.6;
    if (windKmh > 90) {
        alerts.push({ type: 'severe', title: 'High Wind Warning', desc: `Dangerous winds of ${Math.round(windKmh)} km/h. Secure outdoor objects and avoid driving.` });
    } else if (windKmh > 50) {
        alerts.push({ type: 'warning', title: 'Wind Advisory', desc: `Strong winds of ${Math.round(windKmh)} km/h expected. Use caution outdoors.` });
    }

    // Weather condition alerts
    if (weatherMain.includes('thunderstorm')) {
        alerts.push({ type: 'severe', title: 'Thunderstorm Warning', desc: 'Severe thunderstorms in progress. Seek shelter immediately and stay away from windows.' });
    }

    if (weatherMain.includes('snow') || weatherMain.includes('blizzard')) {
        alerts.push({ type: 'warning', title: 'Winter Weather Advisory', desc: 'Snow conditions. Roads may be hazardous. Drive carefully or postpone travel.' });
    }

    if (weatherMain.includes('rain') && state.forecast) {
        const upcomingRain = state.forecast.list.slice(0, 4).filter(item =>
            item.weather[0].main.toLowerCase().includes('rain')
        ).length;
        if (upcomingRain >= 3) {
            alerts.push({ type: 'warning', title: 'Persistent Rain', desc: 'Extended rainfall expected. Possible flooding in low-lying areas.' });
        }
    }

    // Visibility alerts
    if (visibility < 1000) {
        alerts.push({ type: 'warning', title: 'Low Visibility', desc: `Visibility reduced to ${(visibility/1000).toFixed(1)} km. Drive with caution and use fog lights.` });
    }

    // Air quality alerts
    if (state.airQuality) {
        const aqi = state.airQuality.list[0].main.aqi;
        if (aqi >= 4) {
            alerts.push({ type: 'warning', title: 'Poor Air Quality', desc: 'Air quality is poor. Sensitive groups should limit outdoor activities.' });
        }
    }

    if (alerts.length === 0) {
        elements.alertsContainer.innerHTML = `
            <div class="no-alerts">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                <span>No active weather alerts - conditions are favorable</span>
            </div>
        `;
    } else {
        elements.alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-icon">
                    ${alert.type === 'severe' ?
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' :
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
                    }
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-desc">${alert.desc}</div>
                </div>
            </div>
        `).join('');
    }
}

// ============ Radar Animation ============
const radarAnimation = {
    frames: [],
    currentFrame: 11,
    isPlaying: false,
    interval: null,
    timestamps: []
};

function initRadarAnimation() {
    generateRadarTimestamps();
    setupRadarAnimationControls();
}

function generateRadarTimestamps() {
    radarAnimation.timestamps = [];
    const now = new Date();

    // Generate 12 timestamps (past 2 hours in 10-minute intervals)
    for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 10 * 60 * 1000);
        radarAnimation.timestamps.push(time);
    }

    // Update timestamp display
    const container = document.getElementById('radarAnimTimestamps');
    if (container) {
        container.innerHTML = ['2h ago', '1h ago', 'Now'].map(t => `<span>${t}</span>`).join('');
    }
}

function setupRadarAnimationControls() {
    const playBtn = document.getElementById('radarAnimPlay');
    const backwardBtn = document.getElementById('radarAnimBackward');
    const forwardBtn = document.getElementById('radarAnimForward');
    const slider = document.getElementById('radarAnimSlider');

    if (playBtn) {
        playBtn.addEventListener('click', toggleRadarAnimation);
    }

    if (backwardBtn) {
        backwardBtn.addEventListener('click', () => {
            stepRadarFrame(-1);
        });
    }

    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            stepRadarFrame(1);
        });
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            radarAnimation.currentFrame = parseInt(e.target.value);
            updateRadarFrame();
        });
    }
}

function toggleRadarAnimation() {
    const playBtn = document.getElementById('radarAnimPlay');

    if (radarAnimation.isPlaying) {
        // Stop animation
        clearInterval(radarAnimation.interval);
        radarAnimation.isPlaying = false;
        if (playBtn) {
            playBtn.querySelector('.play-icon').classList.remove('hidden');
            playBtn.querySelector('.pause-icon').classList.add('hidden');
        }
    } else {
        // Start animation
        radarAnimation.isPlaying = true;
        if (playBtn) {
            playBtn.querySelector('.play-icon').classList.add('hidden');
            playBtn.querySelector('.pause-icon').classList.remove('hidden');
        }
        radarAnimation.interval = setInterval(() => {
            radarAnimation.currentFrame = (radarAnimation.currentFrame + 1) % 12;
            updateRadarFrame();
        }, 500);
    }
}

function stepRadarFrame(direction) {
    if (radarAnimation.isPlaying) {
        toggleRadarAnimation();
    }
    radarAnimation.currentFrame = Math.max(0, Math.min(11, radarAnimation.currentFrame + direction));
    updateRadarFrame();
}

function updateRadarFrame() {
    const slider = document.getElementById('radarAnimSlider');
    const timeDisplay = document.getElementById('radarAnimTimeDisplay');

    if (slider) {
        slider.value = radarAnimation.currentFrame;
    }

    if (timeDisplay && radarAnimation.timestamps[radarAnimation.currentFrame]) {
        const time = radarAnimation.timestamps[radarAnimation.currentFrame];
        if (radarAnimation.currentFrame === 11) {
            timeDisplay.textContent = 'Now';
        } else {
            timeDisplay.textContent = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    // Update the radar layer with timestamp
    updateRadarLayerWithTime(radarAnimation.timestamps[radarAnimation.currentFrame]);
}

function updateRadarLayerWithTime(timestamp) {
    if (!state.radarMap) return;

    // RainViewer API for animated radar
    const ts = Math.floor(timestamp.getTime() / 1000);

    // Remove existing animated layer if any
    if (state.animatedRadarLayer) {
        state.radarMap.removeLayer(state.animatedRadarLayer);
    }

    // Add new layer with timestamp - using OpenWeatherMap precipitation layer
    const apiKey = state.weatherApiKey || 'demo';
    state.animatedRadarLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
        { opacity: 0.6 }
    ).addTo(state.radarMap);
}

// ============ Satellite View ============
const satelliteState = {
    map: null,
    layer: null,
    band: 'geocolor',
    satellite: 'goes-east',
    frames: [],
    currentFrame: 23,
    isPlaying: false,
    interval: null
};

function initSatelliteView() {
    const container = document.getElementById('satelliteMap');
    if (!container || satelliteState.map) return;

    satelliteState.map = L.map('satelliteMap', {
        center: [39.8283, -98.5795],
        zoom: 4,
        zoomControl: true
    });

    // Dark base layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 18
    }).addTo(satelliteState.map);

    loadSatelliteLayer();
    setupSatelliteControls();
}

function loadSatelliteLayer() {
    if (!satelliteState.map) return;

    // Remove existing layer
    if (satelliteState.layer) {
        satelliteState.map.removeLayer(satelliteState.layer);
    }

    // Use NOAA SLIDER imagery via image overlay
    // SLIDER provides latest GOES imagery
    const goesNum = satelliteState.satellite === 'goes-east' ? '16' : '18';

    const bandPaths = {
        'geocolor': 'GEOCOLOR',
        'visible': '02',
        'infrared': '13',
        'watervapor': '08'
    };

    const bandPath = bandPaths[satelliteState.band];

    // NOAA SLIDER image URL
    const imageUrl = `https://cdn.star.nesdis.noaa.gov/GOES${goesNum}/ABI/CONUS/${bandPath}/latest.jpg`;

    // CONUS approximate bounds
    const bounds = [[24.0, -126.0], [50.0, -66.0]];

    satelliteState.layer = L.imageOverlay(imageUrl, bounds, {
        opacity: 0.85,
        crossOrigin: true
    }).addTo(satelliteState.map);

    // Fit map to CONUS
    satelliteState.map.fitBounds(bounds);

    updateSatelliteInfo();
}

function setupSatelliteControls() {
    // Band buttons
    document.querySelectorAll('.satellite-btn[data-band]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.satellite-btn[data-band]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            satelliteState.band = btn.dataset.band;
            loadSatelliteLayer();
        });
    });

    // Satellite selection
    document.querySelectorAll('.satellite-region[data-satellite]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.satellite-region').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            satelliteState.satellite = btn.dataset.satellite;
            loadSatelliteLayer();
        });
    });

    // Animation controls
    const playBtn = document.getElementById('satAnimPlay');
    const backBtn = document.getElementById('satAnimBackward');
    const fwdBtn = document.getElementById('satAnimForward');
    const slider = document.getElementById('satAnimSlider');

    if (playBtn) {
        playBtn.addEventListener('click', toggleSatelliteAnimation);
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => stepSatelliteFrame(-1));
    }

    if (fwdBtn) {
        fwdBtn.addEventListener('click', () => stepSatelliteFrame(1));
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            satelliteState.currentFrame = parseInt(e.target.value);
            updateSatelliteFrame();
        });
    }
}

function toggleSatelliteAnimation() {
    const playBtn = document.getElementById('satAnimPlay');

    if (satelliteState.isPlaying) {
        clearInterval(satelliteState.interval);
        satelliteState.isPlaying = false;
        if (playBtn) {
            playBtn.querySelector('.play-icon').classList.remove('hidden');
            playBtn.querySelector('.pause-icon').classList.add('hidden');
        }
    } else {
        satelliteState.isPlaying = true;
        if (playBtn) {
            playBtn.querySelector('.play-icon').classList.add('hidden');
            playBtn.querySelector('.pause-icon').classList.remove('hidden');
        }
        satelliteState.interval = setInterval(() => {
            satelliteState.currentFrame = (satelliteState.currentFrame + 1) % 24;
            updateSatelliteFrame();
        }, 300);
    }
}

function stepSatelliteFrame(dir) {
    if (satelliteState.isPlaying) toggleSatelliteAnimation();
    satelliteState.currentFrame = Math.max(0, Math.min(23, satelliteState.currentFrame + dir));
    updateSatelliteFrame();
}

function updateSatelliteFrame() {
    const slider = document.getElementById('satAnimSlider');
    const display = document.getElementById('satAnimTimeDisplay');

    if (slider) slider.value = satelliteState.currentFrame;

    if (display) {
        if (satelliteState.currentFrame === 23) {
            display.textContent = 'Latest';
        } else {
            const hoursAgo = 23 - satelliteState.currentFrame;
            display.textContent = `-${hoursAgo}h`;
        }
    }

    // Reload satellite layer (in production, would use timestamped imagery)
    loadSatelliteLayer();
}

function updateSatelliteInfo() {
    const bandName = document.getElementById('satelliteBandName');
    const timeEl = document.getElementById('satelliteTime');

    const bandNames = {
        'geocolor': 'GeoColor',
        'visible': 'Visible',
        'infrared': 'Infrared',
        'watervapor': 'Water Vapor'
    };

    const satNames = {
        'goes-east': 'GOES-East',
        'goes-west': 'GOES-West'
    };

    if (bandName) {
        bandName.textContent = `${satNames[satelliteState.satellite]} ${bandNames[satelliteState.band]}`;
    }

    if (timeEl) {
        timeEl.textContent = new Date().toLocaleTimeString();
    }
}

// ============ Real-Time Lightning (Blitzortung) ============
const blitzortung = {
    ws: null,
    strikes: [],
    maxStrikes: 500,
    connected: false
};

function initBlitzortungLightning() {
    if (!elements.lightningMap || !state.lightningMap) return;

    connectBlitzortung();
}

function connectBlitzortung() {
    // Blitzortung WebSocket for real-time lightning data
    // Note: Blitzortung limits connections - this is for educational/demo purposes
    try {
        // Using simulated data since Blitzortung requires registration
        // In production, you would use: wss://ws.blitzortung.org:3000/
        simulateBlitzortungStrikes();
    } catch (e) {
        console.log('Blitzortung connection failed, using simulation');
        simulateBlitzortungStrikes();
    }
}

function simulateBlitzortungStrikes() {
    if (!state.lightningMap || !state.currentWeather) return;

    // Clear existing markers
    state.lightningMarkers.forEach(m => state.lightningMap.removeLayer(m));
    state.lightningMarkers = [];

    const lat = state.currentWeather.coord.lat;
    const lon = state.currentWeather.coord.lon;
    const weatherId = state.currentWeather.weather[0].id;

    // Only show strikes during stormy weather
    if (weatherId >= 200 && weatherId < 300) {
        // Thunderstorm - lots of lightning
        const numStrikes = 20 + Math.floor(Math.random() * 30);

        for (let i = 0; i < numStrikes; i++) {
            const strikeLat = lat + (Math.random() - 0.5) * 1.5;
            const strikeLon = lon + (Math.random() - 0.5) * 1.5;
            const age = Math.random(); // 0 = newest, 1 = oldest

            let ageClass = 'recent';
            if (age > 0.3) ageClass = 'medium';
            if (age > 0.6) ageClass = 'old';

            const marker = L.marker([strikeLat, strikeLon], {
                icon: L.divIcon({
                    className: `lightning-strike blitz-strike ${ageClass}`,
                    html: `<div class="strike-icon"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                })
            }).addTo(state.lightningMap);

            state.lightningMarkers.push(marker);
        }

        document.getElementById('strikeCount').textContent = numStrikes;
    } else if (weatherId >= 300 && weatherId < 600) {
        // Light rain/drizzle - occasional distant lightning
        const numStrikes = Math.floor(Math.random() * 5);

        for (let i = 0; i < numStrikes; i++) {
            const strikeLat = lat + (Math.random() - 0.5) * 2;
            const strikeLon = lon + (Math.random() - 0.5) * 2;

            const marker = L.marker([strikeLat, strikeLon], {
                icon: L.divIcon({
                    className: 'lightning-strike old',
                    html: `<div class="strike-icon"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                })
            }).addTo(state.lightningMap);

            state.lightningMarkers.push(marker);
        }

        document.getElementById('strikeCount').textContent = numStrikes;
    } else {
        document.getElementById('strikeCount').textContent = '0';
    }

    state.lightningMap.setView([lat, lon], 8);

    // Simulate new strikes every 5 seconds during storms
    if (weatherId >= 200 && weatherId < 300) {
        setTimeout(() => simulateBlitzortungStrikes(), 5000);
    }
}

// ============ Social Media Weather Reports ============
const socialState = {
    map: null,
    markers: [],
    reports: [],
    filter: 'all'
};

function initSocialView() {
    const container = document.getElementById('socialMap');
    if (!container || socialState.map) return;

    socialState.map = L.map('socialMap', {
        center: [39.8283, -98.5795],
        zoom: 4,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18
    }).addTo(socialState.map);

    setupSocialControls();
    loadWeatherReports();
}

function setupSocialControls() {
    // Filter buttons
    document.querySelectorAll('.social-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.social-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            socialState.filter = btn.dataset.filter;
            filterSocialMarkers();
            renderSocialFeed();
        });
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshSocialFeed');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadWeatherReports);
    }
}

async function loadWeatherReports() {
    const feedContent = document.getElementById('socialFeedContent');
    if (feedContent) {
        feedContent.innerHTML = `
            <div class="social-loading">
                <div class="social-spinner"></div>
                <span>Loading weather reports...</span>
            </div>
        `;
    }

    // Fetch real storm reports from SPC (Storm Prediction Center)
    await fetchSPCReports();

    renderSocialFeed();
    renderSocialMarkers();
}

async function fetchSPCReports() {
    try {
        // Use SPC's storm reports (public data)
        // For demo, we'll generate sample data based on current conditions
        // In production, fetch from: https://www.spc.noaa.gov/climo/reports/today.csv

        socialState.reports = generateSampleReports();
    } catch (e) {
        console.error('Failed to fetch SPC reports:', e);
        socialState.reports = generateSampleReports();
    }
}

function generateSampleReports() {
    const reports = [];
    const types = ['tornado', 'hail', 'wind', 'flood', 'snow', 'general'];
    const locations = [
        { name: 'Oklahoma City, OK', lat: 35.4676, lon: -97.5164 },
        { name: 'Dallas, TX', lat: 32.7767, lon: -96.7970 },
        { name: 'Kansas City, MO', lat: 39.0997, lon: -94.5786 },
        { name: 'St. Louis, MO', lat: 38.6270, lon: -90.1994 },
        { name: 'Denver, CO', lat: 39.7392, lon: -104.9903 },
        { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
        { name: 'Minneapolis, MN', lat: 44.9778, lon: -93.2650 },
        { name: 'Omaha, NE', lat: 41.2565, lon: -95.9345 },
        { name: 'Tulsa, OK', lat: 36.1540, lon: -95.9928 },
        { name: 'Wichita, KS', lat: 37.6872, lon: -97.3301 },
        { name: 'Little Rock, AR', lat: 34.7465, lon: -92.2896 },
        { name: 'Memphis, TN', lat: 35.1495, lon: -90.0490 }
    ];

    const messages = {
        tornado: [
            'Tornado spotted touching down near highway',
            'Funnel cloud observed moving northeast',
            'Large tornado reported with debris cloud',
            'Confirmed tornado causing damage in area'
        ],
        hail: [
            'Golf ball sized hail falling heavily',
            'Quarter-sized hail reported',
            'Large hail damaging vehicles',
            'Hail accumulating on ground'
        ],
        wind: [
            'Trees down from strong winds',
            'Power outages due to high winds',
            'Wind gusts exceeding 60 mph',
            'Roof damage from severe wind'
        ],
        flood: [
            'Street flooding making roads impassable',
            'Flash flooding in low-lying areas',
            'Water rescues underway',
            'Significant rainfall causing flooding'
        ],
        snow: [
            'Heavy snow reducing visibility',
            'Blizzard conditions developing',
            'Snow accumulating rapidly',
            'Whiteout conditions on highways'
        ],
        general: [
            'Storm moving through the area',
            'Severe weather approaching',
            'Take shelter immediately',
            'Weather conditions deteriorating'
        ]
    };

    const usernames = [
        'WeatherWatcher', 'StormChaser', 'SkySpy', 'TornadoTracker',
        'HailHunter', 'WindWatcher', 'FloodAlert', 'SnowSpotter',
        'SevereWX', 'MeteoMike', 'RadarRick', 'ChaseTeam'
    ];

    // Generate 15-25 random reports
    const numReports = 15 + Math.floor(Math.random() * 10);

    for (let i = 0; i < numReports; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const msg = messages[type][Math.floor(Math.random() * messages[type].length)];
        const username = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000);

        // Random time in last 24 hours
        const hoursAgo = Math.random() * 24;
        const time = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

        // Slight variation in location
        const lat = loc.lat + (Math.random() - 0.5) * 0.5;
        const lon = loc.lon + (Math.random() - 0.5) * 0.5;

        reports.push({
            id: i,
            type,
            username,
            message: msg,
            location: loc.name,
            lat,
            lon,
            time,
            timeAgo: formatTimeAgo(time)
        });
    }

    // Sort by time (newest first)
    reports.sort((a, b) => b.time - a.time);

    return reports;
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
}

function renderSocialMarkers() {
    // Clear existing markers
    socialState.markers.forEach(m => socialState.map.removeLayer(m));
    socialState.markers = [];

    const filteredReports = socialState.filter === 'all'
        ? socialState.reports
        : socialState.reports.filter(r => r.type === socialState.filter);

    const icons = {
        tornado: '🌪️',
        hail: '🧊',
        wind: '💨',
        flood: '🌊',
        snow: '❄️',
        general: '⚠️'
    };

    filteredReports.forEach(report => {
        const marker = L.marker([report.lat, report.lon], {
            icon: L.divIcon({
                className: `social-marker ${report.type}`,
                html: `<div class="social-marker-inner">${icons[report.type]}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(socialState.map);

        marker.bindPopup(`
            <div style="min-width: 200px;">
                <strong>${report.username}</strong>
                <p style="margin: 0.5rem 0;">${report.message}</p>
                <small>${report.location} • ${report.timeAgo}</small>
            </div>
        `);

        socialState.markers.push(marker);
    });

    // Update count
    document.getElementById('reportCount').textContent = filteredReports.length;
}

function filterSocialMarkers() {
    renderSocialMarkers();
}

function renderSocialFeed() {
    const feedContent = document.getElementById('socialFeedContent');
    if (!feedContent) return;

    const filteredReports = socialState.filter === 'all'
        ? socialState.reports
        : socialState.reports.filter(r => r.type === socialState.filter);

    if (filteredReports.length === 0) {
        feedContent.innerHTML = `
            <div class="social-loading">
                <span>No reports found</span>
            </div>
        `;
        return;
    }

    feedContent.innerHTML = filteredReports.map(report => `
        <div class="social-post" onclick="focusOnReport(${report.id})">
            <div class="social-post-header">
                <div class="social-post-user">
                    <div class="social-avatar">${report.username.charAt(0).toUpperCase()}</div>
                    <span class="social-username">@${report.username}</span>
                </div>
                <span class="social-post-time">${report.timeAgo}</span>
            </div>
            <div class="social-post-content">${report.message}</div>
            <div class="social-post-meta">
                <span class="social-post-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${report.location}
                </span>
                <span class="social-post-type ${report.type}">${report.type}</span>
            </div>
        </div>
    `).join('');
}

function focusOnReport(reportId) {
    const report = socialState.reports.find(r => r.id === reportId);
    if (report && socialState.map) {
        socialState.map.setView([report.lat, report.lon], 10);

        // Find and open the marker popup
        socialState.markers.forEach(m => {
            const pos = m.getLatLng();
            if (Math.abs(pos.lat - report.lat) < 0.01 && Math.abs(pos.lng - report.lon) < 0.01) {
                m.openPopup();
            }
        });
    }
}

// ============ Share Weather ============
async function shareWeather() {
    if (!state.currentWeather) {
        showNotification('No weather data to share', 'error');
        return;
    }

    const weather = state.currentWeather;
    const text = `Weather in ${state.currentLocation?.name || weather.name}: ${formatTemp(weather.main.temp)}, ${weather.weather[0].description}. Humidity: ${weather.main.humidity}%, Wind: ${Math.round(weather.wind.speed * 3.6)} km/h`;

    if (navigator.share) {
        try {
            await navigator.share({ title: 'WeatherBot', text });
            showNotification('Shared successfully!', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                copyToClipboard(text);
            }
        }
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Weather info copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// ============ Radar Map ============
function initRadarMap() {
    if (!elements.radarMap || state.map) return;

    state.map = L.map('radarMap', {
        center: [state.currentLocation?.lat || 40.7128, state.currentLocation?.lon || -74.0060],
        zoom: 6,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 18
    }).addTo(state.map);

    if (state.weatherApiKey) {
        updateRadarLayer();
    }

    // Initialize lightning map
    initLightningMap();
}

function updateRadarLayer() {
    if (!state.map || !state.weatherApiKey) return;

    const layerSelect = document.getElementById('radarLayer');
    const layerType = layerSelect ? layerSelect.value : 'precipitation_new';

    if (state.radarLayer) {
        state.map.removeLayer(state.radarLayer);
    }

    state.radarLayer = L.tileLayer(
        `${CONFIG.radarTileUrl}/${layerType}/{z}/{x}/{y}.png?appid=${state.weatherApiKey}`,
        { opacity: 0.7, maxZoom: 18 }
    ).addTo(state.map);
}

function updateRadarCenter(lat, lon) {
    if (state.map) {
        state.map.setView([lat, lon], 8);
    }
}

// ============ Chat Functionality ============
function openChat() {
    if (elements.chatSidebar) {
        elements.chatSidebar.classList.add('open');
    }
}

function closeChat() {
    if (elements.chatSidebar) {
        elements.chatSidebar.classList.remove('open');
    }
}

function clearChat() {
    state.chatHistory = [];
    if (elements.chatMessages) {
        elements.chatMessages.innerHTML = `
            <div class="chat-welcome">
                <div class="bot-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/>
                    </svg>
                </div>
                <p>Hi! I'm WeatherBot. Ask me anything about the weather, forecasts, or get personalized recommendations!</p>
            </div>
        `;
    }
    showNotification('Chat cleared', 'success');
}

function updateChatState() {
    const hasProvider = state.aiProvider && state.apiKeys[state.aiProvider];
    if (elements.chatInput) {
        elements.chatInput.disabled = !hasProvider;
        elements.chatInput.placeholder = hasProvider ? 'Ask about the weather...' : 'Configure AI provider in settings...';
    }
    if (elements.sendChatBtn) {
        elements.sendChatBtn.disabled = !hasProvider;
    }
}

async function sendChatMessage() {
    const message = elements.chatInput?.value.trim();
    if (!message) return;

    const provider = state.aiProvider;
    const apiKey = state.apiKeys[provider];

    if (!provider || !apiKey) {
        showNotification('Please configure an AI provider in settings', 'error');
        return;
    }

    addChatMessage(message, 'user');
    elements.chatInput.value = '';

    const typingId = addTypingIndicator();

    try {
        const context = buildWeatherContext();
        const response = await callAIProvider(provider, apiKey, message, context);

        removeChatMessage(typingId);
        addChatMessage(response, 'bot', true);

    } catch (error) {
        console.error('AI chat error:', error);
        removeChatMessage(typingId);
        addChatMessage('Sorry, I encountered an error. Please check your API key and try again.', 'bot');
    }
}

function buildWeatherContext() {
    let context = `You are WeatherBot, a friendly and helpful weather assistant. You have access to real-time weather data and forecasts.

When responding:
- Be conversational and helpful
- Use the weather data provided to give accurate information
- Provide practical advice based on conditions
- Use markdown formatting for better readability (bold for emphasis, lists for multiple items)
- Keep responses concise but informative
`;

    if (state.currentWeather) {
        const w = state.currentWeather;
        const location = state.currentLocation?.name || w.name;
        context += `\n\n## Current Weather Data for ${location}\n`;
        context += `- **Temperature:** ${formatTemp(w.main.temp)} (feels like ${formatTemp(w.main.feels_like)})\n`;
        context += `- **Conditions:** ${w.weather[0].description}\n`;
        context += `- **Humidity:** ${w.main.humidity}%\n`;
        context += `- **Wind:** ${Math.round(w.wind.speed * 3.6)} km/h\n`;
        context += `- **Pressure:** ${w.main.pressure} hPa\n`;
        context += `- **Visibility:** ${(w.visibility / 1000).toFixed(1)} km\n`;
        context += `- **Cloud Cover:** ${w.clouds.all}%\n`;
        context += `- **Sunrise:** ${formatTimeFromUnix(w.sys.sunrise)}\n`;
        context += `- **Sunset:** ${formatTimeFromUnix(w.sys.sunset)}\n`;
    }

    if (state.forecast && state.forecast.list) {
        context += '\n\n## Upcoming Forecast (Next 24-48 hours)\n';
        state.forecast.list.slice(0, 10).forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const rainChance = item.pop ? Math.round(item.pop * 100) : 0;
            context += `- **${dayName} ${time}:** ${formatTemp(item.main.temp)}, ${item.weather[0].description}`;
            if (rainChance > 0) context += ` (${rainChance}% chance of rain)`;
            context += '\n';
        });
    }

    if (state.airQuality) {
        const aqi = state.airQuality.list[0].main.aqi;
        const level = CONFIG.aqiLevels[aqi - 1] || 'Unknown';
        context += `\n\n## Air Quality\n- **AQI Level:** ${level} (${aqi}/5)\n`;
    }

    const moonPhase = getMoonPhase();
    context += `\n\n## Moon Phase\n- ${moonPhase.name} ${moonPhase.icon}\n`;

    context += '\n\nProvide helpful, personalized advice based on this weather data. If asked about activities, consider the current and forecasted conditions.';

    return context;
}

async function callAIProvider(provider, apiKey, message, context) {
    const providers = {
        openai: {
            url: 'https://api.openai.com/v1/chat/completions',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: {
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: context },
                    ...state.chatHistory.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: 'user', content: message }
                ],
                max_tokens: 800,
                temperature: 0.7
            },
            parseResponse: (data) => data.choices[0].message.content
        },
        claude: {
            url: 'https://api.anthropic.com/v1/messages',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: {
                model: 'claude-3-haiku-20240307',
                max_tokens: 800,
                system: context,
                messages: [
                    ...state.chatHistory.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: 'user', content: message }
                ]
            },
            parseResponse: (data) => data.content[0].text
        },
        google: {
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            headers: { 'Content-Type': 'application/json' },
            body: {
                contents: [
                    ...state.chatHistory.map(m => ({
                        role: m.type === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    })),
                    { role: 'user', parts: [{ text: context + '\n\nUser question: ' + message }] }
                ],
                generationConfig: { maxOutputTokens: 800 }
            },
            parseResponse: (data) => data.candidates[0].content.parts[0].text
        },
        mistral: {
            url: 'https://api.mistral.ai/v1/chat/completions',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: {
                model: 'mistral-small-latest',
                messages: [
                    { role: 'system', content: context },
                    ...state.chatHistory.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: 'user', content: message }
                ],
                max_tokens: 800
            },
            parseResponse: (data) => data.choices[0].message.content
        },
        moonshot: {
            url: 'https://api.moonshot.cn/v1/chat/completions',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: {
                model: 'moonshot-v1-8k',
                messages: [
                    { role: 'system', content: context },
                    ...state.chatHistory.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: 'user', content: message }
                ],
                max_tokens: 800
            },
            parseResponse: (data) => data.choices[0].message.content
        }
    };

    const config = providers[provider];
    if (!config) throw new Error('Unknown provider');

    const response = await fetch(config.url, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(config.body)
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('API Error:', error);
        throw new Error('API request failed');
    }

    const data = await response.json();
    const responseText = config.parseResponse(data);

    state.chatHistory.push({ type: 'user', text: message });
    state.chatHistory.push({ type: 'bot', text: responseText });

    if (state.chatHistory.length > 20) {
        state.chatHistory = state.chatHistory.slice(-20);
    }

    return responseText;
}

function addChatMessage(text, type, parseAsMarkdown = false) {
    const id = 'msg-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.id = id;
    messageDiv.className = `message ${type}`;

    const welcome = elements.chatMessages?.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    if (type === 'bot' && parseAsMarkdown) {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/>
                </svg>
            </div>
            <div class="message-content">${parseMarkdown(text)}</div>
        `;
    } else if (type === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/>
                </svg>
            </div>
            <div class="message-content">${text}</div>
        `;
    } else {
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    }

    if (elements.chatMessages) {
        elements.chatMessages.appendChild(messageDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    return id;
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/>
            </svg>
        </div>
        <div class="typing-indicator"><span></span><span></span><span></span></div>
    `;

    if (elements.chatMessages) {
        elements.chatMessages.appendChild(typingDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    return id;
}

function removeChatMessage(id) {
    const message = document.getElementById(id);
    if (message) message.remove();
}

// ============ Settings ============
function setupSettings() {
    const weatherApiKeyInput = document.getElementById('weatherApiKey');
    const aiProviderSelect = document.getElementById('aiProvider');
    const tempUnitSelect = document.getElementById('tempUnit');
    const deviceModeSelect = document.getElementById('deviceMode');

    if (weatherApiKeyInput) weatherApiKeyInput.value = state.weatherApiKey;
    if (aiProviderSelect) aiProviderSelect.value = state.aiProvider;
    if (tempUnitSelect) tempUnitSelect.value = state.tempUnit;
    if (deviceModeSelect) deviceModeSelect.value = state.deviceMode || 'desktop';

    const openaiKeyInput = document.getElementById('openaiKey');
    const claudeKeyInput = document.getElementById('claudeKey');
    const googleKeyInput = document.getElementById('googleKey');
    const mistralKeyInput = document.getElementById('mistralKey');
    const moonshotKeyInput = document.getElementById('moonshotKey');

    if (openaiKeyInput) openaiKeyInput.value = state.apiKeys.openai;
    if (claudeKeyInput) claudeKeyInput.value = state.apiKeys.claude;
    if (googleKeyInput) googleKeyInput.value = state.apiKeys.google;
    if (mistralKeyInput) mistralKeyInput.value = state.apiKeys.mistral;
    if (moonshotKeyInput) moonshotKeyInput.value = state.apiKeys.moonshot;

    handleProviderChange();
}

function handleProviderChange() {
    const providerSelect = document.getElementById('aiProvider');
    const provider = providerSelect ? providerSelect.value : '';

    document.querySelectorAll('.api-key-group[data-provider]').forEach(group => {
        group.classList.toggle('active', group.dataset.provider === provider);
    });
}

function openSettings() {
    if (elements.settingsModal) {
        elements.settingsModal.classList.remove('hidden');
    }
}

function closeSettings() {
    if (elements.settingsModal) {
        elements.settingsModal.classList.add('hidden');
    }
}

function saveSettings() {
    const weatherApiKeyInput = document.getElementById('weatherApiKey');
    const aiProviderSelect = document.getElementById('aiProvider');
    const tempUnitSelect = document.getElementById('tempUnit');
    const deviceModeSelect = document.getElementById('deviceMode');

    state.weatherApiKey = weatherApiKeyInput?.value.trim() || '';
    localStorage.setItem('weatherApiKey', state.weatherApiKey);

    state.aiProvider = aiProviderSelect?.value || '';
    localStorage.setItem('aiProvider', state.aiProvider);

    const openaiKeyInput = document.getElementById('openaiKey');
    const claudeKeyInput = document.getElementById('claudeKey');
    const googleKeyInput = document.getElementById('googleKey');
    const mistralKeyInput = document.getElementById('mistralKey');
    const moonshotKeyInput = document.getElementById('moonshotKey');

    state.apiKeys.openai = openaiKeyInput?.value.trim() || '';
    state.apiKeys.claude = claudeKeyInput?.value.trim() || '';
    state.apiKeys.google = googleKeyInput?.value.trim() || '';
    state.apiKeys.mistral = mistralKeyInput?.value.trim() || '';
    state.apiKeys.moonshot = moonshotKeyInput?.value.trim() || '';

    localStorage.setItem('openaiKey', state.apiKeys.openai);
    localStorage.setItem('claudeKey', state.apiKeys.claude);
    localStorage.setItem('googleKey', state.apiKeys.google);
    localStorage.setItem('mistralKey', state.apiKeys.mistral);
    localStorage.setItem('moonshotKey', state.apiKeys.moonshot);

    const newTempUnit = tempUnitSelect?.value || 'metric';
    const unitChanged = newTempUnit !== state.tempUnit;
    state.tempUnit = newTempUnit;
    localStorage.setItem('tempUnit', state.tempUnit);

    const newDeviceMode = deviceModeSelect?.value || 'desktop';
    state.deviceMode = newDeviceMode;
    localStorage.setItem('deviceMode', state.deviceMode);
    applyDeviceMode(state.deviceMode);

    updateChatState();
    updateRadarLayer();

    if (unitChanged && state.currentLocation) {
        loadWeatherData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
    }

    closeSettings();
    showNotification('Settings saved successfully!', 'success');
}

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initDeviceModal();
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideDown {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, 20px); }
    }
`;
document.head.appendChild(style);
