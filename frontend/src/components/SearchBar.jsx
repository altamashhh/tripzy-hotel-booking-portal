
import { useState } from "react";
import { MapPin, CalendarDays, Users, Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    function handleSearch(event) {
        event.preventDefault();
        onSearch({ location, checkIn, checkOut });
    }

    return (
        <form className="search-panel" onSubmit={handleSearch}>
            <div className="search-field">
                <MapPin />
                <div>
                    <label>Destination</label>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Where are you going?"
                        required
                    />
                </div>
            </div>

            <div className="search-field">
                <CalendarDays />
                <div>
                    <label>Check in</label>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="search-field">
                <CalendarDays />
                <div>
                    <label>Check out</label>
                    <input
                        type="date"
                        min={checkIn || undefined}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button type="submit" className="search-button">
                <Search size={19} />
                Explore stays
            </button>
        </form>
    );
}
