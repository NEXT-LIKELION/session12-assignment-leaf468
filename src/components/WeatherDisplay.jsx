function WeatherDisplay({ weatherInfo }) {
    if (!weatherInfo) return null;

    // 날씨 정보가 없는 경우 (5일 이후 예보)
    if (!weatherInfo.isAvailable || weatherInfo.list.length === 0) {
        return (
            <div className="card">
                <h2 className="card-title">날씨 정보</h2>
                <div className="weather-display">
                    <p>선택하신 날짜의 날씨 정보는 제공되지 않습니다.</p>
                    <p>현재부터 5일 이내의 날씨 정보만 확인 가능합니다.</p>
                </div>
            </div>
        );
    }

    // 날씨 데이터 있는 경우 계속 진행
    const mainWeather = weatherInfo.list[0];
    const date = new Date(mainWeather.dt * 1000);

    const formattedDate = `${date.getFullYear()}년 ${
        date.getMonth() + 1
    }월 ${date.getDate()}일`;

    return (
        <div className="card">
            <h2 className="card-title">날씨 정보 - {formattedDate}</h2>

            <div className="weather-display">
                <div className="weather-icon">
                    <img
                        src={`https://openweathermap.org/img/wn/${mainWeather.weather[0].icon}@2x.png`}
                        alt="날씨 아이콘"
                        width="80"
                    />
                </div>
                <div className="weather-info">
                    <p className="temperature">
                        {Math.round(mainWeather.main.temp)}°C
                    </p>
                    <p className="description">
                        {mainWeather.weather[0].description}
                    </p>
                    <p>습도: {mainWeather.main.humidity}%</p>
                    <p>풍속: {mainWeather.wind.speed} m/s</p>
                </div>
            </div>

            {weatherInfo.list.length > 1 && (
                <div className="daily-forecast">
                    <h3>시간대별 날씨</h3>
                    <div className="forecast-items">
                        {weatherInfo.list.slice(0, 5).map((item, index) => {
                            const itemDate = new Date(item.dt * 1000);
                            const hour = itemDate.getHours();
                            return (
                                <div key={index} className="forecast-item">
                                    <div>{hour}:00</div>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                        alt="날씨 아이콘"
                                        width="40"
                                    />
                                    <div>{Math.round(item.main.temp)}°C</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherDisplay;
