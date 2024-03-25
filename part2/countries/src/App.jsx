import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (query.trim() === "") {
      setCountries([]);
      return;
    }

    axios
      .get(`https://restcountries.com/v3.1/name/${query}`)
      .then((response) => {
        if (response.data.length > 10) {
          setErrorMessage("Too many matches, specify another filter");
          setCountries([]);
        } else {
          setCountries(response.data);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        setErrorMessage("Error fetching data");
        setCountries([]);
      });
  }, [query]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <div>
        <label htmlFor="search">find countries: </label>
        <input
          type="text"
          id="search"
          value={query}
          onChange={handleQueryChange}
        />
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      {selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) : (
        countries.length > 0 && (
          <CountryList
            countries={countries}
            onShowCountry={handleShowCountry}
          />
        )
      )}
    </div>
  );
};

const CountryList = ({ countries, onShowCountry }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => onShowCountry(country)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

const CountryDetail = ({ country }) => {
  const { capital, area, flags, languages } = country;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setWeather(null);
      });
  }, [capital]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {area} km²</p>
      <img src={flags.png} alt={`Flag of ${country.name.common}`} />
      <p>Languages: {Object.values(languages).join(", ")}</p>
      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Description: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default App;
