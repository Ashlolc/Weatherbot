/**
 * WeatherBot - 3D Weather Experience
 * Main Application JavaScript
 */

// ============ Configuration ============
const CONFIG = {
    weatherApiUrl: 'https://api.openweathermap.org/data/2.5',
    geoApiUrl: 'https://api.openweathermap.org/geo/1.0',
    radarTileUrl: 'https://tile.openweathermap.org/map',
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
    currentWeather: null,
    forecast: null,
    map: null,
    radarLayer: null,
    chatHistory: []
};

// ============ DOM Elements ============
const elements = {
    deviceModal: document.getElementById('deviceModal'),
    app: document.getElementById('app'),
    locationInput: document.getElementById('locationInput'),
    autocompleteDropdown: document.getElementById('autocompleteDropdown'),
    locateBtn: document.getElementById('locateBtn'),
    dashboardView: document.getElementById('dashboardView'),
    radarView: document.getElementById('radarView'),
    chatSidebar: document.getElementById('chatSidebar'),
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendChatBtn: document.getElementById('sendChatBtn'),
    settingsModal: document.getElementById('settingsModal'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    // Weather elements
    weatherIcon: document.getElementById('weatherIcon'),
    locationName: document.getElementById('locationName'),
    temperature: document.getElementById('temperature'),
    weatherDesc: document.getElementById('weatherDesc'),
    humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),
    uvIndex: document.getElementById('uvIndex'),
    pressure: document.getElementById('pressure'),
    alertsContainer: document.getElementById('alertsContainer'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    // Radar
    radarMap: document.getElementById('radarMap'),
    radarLayer: document.getElementById('radarLayer')
};

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
    const unit = state.tempUnit === 'metric' ? '°C' : '°F';
    return `${Math.round(temp)}${unit}`;
}

function formatTime(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

function formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getWeatherIcon(iconCode) {
    return CONFIG.weatherIcons[iconCode] || '🌡️';
}

function showLoading() {
    elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}

function showNotification(message, type = 'info') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ff4444' : '#333'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

    // Load weather data
    if (state.currentLocation) {
        await loadWeatherData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
    } else if (state.weatherApiKey) {
        // Try to get user's location
        getUserLocation();
    } else {
        // Show placeholder data
        showPlaceholderData();
    }

    // Initialize radar map (lazy)
    initRadarMap();
}

function showPlaceholderData() {
    elements.locationName.textContent = 'Set your location';
    elements.temperature.textContent = '--°';
    elements.weatherDesc.textContent = 'Enter a location or add your weather API key in settings';
}

// ============ Event Listeners ============
function setupEventListeners() {
    // Location input with autocomplete
    elements.locationInput.addEventListener('input', debounce(handleLocationInput, CONFIG.debounceDelay));
    elements.locationInput.addEventListener('focus', () => {
        if (elements.autocompleteDropdown.children.length > 0) {
            elements.autocompleteDropdown.classList.add('show');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            elements.autocompleteDropdown.classList.remove('show');
        }
    });

    // Geolocation button
    elements.locateBtn.addEventListener('click', getUserLocation);

    // Chat
    document.getElementById('openChatBtn').addEventListener('click', openChat);
    document.getElementById('closeChatBtn').addEventListener('click', closeChat);
    elements.sendChatBtn.addEventListener('click', sendChatMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // Settings
    document.getElementById('openSettingsBtn').addEventListener('click', openSettings);
    document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    document.getElementById('aiProvider').addEventListener('change', handleProviderChange);

    // Radar layer change
    document.getElementById('radarLayer').addEventListener('change', updateRadarLayer);
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
    elements.dashboardView.classList.toggle('hidden', view !== 'dashboard');
    elements.radarView.classList.toggle('hidden', view !== 'radar');

    if (view === 'radar' && state.map) {
        setTimeout(() => state.map.invalidateSize(), 100);
    }
}

// ============ Location Search & Autocomplete ============
async function handleLocationInput(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        elements.autocompleteDropdown.classList.remove('show');
        elements.autocompleteDropdown.innerHTML = '';
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
                <div class="autocomplete-item" data-lat="${loc.lat}" data-lon="${loc.lon}" data-name="${loc.name}, ${loc.state || ''} ${loc.country}">
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

            // Add click handlers
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

            // Reverse geocode to get location name
            try {
                const response = await fetch(
                    `${CONFIG.geoApiUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${state.weatherApiKey}`
                );
                const data = await response.json();
                const name = data[0] ? `${data[0].name}, ${data[0].country}` : 'Current Location';

                state.currentLocation = { lat, lon, name };
                localStorage.setItem('currentLocation', JSON.stringify(state.currentLocation));
                elements.locationInput.value = name;

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

// ============ Weather Data ============
async function loadWeatherData(lat, lon, name) {
    if (!state.weatherApiKey) {
        hideLoading();
        showNotification('Please add your weather API key in settings', 'error');
        return;
    }

    showLoading();

    try {
        // Fetch current weather and forecast in parallel
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${CONFIG.weatherApiUrl}/weather?lat=${lat}&lon=${lon}&units=${state.tempUnit}&appid=${state.weatherApiKey}`),
            fetch(`${CONFIG.weatherApiUrl}/forecast?lat=${lat}&lon=${lon}&units=${state.tempUnit}&appid=${state.weatherApiKey}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error('Failed to fetch weather data');
        }

        state.currentWeather = await currentRes.json();
        state.forecast = await forecastRes.json();

        renderCurrentWeather(name);
        renderHourlyForecast();
        renderDailyForecast();
        updateRadarCenter(lat, lon);

        // Try to fetch alerts (One Call API - may require different subscription)
        fetchAlerts(lat, lon);

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

    elements.weatherIcon.querySelector('.icon-sphere').textContent = iconEmoji;
    elements.locationName.textContent = locationName || weather.name;
    elements.temperature.textContent = formatTemp(weather.main.temp);
    elements.weatherDesc.textContent = weather.weather[0].description;
    elements.humidity.textContent = `${weather.main.humidity}%`;
    elements.wind.textContent = state.tempUnit === 'metric'
        ? `${Math.round(weather.wind.speed * 3.6)} km/h`
        : `${Math.round(weather.wind.speed)} mph`;
    elements.pressure.textContent = `${weather.main.pressure} hPa`;

    // UV Index would require One Call API, show placeholder
    elements.uvIndex.textContent = '--';
}

function renderHourlyForecast() {
    const forecast = state.forecast;
    if (!forecast) return;

    // Take first 8 entries (24 hours in 3-hour intervals)
    const hourlyData = forecast.list.slice(0, 8);

    elements.hourlyForecast.innerHTML = hourlyData.map(item => `
        <div class="hourly-item">
            <div class="time">${formatTime(item.dt, forecast.city.timezone)}</div>
            <div class="icon">${getWeatherIcon(item.weather[0].icon)}</div>
            <div class="temp">${formatTemp(item.main.temp)}</div>
        </div>
    `).join('');
}

function renderDailyForecast() {
    const forecast = state.forecast;
    if (!forecast) return;

    // Group by day and take max/min temps
    const dailyMap = new Map();
    forecast.list.forEach(item => {
        const day = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(day)) {
            dailyMap.set(day, {
                dt: item.dt,
                temps: [],
                icon: item.weather[0].icon,
                description: item.weather[0].description
            });
        }
        dailyMap.get(day).temps.push(item.main.temp);
    });

    const dailyData = Array.from(dailyMap.values()).slice(0, 7).map(day => ({
        ...day,
        tempMax: Math.max(...day.temps),
        tempMin: Math.min(...day.temps)
    }));

    elements.dailyForecast.innerHTML = dailyData.map(day => `
        <div class="daily-item">
            <div class="day">${formatDay(day.dt)}</div>
            <div class="icon">${getWeatherIcon(day.icon)}</div>
            <div class="condition">${day.description}</div>
            <div class="temps">
                <span class="temp-high">${formatTemp(day.tempMax)}</span>
                <span class="temp-low">${formatTemp(day.tempMin)}</span>
            </div>
        </div>
    `).join('');
}

async function fetchAlerts(lat, lon) {
    // OpenWeatherMap One Call API for alerts (requires subscription)
    // For demo purposes, we'll show a placeholder
    // In production, you'd use: ${CONFIG.weatherApiUrl}/onecall?lat=${lat}&lon=${lon}&appid=${state.weatherApiKey}

    const weather = state.currentWeather;
    if (!weather) return;

    // Generate sample alerts based on conditions
    const alerts = [];

    // Check for severe weather conditions
    const temp = weather.main.temp;
    const windSpeed = weather.wind.speed;
    const humidity = weather.main.humidity;
    const weatherMain = weather.weather[0].main.toLowerCase();

    if (state.tempUnit === 'metric' && temp > 35) {
        alerts.push({ type: 'warning', title: 'Heat Advisory', desc: 'Extreme heat expected. Stay hydrated and limit outdoor activities.' });
    } else if (state.tempUnit === 'metric' && temp < -10) {
        alerts.push({ type: 'severe', title: 'Cold Weather Alert', desc: 'Dangerously cold temperatures. Limit exposure and dress warmly.' });
    }

    if (windSpeed > 15) {
        alerts.push({ type: 'warning', title: 'High Wind Advisory', desc: `Wind speeds of ${Math.round(windSpeed * 3.6)} km/h expected.` });
    }

    if (weatherMain.includes('thunderstorm')) {
        alerts.push({ type: 'severe', title: 'Thunderstorm Warning', desc: 'Severe thunderstorms in the area. Seek shelter immediately.' });
    }

    if (weatherMain.includes('snow') || weatherMain.includes('blizzard')) {
        alerts.push({ type: 'warning', title: 'Winter Weather Advisory', desc: 'Snow expected. Roads may be hazardous.' });
    }

    if (alerts.length === 0) {
        elements.alertsContainer.innerHTML = '<div class="no-alerts">No active weather alerts</div>';
    } else {
        elements.alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-desc">${alert.desc}</div>
            </div>
        `).join('');
    }
}

// ============ Radar Map ============
function initRadarMap() {
    if (!elements.radarMap || state.map) return;

    // Initialize Leaflet map
    state.map = L.map('radarMap', {
        center: [state.currentLocation?.lat || 40.7128, state.currentLocation?.lon || -74.0060],
        zoom: 6,
        zoomControl: true
    });

    // Add base tile layer (dark theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 18
    }).addTo(state.map);

    // Add weather layer if API key exists
    if (state.weatherApiKey) {
        updateRadarLayer();
    }
}

function updateRadarLayer() {
    if (!state.map || !state.weatherApiKey) return;

    const layerType = document.getElementById('radarLayer').value;

    // Remove existing radar layer
    if (state.radarLayer) {
        state.map.removeLayer(state.radarLayer);
    }

    // Add new radar layer
    state.radarLayer = L.tileLayer(
        `${CONFIG.radarTileUrl}/${layerType}/{z}/{x}/{y}.png?appid=${state.weatherApiKey}`,
        {
            opacity: 0.7,
            maxZoom: 18
        }
    ).addTo(state.map);
}

function updateRadarCenter(lat, lon) {
    if (state.map) {
        state.map.setView([lat, lon], 8);
    }
}

// ============ Chat Functionality ============
function openChat() {
    elements.chatSidebar.classList.add('open');
}

function closeChat() {
    elements.chatSidebar.classList.remove('open');
}

function updateChatState() {
    const hasProvider = state.aiProvider && state.apiKeys[state.aiProvider];
    elements.chatInput.disabled = !hasProvider;
    elements.sendChatBtn.disabled = !hasProvider;

    if (hasProvider) {
        elements.chatInput.placeholder = 'Ask about the weather...';
    } else {
        elements.chatInput.placeholder = 'Configure AI provider in settings...';
    }
}

async function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;

    const provider = state.aiProvider;
    const apiKey = state.apiKeys[provider];

    if (!provider || !apiKey) {
        showNotification('Please configure an AI provider in settings', 'error');
        return;
    }

    // Add user message to chat
    addChatMessage(message, 'user');
    elements.chatInput.value = '';

    // Show typing indicator
    const typingId = addTypingIndicator();

    try {
        // Build context with weather data
        const context = buildWeatherContext();
        const response = await callAIProvider(provider, apiKey, message, context);

        // Remove typing indicator and add response
        removeChatMessage(typingId);
        addChatMessage(response, 'bot');

    } catch (error) {
        console.error('AI chat error:', error);
        removeChatMessage(typingId);
        addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

function buildWeatherContext() {
    let context = 'You are WeatherBot, a helpful weather assistant. ';

    if (state.currentWeather) {
        const w = state.currentWeather;
        const location = state.currentLocation?.name || w.name;
        context += `\n\nCurrent weather for ${location}:\n`;
        context += `- Temperature: ${formatTemp(w.main.temp)} (feels like ${formatTemp(w.main.feels_like)})\n`;
        context += `- Conditions: ${w.weather[0].description}\n`;
        context += `- Humidity: ${w.main.humidity}%\n`;
        context += `- Wind: ${Math.round(w.wind.speed * 3.6)} km/h\n`;
        context += `- Pressure: ${w.main.pressure} hPa\n`;
        context += `- Visibility: ${w.visibility / 1000} km\n`;
    }

    if (state.forecast) {
        context += '\n\nUpcoming forecast:\n';
        state.forecast.list.slice(0, 8).forEach(item => {
            const time = new Date(item.dt * 1000).toLocaleString();
            context += `- ${time}: ${formatTemp(item.main.temp)}, ${item.weather[0].description}\n`;
        });
    }

    context += '\n\nProvide helpful weather information, recommendations for activities, and safety advice based on conditions. Be conversational and friendly.';

    return context;
}

async function callAIProvider(provider, apiKey, message, context) {
    const providers = {
        openai: {
            url: 'https://api.openai.com/v1/chat/completions',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: context },
                    ...state.chatHistory.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: 'user', content: message }
                ],
                max_tokens: 500
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
                max_tokens: 500,
                system: context,
                messages: [
                    ...state.chatHistory.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: 'user', content: message }
                ]
            },
            parseResponse: (data) => data.content[0].text
        },
        google: {
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            headers: { 'Content-Type': 'application/json' },
            body: {
                contents: [
                    { role: 'user', parts: [{ text: context + '\n\nUser: ' + message }] }
                ]
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
                max_tokens: 500
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
                max_tokens: 500
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

    // Save to chat history
    state.chatHistory.push({ type: 'user', text: message });
    state.chatHistory.push({ type: 'bot', text: responseText });

    // Keep history manageable
    if (state.chatHistory.length > 20) {
        state.chatHistory = state.chatHistory.slice(-20);
    }

    return responseText;
}

function addChatMessage(text, type) {
    const id = 'msg-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.id = id;
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;

    // Remove welcome message if it exists
    const welcome = elements.chatMessages.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

    return id;
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';

    elements.chatMessages.appendChild(typingDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

    return id;
}

function removeChatMessage(id) {
    const message = document.getElementById(id);
    if (message) message.remove();
}

// ============ Settings ============
function setupSettings() {
    // Load saved settings
    document.getElementById('weatherApiKey').value = state.weatherApiKey;
    document.getElementById('aiProvider').value = state.aiProvider;
    document.getElementById('openaiKey').value = state.apiKeys.openai;
    document.getElementById('claudeKey').value = state.apiKeys.claude;
    document.getElementById('googleKey').value = state.apiKeys.google;
    document.getElementById('mistralKey').value = state.apiKeys.mistral;
    document.getElementById('moonshotKey').value = state.apiKeys.moonshot;
    document.getElementById('tempUnit').value = state.tempUnit;
    document.getElementById('deviceMode').value = state.deviceMode || 'desktop';

    handleProviderChange();
}

function handleProviderChange() {
    const provider = document.getElementById('aiProvider').value;

    document.querySelectorAll('.api-key-group[data-provider]').forEach(group => {
        group.classList.toggle('active', group.dataset.provider === provider);
    });
}

function openSettings() {
    elements.settingsModal.classList.remove('hidden');
}

function closeSettings() {
    elements.settingsModal.classList.add('hidden');
}

function saveSettings() {
    // Save weather API key
    state.weatherApiKey = document.getElementById('weatherApiKey').value.trim();
    localStorage.setItem('weatherApiKey', state.weatherApiKey);

    // Save AI provider settings
    state.aiProvider = document.getElementById('aiProvider').value;
    localStorage.setItem('aiProvider', state.aiProvider);

    state.apiKeys.openai = document.getElementById('openaiKey').value.trim();
    state.apiKeys.claude = document.getElementById('claudeKey').value.trim();
    state.apiKeys.google = document.getElementById('googleKey').value.trim();
    state.apiKeys.mistral = document.getElementById('mistralKey').value.trim();
    state.apiKeys.moonshot = document.getElementById('moonshotKey').value.trim();

    localStorage.setItem('openaiKey', state.apiKeys.openai);
    localStorage.setItem('claudeKey', state.apiKeys.claude);
    localStorage.setItem('googleKey', state.apiKeys.google);
    localStorage.setItem('mistralKey', state.apiKeys.mistral);
    localStorage.setItem('moonshotKey', state.apiKeys.moonshot);

    // Save display settings
    const newTempUnit = document.getElementById('tempUnit').value;
    const unitChanged = newTempUnit !== state.tempUnit;
    state.tempUnit = newTempUnit;
    localStorage.setItem('tempUnit', state.tempUnit);

    const newDeviceMode = document.getElementById('deviceMode').value;
    state.deviceMode = newDeviceMode;
    localStorage.setItem('deviceMode', state.deviceMode);
    applyDeviceMode(state.deviceMode);

    // Update UI
    updateChatState();
    updateRadarLayer();

    // Reload weather if unit changed
    if (unitChanged && state.currentLocation) {
        loadWeatherData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
    }

    closeSettings();
    showNotification('Settings saved successfully');
}

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', initDeviceModal);
