import './App.css';
import { useState } from 'react';


function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    
     
    async function handleSearch() {
      const cityName = city.trim();
      if (cityName === '') return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=42ffee81fb86878613a805bb547b6da3&units=metric`
        );
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        setWeather(data);

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=42ffee81fb86878613a805bb547b6da3&units=metric`
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

  return (
  





    <div className="weather-app">
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="Studydeck Weather — nội dung chính">
          <span className="brand-icon" aria-hidden="true">S</span>
          <span><span className="brand-divider"></span>Thời tiết</span>
        </a>
        <span className="demo-badge"><span aria-hidden="true"></span>Dữ liệu mẫu</span>
      </header>

      <main id="main-content">
        {/* 1. Tiêu đề và tìm kiếm: chưa có xử lý sự kiện. */}
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">MỘT CHÚT CHUẨN BỊ CHO NGÀY MỚI</p>
          <h1 id="page-title">Hôm nay, trời thế nào?</h1>
          <p className="intro-description">Xem thời tiết nơi bạn đến, lên kế hoạch cho ngày của mình.</p>

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
            <p id="search-note" className="search-note">Bản giao diện minh họa · Chức năng tìm kiếm chưa được kết nối.</p>
          </form>
        </section>

        {/* 2. Thời tiết hiện tại: thay các giá trị mẫu bằng kết quả API sau. */}
        <section className="current-weather" aria-labelledby="city-name">
          <div className="current-copy">
            <p className="card-eyebrow">THỜI TIẾT HIỆN TẠI</p>
            <h2 id="city-name">{weather ? weather.name : "Chưa chọn thành phố"}<span className="country">{weather ? weather.sys.country : ""}</span></h2>
            <div className="temperature-line">
              <span className="current-temperature">{weather ? Math.round(weather.main.temp) : "--"}<span className="temperature-unit">°C</span></span>
              <div className="temperature-description">
                <p className="weather-condition">{weather ? weather.weather[0].description : "--"}</p>
                <p className="feels-like">Cảm giác như {weather ? Math.round(weather.main.feels_like) : "--"}°C</p>
              </div>
            </div>
            <p className="temperature-range">Cao nhất <strong>30°</strong><span aria-hidden="true"> / </span>Thấp nhất <strong>24°</strong></p>
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

        {/* 3. Ba chỉ số thời tiết. */}
        <section className="weather-details" aria-label="Chi tiết thời tiết">
          <article className="detail-card">
            <span className="detail-icon" aria-hidden="true">≈</span>
            <div><h3>Độ ẩm</h3><p className="detail-value">{weather ? weather.main.humidity : "--"}<span>%</span></p></div>
            <p className="detail-description">Độ ẩm tương đối</p>
          </article>
          <article className="detail-card">
            <span className="detail-icon" aria-hidden="true">↗</span>
            <div><h3>Tốc độ gió</h3><p className="detail-value">{weather ? Math.round(weather.wind.speed * 3.6) : "--"}<span>km/h</span></p></div>
            <p className="detail-description">Gió ở độ cao 10 m</p>
          </article>
          <article className="detail-card">
            <span className="detail-icon" aria-hidden="true">↓</span>
            <div><h3>Khả năng mưa</h3><p className="detail-value">20<span>%</span></p></div>
            <p className="detail-description">Mức cao nhất trong ngày</p>
          </article>
        </section>

        {/* 4. Năm thẻ mẫu. Khi học React, có thể đổi sang mảng và map. */}
        <section className="forecast-section" aria-labelledby="forecast-title">
          <div className="section-heading">
            <h2 id="forecast-title">Những ngày tiếp theo</h2>
            <p>Dự báo 5 ngày</p>
          </div>
          <div className="forecast-grid">
            <article className="forecast-card">
              <h3>{item.dayName}</h3><p className="forecast-order">Ngày 1</p>
              <div className="weather-symbol partly-cloudy" aria-hidden="true"><span className="symbol-sun"></span><span className="symbol-cloud"></span></div>
              <p className="forecast-condition">Có mây</p>
              <p className="forecast-temperature"><strong aria-label="Cao nhất 29 độ C">29°</strong><span aria-label="Thấp nhất 24 độ C">24°</span></p>
            </article>
            <article className="forecast-card">
              <h3>Ngày kia</h3><p className="forecast-order">Ngày 2</p>
              <div className="weather-symbol rainy" aria-hidden="true"><span className="symbol-cloud"></span><span className="symbol-rain"></span></div>
              <p className="forecast-condition">Mưa nhẹ</p>
              <p className="forecast-temperature"><strong aria-label="Cao nhất 27 độ C">27°</strong><span aria-label="Thấp nhất 23 độ C">23°</span></p>
            </article>
            <article className="forecast-card">
              <h3>Ngày thứ ba</h3><p className="forecast-order">Ngày 3</p>
              <div className="weather-symbol cloudy" aria-hidden="true"><span className="symbol-cloud"></span></div>
              <p className="forecast-condition">Nhiều mây</p>
              <p className="forecast-temperature"><strong aria-label="Cao nhất 28 độ C">28°</strong><span aria-label="Thấp nhất 23 độ C">23°</span></p>
            </article>
            <article className="forecast-card">
              <h3>Ngày thứ tư</h3><p className="forecast-order">Ngày 4</p>
              <div className="weather-symbol sunny" aria-hidden="true"><span className="symbol-sun"></span></div>
              <p className="forecast-condition">Trời nắng</p>
              <p className="forecast-temperature"><strong aria-label="Cao nhất 31 độ C">31°</strong><span aria-label="Thấp nhất 25 độ C">25°</span></p>
            </article>
            <article className="forecast-card">
              <h3>Ngày thứ năm</h3><p className="forecast-order">Ngày 5</p>
              <div className="weather-symbol partly-cloudy" aria-hidden="true"><span className="symbol-sun"></span><span className="symbol-cloud"></span></div>
              <p className="forecast-condition">Nắng nhẹ</p>
              <p className="forecast-temperature"><strong aria-label="Cao nhất 30 độ C">30°</strong><span aria-label="Thấp nhất 24 độ C">24°</span></p>
            </article>
          </div>
          <p className="forecast-legend">Nhiệt độ cao nhất / thấp nhất · Đơn vị °C</p>
        </section>
      </main>

      <footer className="site-footer"><span>studydeck weather</span><p>Số liệu chỉ để minh họa giao diện, không phải dự báo thực tế.</p></footer>
    </div>
  );

}

export default App;
