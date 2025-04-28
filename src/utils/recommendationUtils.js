export const getRecommendationsBasedOnWeather = (weatherData, attractions) => {
    // 날씨 상태 분석
    const mainWeather = weatherData.list[0].weather[0].main;
    const temperature = weatherData.list[0].main.temp;

    // 날씨에 따른 추천 타입 결정
    let recommendationType = "outdoor";

    if (
        mainWeather === "Rain" ||
        mainWeather === "Snow" ||
        mainWeather === "Thunderstorm"
    ) {
        recommendationType = "indoor";
    } else if (temperature > 30) {
        recommendationType = "cool";
    } else if (temperature < 5) {
        recommendationType = "warm";
    }

    // 추천 타입에 맞는 관광지 필터링
    let filteredAttractions = [...attractions]; // 배열이 없는 경우 대비

    // attractions 배열이 없는 경우 처리
    if (!Array.isArray(attractions) || attractions.length === 0) {
        return {
            weatherCondition: {
                main: mainWeather,
                temperature,
                description: weatherData.list[0].weather[0].description,
            },
            recommendationType,
            recommendations: [],
        };
    }

    // 날씨에 따른 필터링 (API별로 맞춤 구현 필요)
    switch (recommendationType) {
        case "indoor":
            // 실내 관광지 필터링 로직 (API별로 맞춤 구현 필요)
            break;
        case "cool":
            // 더울 때 추천 관광지 필터링 로직
            break;
        default:
            // 기본 추천
            filteredAttractions = attractions;
    }

    return {
        weatherCondition: {
            main: mainWeather,
            temperature,
            description: weatherData.list[0].weather[0].description,
        },
        recommendationType,
        recommendations: filteredAttractions.slice(0, 5),
    };
};

export const getClothingRecommendations = (temperature) => {
    if (temperature > 28) {
        return {
            top: "반팔 티셔츠, 민소매",
            bottom: "반바지, 얇은 치마",
            additional: "자외선 차단제, 모자, 선글라스",
        };
    } else if (temperature > 23) {
        return {
            top: "반팔 티셔츠",
            bottom: "얇은 면바지, 청바지",
            additional: "자외선 차단제",
        };
    } else if (temperature > 20) {
        return {
            top: "얇은 가디건, 긴팔 티셔츠",
            bottom: "면바지, 청바지",
            additional: "얇은 겉옷",
        };
    } else if (temperature > 17) {
        return {
            top: "얇은 니트, 맨투맨, 가디건",
            bottom: "청바지, 면바지",
            additional: "가벼운 자켓",
        };
    } else if (temperature > 12) {
        return {
            top: "긴팔 티셔츠, 니트",
            bottom: "청바지, 면바지",
            additional: "자켓, 가디건, 간절기 코트",
        };
    } else if (temperature > 9) {
        return {
            top: "니트, 맨투맨, 후드",
            bottom: "청바지, 슬랙스",
            additional: "코트, 가죽 자켓",
        };
    } else if (temperature > 5) {
        return {
            top: "히트텍, 니트, 기모 후드",
            bottom: "기모 바지",
            additional: "코트, 패딩, 목도리",
        };
    } else {
        return {
            top: "히트텍, 두꺼운 니트",
            bottom: "기모 바지",
            additional: "두꺼운 패딩, 장갑, 목도리, 방한모자",
        };
    }
};
