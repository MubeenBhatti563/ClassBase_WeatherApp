import React from "react";
import "./App.css";

// Helper for weather icons and descriptions
function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1, 2, 3], "🌤️"],
    [[45, 48], "🌫️"],
    [[51, 56, 61, 66, 80], "🌦️"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧️"],
    [[71, 73, 75, 77, 85, 86], "🌨️"],
    [[95, 96, 99], "⛈️"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  return arr ? icons.get(arr) : "❓";
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

function getFlag(countryCode) {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "FAISALABAD",
      isLoading: false,
      error: "",
      displayLocation: "",
      weather: {},
    };
    this.fetchWeather = this.fetchWeather.bind(this);
  }

  async fetchWeather() {
    if (this.state.location.length < 2) return;
    try {
      this.setState({ isLoading: true, error: "" });
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results) throw new Error("Location not found");
      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      this.setState({
        displayLocation: `${name} ${getFlag(country_code)}`,
      });

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`,
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="app">
        <h1 className="heading">Classy Weather</h1>
        <div className="input-container">
          <input
            type="text"
            className="inputVal"
            placeholder="Search location..."
            onChange={(e) => this.setState({ location: e.target.value })}
            value={this.state.location}
          />
          <button className="btn-search" onClick={this.fetchWeather}>
            Get Weather
          </button>
        </div>

        {this.state.isLoading && <div className="loader">Searching...</div>}

        {this.state.error && (
          <div className="error-msg">{this.state.error}</div>
        )}

        {this.state.weather.time && !this.state.isLoading && (
          <div className="weather-container">
            <h2>Weather for {this.state.displayLocation}</h2>
            <ul className="weather-list">
              {this.state.weather.time.map((date, i) => (
                <Day
                  key={date}
                  date={date}
                  max={this.state.weather.temperature_2m_max[i]}
                  min={this.state.weather.temperature_2m_min[i]}
                  code={this.state.weather.weathercode[i]}
                  isToday={i === 0}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

class Day extends React.Component {
  render() {
    const { date, max, min, code, isToday } = this.props;
    return (
      <li className="day">
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(date)}</p>
        <p>
          <strong>{Math.ceil(max)}°</strong> {Math.floor(min)}°
        </p>
      </li>
    );
  }
}

export default App;
