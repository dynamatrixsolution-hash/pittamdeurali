import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pitam Deurali Coordinates
  const lat = 28.3254375;
  const lon = 83.8290625;

  useEffect(() => {
    const fetchWeather = async () => {
      // Simple cache check (15 minutes expiry)
      const cachedData = sessionStorage.getItem('pitam_deurali_weather');
      const cachedTime = sessionStorage.getItem('pitam_deurali_weather_time');

      if (cachedData && cachedTime && (Date.now() - Number(cachedTime) < 15 * 60 * 1000)) {
        setWeather(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to retrieve forecast data from API.');
        
        const data = await res.json();
        
        setWeather(data);
        sessionStorage.setItem('pitam_deurali_weather', JSON.stringify(data));
        sessionStorage.setItem('pitam_deurali_weather_time', Date.now().toString());
      } catch (err) {
        console.error('Weather fetching error:', err);
        setError('Weather data currently unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Map WMO Weather Codes to icons & descriptions
  const getWeatherDetails = (code, isDay = 1) => {
    switch (code) {
      case 0:
        return { icon: isDay ? 'bi-sun' : 'bi-moon-stars', text: 'Clear Sky' };
      case 1:
      case 2:
      case 3:
        return { icon: isDay ? 'bi-cloud-sun' : 'bi-cloud-moon', text: 'Partly Cloudy' };
      case 45:
      case 48:
        return { icon: 'bi-cloud-fog2', text: 'Foggy' };
      case 51:
      case 53:
      case 55:
        return { icon: 'bi-cloud-drizzle', text: 'Drizzle' };
      case 61:
      case 63:
      case 65:
        return { icon: 'bi-cloud-rain', text: 'Rainy' };
      case 66:
      case 67:
        return { icon: 'bi-cloud-sleet', text: 'Freezing Rain' };
      case 71:
      case 73:
      case 75:
        return { icon: 'bi-cloud-snow', text: 'Snowy' };
      case 77:
        return { icon: 'bi-cloud-snow', text: 'Snow Grains' };
      case 80:
      case 81:
      case 82:
        return { icon: 'bi-cloud-rain-heavy', text: 'Rain Showers' };
      case 85:
      case 86:
        return { icon: 'bi-cloud-snow', text: 'Snow Showers' };
      case 95:
      case 96:
      case 99:
        return { icon: 'bi-cloud-lightning-rain', text: 'Thunderstorm' };
      default:
        return { icon: 'bi-cloud', text: 'Cloudy' };
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="card-luxury weather-widget-glass p-5 text-center text-secondary">
        <div className="spinner-border spinner-luxury mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="small mb-0">Fetching live weather data for Pitam Deurali...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="card-luxury weather-widget-glass p-4 text-center text-secondary">
        <div className="fs-3 text-warning mb-2"><i className="bi bi-exclamation-triangle"></i></div>
        <p className="small mb-0">{error || 'Weather forecast currently unavailable. Check your connection.'}</p>
      </div>
    );
  }

  const currentDetails = getWeatherDetails(weather.current.weather_code, weather.current.is_day);

  return (
    <div className="card-luxury weather-widget-glass overflow-hidden w-100 fade-in-up">
      {/* Current Weather Header */}
      <div className="p-4 border-bottom" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="row g-4 align-items-center">
          <div className="col-md-6 col-12 text-center text-md-start">
            <h5 className="font-serif fw-bold text-white mb-1">Live Location Weather</h5>
            <span className="small text-muted text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>
              Pitam Deurali Viewpoint &bull; Elev. ~2,100m
            </span>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-4 mt-3">
              <div className="display-3 fw-bold text-white" style={{ color: 'var(--text-primary)' }}>
                {Math.round(weather.current.temperature_2m)}&deg;C
              </div>
              <div className="text-start">
                <div className="fs-1 text-gold" style={{ color: 'var(--color-gold)' }}>
                  <i className={`bi ${currentDetails.icon}`}></i>
                </div>
                <div className="small fw-semibold text-white">{currentDetails.text}</div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-12">
            <div className="row g-3 text-center text-md-start">
              <div className="col-6 col-sm-3 col-md-6">
                <div className="small text-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>Apparent Temp</div>
                <div className="fw-semibold text-white">{Math.round(weather.current.apparent_temperature)}&deg;C</div>
              </div>
              <div className="col-6 col-sm-3 col-md-6">
                <div className="small text-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>Wind Speed</div>
                <div className="fw-semibold text-white">{weather.current.wind_speed_10m} km/h</div>
              </div>
              <div className="col-6 col-sm-3 col-md-6">
                <div className="small text-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>Humidity</div>
                <div className="fw-semibold text-white">{weather.current.relative_humidity_2m}%</div>
              </div>
              <div className="col-6 col-sm-3 col-md-6">
                <div className="small text-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>Visibility</div>
                <div className="fw-semibold text-white">{(weather.current.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights (Sunrise, Sunset, Rain Chance) */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', backgroundColor: 'var(--bg-primary)' }}>
        <div className="row text-center g-3 text-secondary">
          <div className="col-sm-4 col-12">
            <i className="bi bi-sunrise me-2 text-warning"></i>
            Sunrise: <strong className="text-white">{formatTime(weather.daily.sunrise[0])}</strong>
          </div>
          <div className="col-sm-4 col-12">
            <i className="bi bi-sunset me-2 text-info"></i>
            Sunset: <strong className="text-white">{formatTime(weather.daily.sunset[0])}</strong>
          </div>
          <div className="col-sm-4 col-12">
            <i className="bi bi-cloud-rain me-2 text-primary"></i>
            Precipitation Chance: <strong className="text-white">{weather.daily.precipitation_probability_max[0]}%</strong>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      <div className="p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h6 className="font-serif fw-bold text-white mb-3 text-start">5-Day Mountain Forecast</h6>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-2">
          {weather.daily.time.slice(0, 5).map((dayTime, index) => {
            const dayDetails = getWeatherDetails(weather.daily.weather_code[index]);
            return (
              <div className="col" key={dayTime}>
                <div className="p-3 text-center border h-100 d-flex flex-column justify-content-between" style={{ borderColor: 'var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="small text-secondary mb-1" style={{ fontSize: '0.75rem' }}>
                    {index === 0 ? 'Today' : formatDate(dayTime)}
                  </div>
                  <div className="fs-3 text-gold my-2" style={{ color: 'var(--color-gold)' }}>
                    <i className={`bi ${dayDetails.icon}`}></i>
                  </div>
                  <div>
                    <div className="small fw-semibold text-white mb-1" style={{ fontSize: '0.75rem' }}>{dayDetails.text}</div>
                    <div className="small d-flex justify-content-center gap-2" style={{ fontSize: '0.7rem' }}>
                      <span className="text-danger fw-bold">{Math.round(weather.daily.temperature_2m_max[index])}&deg;</span>
                      <span className="text-muted">{Math.round(weather.daily.temperature_2m_min[index])}&deg;</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
