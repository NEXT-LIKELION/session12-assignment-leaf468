import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export const getAttractions = async (lat, lon, radius = 5000) => {
    try {
        const response = await axios.get("https://api.geoapify.com/v2/places", {
            params: {
                categories: "tourism,tourism.attraction,tourism.sights",
                filter: `circle:${lon},${lat},${radius}`,
                limit: 20,
                apiKey: API_KEY,
            },
        });

        // Geoapify API 응답 구조에 맞게 데이터 처리
        return response.data.features.map((feature) => ({
            name: feature.properties.name,
            location: {
                address: feature.properties.formatted,
                lat: feature.properties.lat,
                lon: feature.properties.lon,
            },
            categories: feature.properties.categories,
            distance: feature.properties.distance,
        }));
    } catch (error) {
        console.error("해외 관광지 정보를 가져오는데 실패했습니다:", error);
        throw error;
    }
};
