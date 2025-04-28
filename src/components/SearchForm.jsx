import { useState } from "react";

function SearchForm({ onSearch }) {
    const [destination, setDestination] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [isInternational, setIsInternational] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ destination, travelDate, isInternational });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="destination" className="form-label">
                    여행지:
                </label>
                <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="도시 또는 지역 이름"
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="travelDate" className="form-label">
                    여행 날짜:
                </label>
                <input
                    id="travelDate"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="form-input"
                    min={new Date().toISOString().split("T")[0]}
                    required
                />
            </div>

            <button type="submit" className="button">
                여행 정보 검색
            </button>
        </form>
    );
}

export default SearchForm;
