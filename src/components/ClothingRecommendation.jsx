function ClothingRecommendation({ clothing }) {
    if (!clothing) return null;

    return (
        <div className="card">
            <h2 className="card-title">오늘의 옷차림 추천</h2>
            <div>
                <div className="clothing-item">
                    <span className="clothing-label">상의:</span>
                    <span>{clothing.top}</span>
                </div>
                <div className="clothing-item">
                    <span className="clothing-label">하의:</span>
                    <span>{clothing.bottom}</span>
                </div>
                <div className="clothing-item">
                    <span className="clothing-label">준비물:</span>
                    <span>{clothing.additional}</span>
                </div>
            </div>
        </div>
    );
}

export default ClothingRecommendation;
