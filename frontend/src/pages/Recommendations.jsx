
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    MapPin,
    Wallet,
    ArrowRight,
    BedDouble,
    Search,
    SlidersHorizontal,
    CheckCircle2,
    BriefcaseBusiness,
    Heart,
    Mountain,
    Palmtree,
    UserRound,
    UsersRound,
    Gem,
    Leaf,
    Coffee
} from "lucide-react";

import Navbar from "../components/Navbar";

const API_URL = "http://localhost:8080/api";

const destinations = ["Mumbai", "Goa", "Jaipur", "Bengaluru", "Manali"];

const images = {
    Mumbai: "photo-1570168007204-dfb528c6958f",
    Goa: "photo-1512343879784-a960bf40e7f2",
    Jaipur: "photo-1599661046827-dacff0c0f09a",
    Bengaluru: "photo-1564013799919-ab600027ffc6",
    Manali: "photo-1626621341517-bbf3d9990a23"
};

const tripOptions = [
    { value: "Leisure", label: "Leisure", description: "A refreshing getaway", icon: Palmtree },
    { value: "Romantic", label: "Romantic", description: "A special escape for two", icon: Heart },
    { value: "Adventure", label: "Adventure", description: "Explore something new", icon: Mountain },
    { value: "Business", label: "Business", description: "Work meets comfort", icon: BriefcaseBusiness },
    { value: "Relaxation", label: "Relaxation", description: "Slow down and unwind", icon: Leaf },
    { value: "Family vacation", label: "Family vacation", description: "Make memories together", icon: UsersRound }
];

const travellerOptions = [
    { value: "Solo", label: "Solo", description: "Just me", icon: UserRound },
    { value: "Couple", label: "Couple", description: "A trip for two", icon: Heart },
    { value: "Family", label: "Family", description: "Time with loved ones", icon: UsersRound },
    { value: "Friends", label: "Friends", description: "The whole gang", icon: Coffee }
];

const stayOptions = [
    { value: "Budget", label: "Budget", description: "Smart and affordable", icon: Wallet },
    { value: "Mid-range", label: "Comfort", description: "The perfect balance", icon: BedDouble },
    { value: "Luxury", label: "Luxury", description: "A little extra indulgence", icon: Gem }
];

function getImage(location) {
    const city = location?.split(",")[0]?.trim();
    const id = images[city] || images.Mumbai;

    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
}

function formatPrice(price) {
    return Number(price || 0).toLocaleString("en-IN");
}

function PreferenceGroup({ title, subtitle, options, value, onChange }) {
    return (
        <div className="preference-group">
            <div className="preference-heading">
                <h3>{title}</h3>
                <p>{subtitle}</p>
            </div>

            <div className="preference-options">
                {options.map((option) => {
                    const Icon = option.icon;
                    const selected = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={`preference-option ${selected ? "selected" : ""}`}
                            onClick={() => onChange(option.value)}
                            aria-pressed={selected}
                        >
                            <span className="preference-icon">
                                <Icon size={21} />
                            </span>

                            <span className="preference-option-text">
                                <strong>{option.label}</strong>
                                <small>{option.description}</small>
                            </span>

                            {selected && (
                                <CheckCircle2
                                    className="preference-check"
                                    size={17}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function Recommendations() {
    const [location, setLocation] = useState("Mumbai");
    const [budget, setBudget] = useState("5000");

    // Current hotel inventory supports up to two guests.
    const guests = "2";

    const [tripPurpose, setTripPurpose] = useState("Leisure");
    const [travellerType, setTravellerType] = useState("Couple");
    const [stayPreference, setStayPreference] = useState("Mid-range");

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    async function findRecommendations(event) {
        event.preventDefault();

        if (!budget || Number(budget) <= 0) {
            setError("Please enter a valid budget.");
            return;
        }

        setLoading(true);
        setError("");
        setSearched(true);
        setRooms([]);

        try {
            const params = new URLSearchParams({
                location,
                maxBudget: budget,
                guests,
                tripPurpose,
                travellerType,
                stayPreference
            });

            const response = await fetch(
                `${API_URL}/recommendations?${params.toString()}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Unable to find recommendations."
                );
            }

            setRooms(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app-shell">
            <Navbar />

            <main className="recommendation-page">

                {/* HERO */}
                <section className="recommendation-hero">
                    <span className="eyebrow">
                        <Sparkles size={14} />
                        THE SMARTER WAY TO STAY
                    </span>

                    <h1>
                        Your perfect stay,
                        <br />
                        <em>thoughtfully found.</em>
                    </h1>

                    <p>
                        Every journey is different. Tell us your travel
                        vibe, and we'll find a stay that feels just right.
                    </p>
                </section>

                {/* PERSONALIZED TRIP BUILDER */}
                <form
                    className="trip-builder"
                    onSubmit={findRecommendations}
                >
                    <div className="trip-builder-header">
                        <div>
                            <span className="eyebrow dark">
                                <Sparkles size={13} />
                                YOUR PERSONAL STAY FINDER
                            </span>

                            <h2>
                                Let's plan your <em>kind of getaway.</em>
                            </h2>

                            <p>Just a few choices. We'll take it from here.</p>
                        </div>

                        <div className="trip-builder-decoration">
                            <Sparkles size={32} />
                        </div>
                    </div>

                    {/* DESTINATION AND BUDGET */}
                    <div className="trip-basic-details">
                        <div className="recommendation-field">
                            <label>
                                <MapPin size={16} />
                                WHERE TO?
                            </label>

                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                {destinations.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="recommendation-field">
                            <label>
                                <Wallet size={16} />
                                YOUR BUDGET PER NIGHT
                            </label>

                            <div className="budget-input-wrap">
                                <span>₹</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="Enter your budget"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="trip-builder-divider" />

                    {/* TRIP PURPOSE */}
                    <PreferenceGroup
                        title="What's the occasion?"
                        subtitle="Choose the feeling behind your journey."
                        options={tripOptions}
                        value={tripPurpose}
                        onChange={setTripPurpose}
                    />

                    <div className="trip-builder-divider" />

                    {/* TRAVELLER TYPE */}
                    <PreferenceGroup
                        title="Who's coming along?"
                        subtitle="We'll find a stay that suits your company."
                        options={travellerOptions}
                        value={travellerType}
                        onChange={setTravellerType}
                    />

                    <div className="trip-builder-divider" />

                    {/* STAY PREFERENCE */}
                    <PreferenceGroup
                        title="What's your stay style?"
                        subtitle="Pick the kind of comfort you're looking for."
                        options={stayOptions}
                        value={stayPreference}
                        onChange={setStayPreference}
                    />

                    {/* SUBMIT */}
                    <div className="trip-builder-footer">
                        <div className="trip-footer-note">
                            <Sparkles size={16} />
                            <span>Personalized recommendations, made for you.</span>
                        </div>

                        <button
                            className="search-button"
                            type="submit"
                            disabled={loading}
                        >
                            <Search size={17} />
                            {loading ? "Finding your stay..." : "Discover my stays"}
                            {!loading && <ArrowRight size={17} />}
                        </button>
                    </div>
                </form>

                {/* RESULTS */}
                <section className="recommendation-results">

                    <div className="section-heading">
                        <div>
                            <span className="eyebrow dark">
                                CURATED FOR YOUR JOURNEY
                            </span>

                            <h2>
                                Stays worth <em>discovering.</em>
                            </h2>
                        </div>

                        <SlidersHorizontal color="#b77e60" />
                    </div>

                    {loading && (
                        <div className="recommendation-empty">
                            <Sparkles size={35} />
                            <h3>Finding your perfect stay...</h3>
                            <p>
                                Our recommendation engine is matching
                                hotels to your travel preferences.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="booking-error">
                            {error}
                        </div>
                    )}

                    {!loading && searched && !error && rooms.length === 0 && (
                        <div className="recommendation-empty">
                            <BedDouble size={38} />
                            <h3>No matching stays just yet.</h3>
                            <p>
                                Try increasing your budget or exploring
                                another destination.
                            </p>
                        </div>
                    )}

                    {!loading && rooms.length > 0 && (
                        <>
                            <p className="recommendation-count">
                                <CheckCircle2
                                    size={15}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: "6px"
                                    }}
                                />

                                {rooms.length} matching{" "}
                                {rooms.length === 1 ? "stay" : "stays"} found
                            </p>

                            <div className="recommendation-grid">
                                {rooms.map((room) => (
                                    <article
                                        className="recommendation-card"
                                        key={room.roomTypeId}
                                    >
                                        <div className="recommendation-image">
                                            <img
                                                src={getImage(room.location)}
                                                alt={room.hotelName}
                                                loading="lazy"
                                            />

                                            <span className="recommendation-tag">
                                                <Sparkles size={12} />
                                                SMART MATCH
                                            </span>
                                        </div>

                                        <div className="recommendation-info">
                                            <span className="hotel-location">
                                                <MapPin
                                                    size={13}
                                                    style={{
                                                        verticalAlign: "middle",
                                                        marginRight: "5px"
                                                    }}
                                                />
                                                {room.location}
                                            </span>

                                            <h3>{room.hotelName}</h3>
                                            <h4>{room.roomCategory}</h4>
                                            <p>{room.description}</p>

                                            <div className="recommendation-capacity">
                                                <UsersRound size={16} />
                                                Accommodates up to{" "}
                                                <strong>{room.capacity} guests</strong>
                                            </div>

                                            <div className="recommendation-reason">
                                                <Sparkles size={16} />
                                                <span>{room.recommendationReason}</span>
                                            </div>

                                            {room.recommendationScore != null && (
                                                <div className="recommendation-capacity">
                                                    <CheckCircle2 size={16} />
                                                    Match score:{" "}
                                                    <strong>{room.recommendationScore}</strong>
                                                </div>
                                            )}

                                            <div className="recommendation-bottom">
                                                <div>
                                                    <small>PRICE PER NIGHT</small>
                                                    <div>
                                                        <strong>
                                                            ₹{formatPrice(room.pricePerNight)}
                                                        </strong>
                                                        <small> / night</small>
                                                    </div>
                                                </div>

                                                <Link
                                                    to={`/book/${room.roomTypeId}`}
                                                    className="recommendation-book"
                                                >
                                                    Book stay
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}

                    {!searched && !loading && (
                        <div className="recommendation-empty">
                            <Sparkles size={38} />
                            <h3>Your next favourite stay is waiting.</h3>
                            <p>
                                Tell us about your getaway above and
                                discover stays selected for you.
                            </p>
                        </div>
                    )}

                </section>
            </main>
        </div>
    );
}
