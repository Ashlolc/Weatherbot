# WeatherBot

A modern, 3D black and white weather application with AI-powered chatbot integration.

## Features

- **3D Modern UI**: Sleek black and white design with 3D effects and smooth animations
- **Weather Dashboard**: Current weather, hourly and 7-day forecasts
- **Weather Radar**: Interactive map with multiple weather layers (precipitation, clouds, temperature, wind, pressure)
- **Location Autocomplete**: Search and autofill locations with intelligent suggestions
- **Device Detection**: Automatic scaling for mobile and desktop displays
- **AI Chatbot (WeatherBot)**: Chat with AI about weather conditions and get personalized recommendations
- **Multi-Provider AI Support**:
  - OpenAI (GPT)
  - Anthropic (Claude)
  - Google AI (Gemini)
  - Mistral AI
  - Moonshot AI
- **Weather Alerts**: Automatic alerts for severe weather conditions

## Getting Started

### 1. Open the Application

Simply open `index.html` in your web browser.

### 2. Configure API Keys

Click the settings icon (gear) in the top right corner:

1. **Weather API Key** (Required): Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. **AI Provider** (Optional): Select your preferred AI provider and enter the API key to enable the chatbot

### 3. Set Your Location

- Type a location in the search bar to find places
- Or click the location icon to use your current location

## Usage

### Dashboard View
View current weather conditions, hourly forecast, and 7-day forecast for your selected location.

### Radar View
Interactive weather radar map with multiple layers:
- Precipitation
- Clouds
- Temperature
- Wind Speed
- Pressure

### Ask WeatherBot
Click "Ask WeatherBot" to open the AI chat. Ask questions like:
- "Should I bring an umbrella today?"
- "What's the best time to go for a run?"
- "Will it rain this week?"
- "Is it safe to drive today?"

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with 3D effects, CSS Grid, Flexbox
- **Vanilla JavaScript** - No frameworks required
- **Leaflet.js** - Interactive radar maps
- **OpenWeatherMap API** - Weather data and radar tiles
- **Multiple AI APIs** - Intelligent weather assistance

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Local Storage

The app uses local storage to save:
- Device mode preference
- Temperature unit preference
- API keys (stored locally, never sent to third parties except respective AI providers)
- Last searched location

## License

MIT License
