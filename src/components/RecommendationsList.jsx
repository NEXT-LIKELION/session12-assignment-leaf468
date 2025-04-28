function RecommendationsList({ recommendations }) {
    if (!recommendations) return null;

    const { recommendationType, weatherCondition } = recommendations;

    // 추천 타입에 따른 텍스트
    let recommendationText = "";
    switch (recommendationType) {
        case "indoor":
            recommendationText = "현재 날씨에는 실내 관광지를 추천합니다.";
            break;
        case "cool":
            recommendationText = "더운 날씨를 피할 수 있는 장소를 추천합니다.";
            break;
        case "warm":
            recommendationText = "추운 날씨에 적합한 장소를 추천합니다.";
            break;
        default:
            recommendationText = "날씨가 좋아 야외 활동하기 좋은 날입니다.";
    }

    return (
        <div className="card">
            <h2 className="card-title">추천 관광지</h2>
            <p>{recommendationText}</p>

            {recommendations.recommendations.length > 0 ? (
                <ul className="recommendations-list">
                    {recommendations.recommendations.map((place, index) => (
                        <li key={index} className="recommendation-item">
                            <h3 className="recommendation-title">
                                {place.title || place.place_name || place.name}
                            </h3>
                            <p>
                                {place.addr1 ||
                                    place.address ||
                                    place.location?.address}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>해당 지역에 추천 가능한 관광지 정보가 없습니다.</p>
            )}
        </div>
    );
}

export default RecommendationsList;
