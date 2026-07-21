import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const countryApiUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
const openweatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const ApiKeyOpenWeather = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  const [dataContry, setDataCountry] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const filteredCountries = dataContry.filter((country) =>
    country.name.common.toLowerCase().includes(countryName.toLowerCase()),
  );
  const countryToShow =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null);

  useEffect(() => {
    const getFullCountry = async () => {
      try {
        const response = await axios.get(countryApiUrl);
        if (!response) throw Error("Failed To Fetching");
        setDataCountry(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    const getNameCountry = async () => {
      try {
        const response = await axios.get(`${countryApiUrl}/${countryName}`);
        if (!response) throw Error("Failed to get data country");
        setCountryName(response);
      } catch (err) {
        console.log(err);
      }
    };

    getFullCountry();
  }, []);

  useEffect(() => {
    const capital = countryToShow?.capital?.[0];

    const getWeather = async () => {
      if (!countryToShow) return;

      try {
        const response = await axios.get(
          `${openweatherUrl}${capital}&appid=${ApiKeyOpenWeather}&units=metric`,
        );
        if (!response) throw Error("Failed to Get Data OpenWeather");
        console.log(response.data);
        setWeather(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getWeather();
  }, [countryToShow]);

  return (
    <>
      <label htmlFor="countryName">find countries</label>
      <input
        type="text"
        name="country"
        id="countryName"
        value={countryName}
        onChange={(e) => setCountryName(e.target.value)}
      />

      {filteredCountries.length > 10 ? (
        <p>Too many matches, speficy another filter</p>
      ) : filteredCountries.length === 1 ? (
        filteredCountries.map((item) => (
          <div key={item.altSpellings[0]}>
            <div>
              <h1>{item.name.common}</h1>
              <p>{item.capital}</p>
              <p>Area {item.area}</p>
            </div>
            <div>
              <h2>Language</h2>
              <ul>
                {Object.entries(item.languages).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
              <img className="flags" src={item.flags.png} alt={item.flag.alt} />
            </div>
            {weather && (
              <div>
                <h2>Weather In {weather.name}</h2>
                <p>Temperature {weather.main.temp} Celcius</p>
                <p>Wind {weather.wind.speed} m/s</p>
              </div>
            )}
          </div>
        ))
      ) : selectedCountry ? (
        <div key={selectedCountry.altSpellings[0]}>
          <div>
            <h1>{selectedCountry.name.common}</h1>
            <p>{selectedCountry.capital}</p>
            <p>Area {selectedCountry.area}</p>
          </div>
          <div>
            <h2>Language</h2>
            <ul>
              {Object.entries(selectedCountry.languages).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
            <img
              className="flags"
              src={selectedCountry.flags.png}
              alt={selectedCountry.flag.alt}
            />
          </div>
          {weather && (
            <div>
              <h2>Weather In {weather.name}</h2>
              <p>Temperature {weather.main.temp} Celcius</p>
              <p>Wind {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      ) : (
        filteredCountries.map((item) => (
          <div key={item.altSpellings[0]} className="container">
            <p>{item.name.common}</p>
            <button onClick={() => setSelectedCountry(item)}>show</button>
          </div>
        ))
      )}
    </>
  );
}

export default App;
