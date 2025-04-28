import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchForm from "./components/SearchForm";
import WeatherDisplay from "./components/WeatherDisplay";
import RecommendationsList from "./components/RecommendationsList";
import ClothingRecommendation from "./components/ClothingRecommendation";
import { getWeatherForecast } from "./services/weatherApi";
import { getAttractions } from "./services/travelApi";
import { getCoordinates } from "./services/geocodingApi";
import {
    getRecommendationsBasedOnWeather,
    getClothingRecommendations,
} from "./utils/recommendationUtils";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
    const [loading, setLoading] = useState(false);
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [clothingRecs, setClothingRecs] = useState(null);
    const [error, setError] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);

    const handleSearch = async (searchData) => {
        try {
            setLoading(true);
            setError(null);

            let coords;
            let cityName = searchData.destination;

            try {
                // 지오코딩 API로 좌표 가져오기
                const locationData = await getCoordinates(
                    searchData.destination
                );
                coords = { lat: locationData.lat, lon: locationData.lon };
                cityName = locationData.name; // 한글 이름으로 업데이트

                setLocationInfo(locationData);
                console.log("지역 정보:", locationData);
            } catch (geoError) {
                console.error("지오코딩 오류:", geoError);

                // 지오코딩 실패 시 내장 좌표 사용 (폴백)
                const coordinates = {
                    서울: { lat: 37.5665, lon: 126.978 },
                    부산: { lat: 35.1796, lon: 129.0756 },
                    제주: { lat: 33.4996, lon: 126.5312 },
                    인천: { lat: 37.4563, lon: 126.7052 },
                    대구: { lat: 35.8714, lon: 128.6014 },
                    대전: { lat: 36.3504, lon: 127.3845 },
                    광주: { lat: 35.1595, lon: 126.8526 },
                    울산: { lat: 35.5384, lon: 129.3114 },
                    세종: { lat: 36.48, lon: 127.289 },
                    수원: { lat: 37.2638, lon: 127.0287 },
                    천안: { lat: 36.8151, lon: 127.1135 },
                    청주: { lat: 36.6424, lon: 127.489 },
                    전주: { lat: 35.8242, lon: 127.148 },
                    포항: { lat: 36.019, lon: 129.3434 },
                    창원: { lat: 35.2278, lon: 128.6811 },
                    // 해외 도시
                    도쿄: { lat: 35.6762, lon: 139.6503 },
                    오사카: { lat: 34.6937, lon: 135.5023 },
                    베이징: { lat: 39.9042, lon: 116.4074 },
                    상하이: { lat: 31.2304, lon: 121.4737 },
                    홍콩: { lat: 22.3193, lon: 114.1694 },
                    타이페이: { lat: 25.033, lon: 121.5654 },
                    방콕: { lat: 13.7563, lon: 100.5018 },
                    싱가포르: { lat: 1.3521, lon: 103.8198 },
                    로마: { lat: 41.9028, lon: 12.4964 },
                    파리: { lat: 48.8566, lon: 2.3522 },
                    런던: { lat: 51.5074, lon: -0.1278 },
                    뉴욕: { lat: 40.7128, lon: -74.006 },
                    시드니: { lat: -33.8688, lon: 151.2093 },
                };

                // 내장된 좌표에 있는 도시인지 확인
                if (!coordinates[searchData.destination]) {
                    // 좌표 목록에 없는 도시면 오류 표시 후 함수 종료
                    setError(
                        "입력한 지역을 찾을 수 없습니다. 다른 지역명을 입력해주세요."
                    );
                    setLoading(false);
                    return;
                }

                // 내장된 좌표 사용
                coords = coordinates[searchData.destination];

                setLocationInfo({
                    name: searchData.destination,
                    country: "KR",
                    lat: coords.lat,
                    lon: coords.lon,
                });
            }

            // 2. 날씨 정보 가져오기
            const weatherData = await getWeatherForecast(
                coords.lat,
                coords.lon,
                searchData.travelDate
            );
            setWeatherInfo(weatherData);

            // 날씨 정보 확인
            console.log("선택한 날짜:", searchData.travelDate);
            console.log("날씨 데이터:", weatherData);

            // 3. 관광지 정보 가져오기 - 모든 지역에 동일한 API 사용
            let attractionsData = [];

            try {
                // Geoapify Places API로 관광지 정보 가져오기
                attractionsData = await getAttractions(coords.lat, coords.lon);
                console.log("관광지 데이터:", attractionsData);
            } catch (err) {
                console.error("관광지 정보를 가져오는데 실패했습니다:", err);
                // 에러가 발생해도 진행 (임시 데이터 사용)
                attractionsData = [
                    {
                        name: cityName + " 인기 관광지 1",
                        location: { address: "주소 정보 없음" },
                    },
                    {
                        name: cityName + " 인기 관광지 2",
                        location: { address: "주소 정보 없음" },
                    },
                    {
                        name: cityName + " 인기 관광지 3",
                        location: { address: "주소 정보 없음" },
                    },
                ];
            }

            // 4. 날씨에 따른 추천 생성
            const recs = getRecommendationsBasedOnWeather(
                weatherData,
                attractionsData
            );
            setRecommendations(recs);

            // 5. 옷차림 추천 생성
            const clothing = getClothingRecommendations(
                weatherData.isAvailable && weatherData.list.length > 0
                    ? weatherData.list[0].main.temp
                    : null
            );
            setClothingRecs(clothing);
        } catch (error) {
            console.error("검색 중 오류 발생:", error);
            setError(
                "정보를 가져오는 데 문제가 발생했습니다. 다시 시도해주세요."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div className="container">
                <h1 className="page-title">날씨 기반 여행 추천</h1>

                <div className="grid-layout">
                    <div className="search-sidebar">
                        <SearchForm onSearch={handleSearch} />
                    </div>

                    <div className="results-content">
                        {loading && (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="error-message">{error}</div>
                        )}

                        {!loading && !error && weatherInfo && (
                            <>
                                {locationInfo && (
                                    <div className="card location-info">
                                        <h2 className="card-title">
                                            검색 지역 정보
                                        </h2>
                                        <p>
                                            <strong>지역명:</strong>{" "}
                                            {locationInfo.name}
                                        </p>
                                        <p>
                                            <strong>국가:</strong>{" "}
                                            {locationInfo.country}
                                        </p>
                                        <p>
                                            <strong>좌표:</strong> 위도{" "}
                                            {locationInfo.lat.toFixed(4)}, 경도{" "}
                                            {locationInfo.lon.toFixed(4)}
                                        </p>
                                    </div>
                                )}
                                <WeatherDisplay weatherInfo={weatherInfo} />
                                <RecommendationsList
                                    recommendations={recommendations}
                                    locationName={locationInfo?.name}
                                />
                                {weatherInfo.isAvailable !== false && (
                                    <ClothingRecommendation
                                        clothing={clothingRecs}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
}

export default App;
