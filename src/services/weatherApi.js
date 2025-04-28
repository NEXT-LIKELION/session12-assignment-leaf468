import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeatherForecast = async (lat, lon, date = null) => {
    try {
        // 기본 날씨 데이터 가져오기 (5일)
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast`,
            {
                params: {
                    lat,
                    lon,
                    appid: API_KEY,
                    units: "metric",
                    lang: "kr",
                },
            }
        );

        // 날짜가 지정되지 않았으면 현재 날씨 반환
        if (!date) {
            return response.data;
        }

        // 선택한 날짜 파싱
        const targetDate = new Date(date);
        const targetDateStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 날짜 차이 계산 (일 단위)
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 5일 이내의 날짜인 경우 API 데이터 필터링
        if (diffDays >= 0 && diffDays < 5) {
            // 해당 날짜의 데이터만 필터링
            const filteredList = response.data.list.filter((item) => {
                const itemDate = new Date(item.dt * 1000)
                    .toISOString()
                    .split("T")[0];
                return itemDate === targetDateStr;
            });

            if (filteredList.length > 0) {
                // 원본 응답 복사 후 필터링된 목록으로 대체
                const filteredData = {
                    ...response.data,
                    list: filteredList,
                    isAvailable: true,
                };
                return filteredData;
            }
        }

        // 5일 이상 미래 날짜는 날씨 정보 없음을 표시
        console.log(`${targetDateStr} 날짜의 날씨 정보는 제공되지 않습니다.`);

        // 날씨 정보가 없음을 나타내는 플래그 추가
        return {
            ...response.data,
            list: [],
            isAvailable: false,
            message: "선택한 날짜의 날씨 정보는 5일 이내의 예보만 제공됩니다.",
        };
    } catch (error) {
        console.error("날씨 정보를 가져오는데 실패했습니다:", error);
        throw error;
    }
};
