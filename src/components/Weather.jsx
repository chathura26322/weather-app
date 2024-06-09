import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import { useEffect, useRef, useState } from "react";
import countries from "../assets/countries.js";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const searchByCity = async (city) => {
    if (city === "") {
      alert("Please enter a valid city");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      updateWeatherData(data);
    } catch (error) {
      setWeatherData(false); // hide the details
      console.log(error);
    }
  };

  const searchByCoords = async (latitude, longitude) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      updateWeatherData(data);
    } catch (error) {
      setWeatherData(false); // hide the details
      console.log(error);
    }
  };

  const updateWeatherData = (data) => {
    const icon = allIcons[data.weather[0].icon] || clear_icon;
    setWeatherData({
      humidity: data.main.humidity,
      tempearture: Math.floor(data.main.temp),
      windSpeed: data.wind.speed,
      location: data.name,
      country: data.sys.country,
      icon: icon,
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          searchByCoords(latitude, longitude);
        },
        (error) => {
          console.log(error);
          // Default to Colombo if geolocation fails
          searchByCity("Colombo");
        }
      );
    } else {
      // Default to Colombo if geolocation is not available
      searchByCity("Colombo");
    }
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        {/* adding the search functionality */}
        <input ref={inputRef} type="text" placeholder="Search" />
        <img
          src={search_icon}
          alt=""
          onClick={() => searchByCity(inputRef.current.value)}
        />
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="temperature">{weatherData.tempearture}ºc</p>
          <p className="location">{weatherData.location}</p>
          <p className="country">{countries[weatherData.country]}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
