import './App.css';
import { useEffect, useRef, useState } from "react";

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const FEATURED_CITIES = [
  { query: "Hanoi,VN", label: "Hà Nội", country: "Việt Nam" },
  { query: "Tokyo,JP", label: "Tokyo", country: "Nhật Bản" },
  { query: "Paris,FR", label: "Paris", country: "Pháp" },
  { query: "London,GB", label: "London", country: "Anh" },
  { query: "New York,US", label: "New York", country: "Hoa Kỳ" }
];

function getSavedCity() {
  try {
    return localStorage.getItem("lastCity") || "";
  } catch {
    return "";
  }
}


function App() {
    const [city, setCity] = useState(getSavedCity);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temperatureUnit, setTemperatureUnit] = useState("C");
    const [featuredCities, setFeaturedCities] = useState(
  FEATURED_CITIES.map(function (city) {
    return { ...city, weather: null, status: "loading" };
  })
);

const featuredRequest = useRef(null);
    
     
    async function handleSearch(citytoSearch = city) {
  const cityName = citytoSearch.trim();

  if (cityName === "") {
    alert("Bạn chưa nhập tên thành phố");
    return;
  }

  

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
        );
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        setWeather(data);
        try {
        // Giữ chức năng nhớ thành phố gần nhất
localStorage.setItem("lastCity", cityName);

// Đọc lịch sử cũ
const history = JSON.parse(
  localStorage.getItem("cityHistory") || "[]"
);

// Đưa thành phố vừa tìm lên đầu, bỏ tên trùng
const updatedHistory = [
  cityName,
  ...history.filter(function (savedCity) {
    return savedCity.toLowerCase() !== cityName.toLowerCase();
  })
].slice(0, 5);

// Lưu tối đa 5 thành phố gần nhất
localStorage.setItem(
  "cityHistory",
  JSON.stringify(updatedHistory)
);
        } catch (storageError) {
  console.warn("Không lưu được thành phố:", storageError);
        }

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
        );
        const forecastData = await forecastResponse.json();
        if (!forecastResponse.ok) {
          alert(forecastData.message);
          return;
        }

        const dailyForecast = forecastData.list
          .filter(function (item) {
            const localTime = new Date(
              (item.dt + forecastData.city.timezone) * 1000
            );
            const hour = localTime.getUTCHours();
            return hour >= 12 && hour < 15;
          })
          .slice(0, 5)
          .map(function (item) {
            const localTime = new Date(
              (item.dt + forecastData.city.timezone) * 1000
            );
            const dayName = localTime.toLocaleDateString('vi-VN', {
              weekday: 'long',
              timeZone: 'UTC'
            });
            return { ...item, dayName: dayName };
          });
        setForecast(dailyForecast);
      } catch (error) {
        console.error(error);
        alert("Không kết nối được. Bạn thử lại nhé!");
      } finally {
        setLoading(false);
      }
    }
    const weatherThemes = {
  Clear: "sunny",
  Clouds: "cloudy",
  Rain: "rainy",
  Drizzle: "rainy",
  Thunderstorm: "stormy",
  Snow: "snowy",
  Mist: "misty",
  Fog: "misty",
  Haze: "misty",
  Smoke: "misty",
  Dust: "misty",
  Sand: "misty",
  Ash: "misty",
  Squall: "stormy",
  Tornado: "stormy"
};

const currentCondition = weather?.weather?.[0]?.main;
const weatherTheme = weatherThemes[currentCondition] || "default";

const initialCity = useRef(city);
const didAutoSearch = useRef(false);

useEffect(function () {
  if (didAutoSearch.current) {
    return;
  }

  didAutoSearch.current = true;

  if (initialCity.current) {
    handleSearch(initialCity.current);
  }

  
}, []);
  function formatTemperature(celsius) {
  if (temperatureUnit === "F") {
    return Math.round(celsius * 9 / 5 + 32);
  }

  return Math.round(celsius);
}
  useEffect(function () {
  let cancelled = false;

  // Giữ lại Promise để không gọi trùng khi React
  // kiểm tra Effect trong chế độ phát triển.
  if (!featuredRequest.current) {
    featuredRequest.current = Promise.all(
      FEATURED_CITIES.map(async function (city) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.query)}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Không lấy được thời tiết");
          }

          return {
            ...city,
            weather: data,
            status: "success"
          };
        } catch (error) {
          console.warn(`Không tải được thời tiết ${city.label}:`, error);

          return {
            ...city,
            weather: null,
            status: "error"
          };
        }
      })
    );
  }

  featuredRequest.current.then(function (results) {
    if (!cancelled) {
      setFeaturedCities(results);
    }
  });

  return function () {
    cancelled = true;
  };
}, []);
  return (

    <div className={`weather-app weather-${weatherTheme}`}>
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="Studydeck Weather — nội dung chính">
          
          <span className="brand-icon" aria-hidden="true">S</span>
          <span><span className="brand-divider"></span>Thời tiết</span>
        </a>
        <button
  type="button"
  className="unit-button"
  onClick={function () {
    setTemperatureUnit(function (currentUnit) {
      return currentUnit === "C" ? "F" : "C";
    });
  }}
  aria-label={`Đổi sang độ ${temperatureUnit === "C" ? "F" : "C"}`}
>
  <span className={temperatureUnit === "C" ? "unit-active" : ""}>
    °C
  </span>

  <span className={temperatureUnit === "F" ? "unit-active" : ""}>
    °F
  </span>
</button>
        <span className="demo-badge"><span aria-hidden="true"></span>Dữ liệu từ OpenWeatherMap</span>
      </header>

      <main id="main-content">
        {/* 1. Tiêu đề và tìm kiếm: chưa có xử lý sự kiện. */}
        <section className="intro" aria-labelledby="page-title">
  <h1 id="page-title">Hôm nay, trời thế nào?</h1>

  {loading && (
    <p className="loading-message">Đang tìm...</p>
  )}
          

          <form
            className="search-panel"
            role="search"
            aria-label="Tìm thành phố"
            onSubmit={function (event) {
              event.preventDefault();
              handleSearch();
            }}
          >
            <label className="search-label" htmlFor="city-input">Thành phố</label>
            <div className="search-row">
              <span className="search-icon" aria-hidden="true"></span>
              <input
                id="city-input"
                className="city-input"
                type="search"
                placeholder="Nhập tên thành phố, ví dụ: Hà Nội"
                value={city}
                onKeyDown={function (event) {
                if (event.key === "Enter" && !loading) {
                  event.preventDefault();
                  handleSearch();
                  }
              }}
                onChange={function (event) {
                setCity(event.target.value);
                }}
                autoComplete="off"
                aria-describedby="search-note"
              />
              <button id="search-button" className="search-button" type="submit" disabled={loading}>
                {loading ? "Đang tìm..." : "Tìm thời tiết"} <span aria-hidden="true">↗</span>
              </button>
            </div>
            <p id="search-note" className="search-note">Bản giao diện minh họa · Nhập tên thành phố để xem thời tiết.</p>
          </form>
        </section>

        {/* 2. Thời tiết hiện tại: thay các giá trị mẫu bằng kết quả API sau. */}
        
          <section className="city-strip" aria-labelledby="city-strip-title">
  <div className="city-strip-heading">
    <h2 id="city-strip-title">Một vòng thế giới</h2>
    <p>Chọn thành phố để khám phá thời tiết</p>
  </div>

  <div
    className="city-strip-window"
    role="region"
    aria-label="Thời tiết các thành phố nổi bật"
    tabIndex={0}
  >
    <div className="city-strip-track">
      {[0, 1].map(function (copyIndex) {
        return (
          <div
            className={`city-strip-group ${
              copyIndex === 1 ? "city-strip-copy" : ""
            }`}
            key={copyIndex}
            aria-hidden={copyIndex === 1 ? true : undefined}
          >
            {featuredCities.map(function (featuredCity) {
              const currentWeather = featuredCity.weather;

              return (
                <button
                  type="button"
                  className="city-mini-card"
                  key={featuredCity.query}
                  tabIndex={copyIndex === 1 ? -1 : 0}
                  disabled={loading}
                  onClick={function () {
                    setCity(featuredCity.label);
                    handleSearch(featuredCity.query);
                  }}
                >
                  <span className="city-mini-location">
                    <span className="city-mini-name">
                      {featuredCity.label}
                    </span>

                    <span className="city-mini-country">
                      {featuredCity.country}
                    </span>
                  </span>

                  {currentWeather ? (
                    <>
                      <img
                        className="city-mini-icon"
                        src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                        alt={currentWeather.weather[0].description}
                      />

                      <span className="city-mini-temperature">
                        {formatTemperature(currentWeather.main.temp)}°{temperatureUnit}
                      </span>
                    </>
                  ) : (
                    <span className="city-mini-status">
                      {featuredCity.status === "loading"
                        ? "Đang tải…"
                        : "Chưa có dữ liệu"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  </div>
</section>
          <section className="current-weather" aria-labelledby="city-name">
  <div className="current-copy">
    <p className="card-eyebrow">THỜI TIẾT HIỆN TẠI</p>

    <h2 id="city-name">
      {weather ? weather.name : "Chưa chọn thành phố"}
      <span className="country">
        {weather ? weather.sys.country : ""}
      </span>
    </h2>

    <div className="temperature-line">
      <span className="current-temperature">
        {weather ? formatTemperature(weather.main.temp) : "--"}
        <span className="temperature-unit">
          °{temperatureUnit}
        </span>
      </span>

      <div className="temperature-description">
        <p className="weather-condition">
          {weather ? weather.weather[0].description : "--"}
        </p>

        <p className="feels-like">
          Cảm giác như{" "}
          {weather ? formatTemperature(weather.main.feels_like) : "--"}
          °{temperatureUnit}
        </p>
      </div>
    </div>
  </div>

  <div className="current-art" aria-hidden="true">
    <div className="orbit orbit-outer"></div>
    <div className="orbit orbit-inner"></div>
    <div className="hero-sun"></div>
    <div className="hero-cloud cloud-back"></div>
    <div className="hero-cloud cloud-front"></div>
    <span className="sky-spark spark-one">+</span>
    <span className="sky-spark spark-two">+</span>
  </div>
</section>
        

        
        <section className="forecast-section" aria-labelledby="forecast-title">
          <div className="section-heading">
  <h2 id="forecast-title">Dự báo 5 ngày</h2>
  <p>Thời tiết khoảng giữa trưa mỗi ngày</p>
</div>
          <div className="forecast-grid">
  {forecast.map(function (item) {
  return (
    <article className="forecast-card" key={item.dt}>
      <p className="forecast-day">{item.dayName}</p>

      <img
        className="forecast-icon"
        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
        alt=""
      />

      
      <strong className="forecast-temp">
      {formatTemperature(item.main.temp)}°{temperatureUnit}
        </strong>

      <p className="forecast-condition">
        {item.weather[0].description}
      </p>
    </article>
  );
})}
</div>
    
        </section>
      </main>

      <footer className="site-footer"><span></span><p>Dữ liệu thời tiết từ OpenWeather.</p></footer>
    </div>
  );

}

export default App;
