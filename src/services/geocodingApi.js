import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // 날씨 API 키와 동일하게 사용 가능

export const getCoordinates = async (cityName) => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/geo/1.0/direct`,
            {
                params: {
                    q: cityName,
                    limit: 1,
                    appid: API_KEY,
                },
            }
        );

        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            return {
                lat: location.lat,
                lon: location.lon,
                name: location.local_names?.ko || location.name, // 한글 이름 우선, 없으면 영문 이름
                country: location.country,
            };
        } else {
            throw new Error("해당 지역을 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("지역 좌표 검색에 실패했습니다:", error);
        throw error;
    }
};
