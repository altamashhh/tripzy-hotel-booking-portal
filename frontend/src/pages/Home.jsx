
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { getHotels, searchAvailableHotels } from "../services/api";
import { useNavigate } from "react-router-dom";

const hotelImages = {
    // MUMBAI
    "Seabreeze Residency": "photo-1566073771259-6a8506099945",
    "The Marine Crown": "photo-1611892440504-42a792e24d32",
    "Harbour View Suites": "photo-1566665797739-1674de7a421a",

    // GOA
    "Palm Grove Retreat": "photo-1512343879784-a960bf40e7f2",
    "Azure Sands Resort": "photo-1571896349842-33c89424de2d",
    "Coconut Bay Retreat": "photo-1578683010236-d716f9a3f461",

    // JAIPUR
    "Aravali Grand Stay": "photo-1599661046827-dacff0c0f09a",
    "Rajputana Palace": "photo-1613977257363-707ba9348227",
    "Pink City Heritage Inn": "photo-1564078516393-cf04bd966897",

    // BENGALURU
    "Urban Nest Suites": "photo-1601918774946-25832a4be0d6",
    "Silicon Garden Hotel": "photo-1497366754035-f200968a6e72",
    "The Orchid Residency": "photo-1595576508898-0ad5c879a061",

    // MANALI
    "Pinecrest Mountain Lodge": "/images/pinecrest-mountain-lodge.png",
    "Snowpeak Retreat": "/images/snowpeak-retreat.png",
    "Himalayan Vista Resort": "/images/himalayan-vista-resort.png"
};

const destinations = [
    {
        name: "Mumbai",
        subtitle: "City escapes",
        image: "photo-1570168007204-dfb528c6958f"
    },
    {
        name: "Goa",
        subtitle: "Coastal retreats",
        image: "photo-1512343879784-a960bf40e7f2"
    },
    {
        name: "Jaipur",
        subtitle: "Royal experiences",
        image: "photo-1599661046827-dacff0c0f09a"
    },
    {
        name: "Manali",
        subtitle: "Mountain hideaways",
        image: "photo-1626621341517-bbf3d9990a23"
    }
];

function imageUrl(id, width = 900) {
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

export default function Home() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLocation, setSearchLocation] = useState("");

    const [selectedDates, setSelectedDates] = useState({
        checkIn: "",
        checkOut: ""
    });

    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    // Load all hotels when homepage opens
    useEffect(() => {
        getHotels()
            .then(enrichHotels)
            .then(setHotels)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Load room information and prices for every hotel
    async function enrichHotels(hotelList) {
        return Promise.all(
            hotelList.map(async (hotel) => {
                try {
                    const response = await fetch(
                        `http://localhost:8080/api/hotels/${hotel.id}/rooms`
                    );

                    if (!response.ok) {
                        return { ...hotel, roomTypes: [] };
                    }

                    const roomTypes = await response.json();

                    return { ...hotel, roomTypes };

                } catch (error) {
                    console.error(
                        `Unable to load rooms for ${hotel.name}`,
                        error
                    );

                    return { ...hotel, roomTypes: [] };
                }
            })
        );
    }

    // Search hotels by destination and date availability
    async function handleSearch({ location, checkIn, checkOut }) {

        if (!location || !location.trim()) {
            alert("Please enter a destination.");
            return;
        }

        if (!checkIn || !checkOut) {
            alert("Please select check-in and check-out dates.");
            return;
        }

        if (checkIn >= checkOut) {
            alert("Check-out must be after check-in.");
            return;
        }

        // Get today's date in local YYYY-MM-DD format
        const today = new Date();
        const todayString =
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        if (checkIn < todayString) {
            alert("Check-in date cannot be in the past.");
            return;
        }

        setSearchLocation(location.trim());

        setSelectedDates({
            checkIn,
            checkOut
        });

        setHasSearched(true);
        setLoading(true);

        try {
            const results = await searchAvailableHotels(
                location.trim(),
                checkIn,
                checkOut
            );

            const enrichedResults = await enrichHotels(results);

            setHotels(enrichedResults);

        } catch (error) {
            console.error("Hotel availability search failed:", error);

            setHotels([]);

            alert(
                error.message || "Unable to search available hotels."
            );

        } finally {
            setLoading(false);
        }

        // Scroll to search results
        document.getElementById("hotels")?.scrollIntoView({
            behavior: "smooth"
        });
    }

    // Filter hotels by selected destination
    const visibleHotels = hotels.filter((hotel) =>
        hotel.location?.toLowerCase().includes(
            searchLocation.toLowerCase()
        )
    );

    return (
        <div className="app-shell">

            <Navbar />

            <main>

                {/* HERO SECTION */}
                <section className="hero">

                    <div className="hero-image" />

                    <div className="hero-content">

                        <span className="eyebrow">
                            <Sparkles size={14} />
                            YOUR NEXT CHAPTER STARTS HERE
                        </span>

                        <h1>
                            Find your place
                            <br />
                            <em>in the world.</em>
                        </h1>

                        <p>
                            Thoughtfully chosen stays for journeys
                            you'll remember forever.
                        </p>

                    </div>

                    <div className="hero-search">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <span className="hero-caption">
                        CURATED STAYS. EXTRAORDINARY EXPERIENCES.
                    </span>

                </section>

                {/* DESTINATIONS SECTION - HIDDEN AFTER SEARCH */}
                {!hasSearched && (
                    <section
                        className="section destinations"
                        id="destinations"
                    >

                        <div className="section-heading">

                            <div>
                                <span className="eyebrow dark">
                                    EXPLORE THE UNEXPECTED
                                </span>

                                <h2>
                                    Somewhere worth <em>going.</em>
                                </h2>
                            </div>

                            <span className="muted">
                                A little inspiration for your next escape.
                            </span>

                        </div>

                        <div className="destination-grid">

                            {destinations.map((destination) => (

                                <button
                                    className="destination-card"
                                    key={destination.name}
                                    onClick={() => {
                                        setSearchLocation(destination.name);

                                        document.getElementById("hotels")?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                    }}
                                >

                                    <img
                                        src={imageUrl(destination.image)}
                                        alt={destination.name}
                                    />

                                    <div className="destination-overlay">
                                        <span>{destination.subtitle}</span>
                                        <h3>{destination.name}</h3>
                                    </div>

                                    <span className="destination-arrow">
                                        <ArrowRight size={18} />
                                    </span>

                                </button>

                            ))}

                        </div>

                    </section>
                )}

                {/* HOTEL COLLECTION / SEARCH RESULTS */}
                <section
                    className="section hotels-section"
                    id="hotels"
                >

                    <div className="section-heading">

                        <div>

                            <span className="eyebrow dark">
                                {hasSearched
                                    ? "YOUR SEARCH RESULTS"
                                    : "HANDPICKED FOR YOU"}
                            </span>

                            <h2>
                                {hasSearched ? (
                                    <>
                                        Available stays in{" "}
                                        <em>{searchLocation}.</em>
                                    </>
                                ) : (
                                    <>
                                        Stay somewhere <em>special.</em>
                                    </>
                                )}
                            </h2>

                        </div>

                        <span className="muted">
                            {hasSearched
                                ? `${visibleHotels.length} available stays`
                                : `${visibleHotels.length} places to discover`}
                        </span>

                    </div>

                    {/* LOADING */}
                    {loading ? (

                        <p className="muted">
                            Finding beautiful places to stay...
                        </p>

                    ) : visibleHotels.length === 0 ? (

                        /* NO RESULTS */
                        <p className="muted">
                            {hasSearched
                                ? "No hotels available for this destination and selected dates. Try different dates."
                                : "No hotels found. Please try again."}
                        </p>

                    ) : (

                        /* HOTEL CARDS */
                        <div className="hotel-grid">

                            {visibleHotels.map((hotel) => (

                                <article
                                    className="hotel-card"
                                    key={hotel.id}
                                    onClick={() =>
                                        navigate(`/hotels/${hotel.id}`, {
                                            state: {
                                                checkIn: selectedDates.checkIn,
                                                checkOut: selectedDates.checkOut
                                            }
                                        })
                                    }
                                    style={{ cursor: "pointer" }}
                                >

                                    {/* HOTEL IMAGE */}
                                    <div className="hotel-image">

                                        <img
                                            src={
                                                hotelImages[hotel.name]?.startsWith("/")
                                                    ? hotelImages[hotel.name]
                                                    : imageUrl(
                                                        hotelImages[hotel.name] ||
                                                        "photo-1566073771259-6a8506099945",
                                                        700
                                                    )
                                            }
                                            alt={`${hotel.name} hotel`}
                                            loading="lazy"
                                        />

                                        <span className="hotel-tag">
                                            CURATED STAY
                                        </span>

                                    </div>

                                    {/* HOTEL INFORMATION */}
                                    <div className="hotel-info">

                                        <span className="hotel-location">
                                            {hotel.location}
                                        </span>

                                        <h3>{hotel.name}</h3>

                                        <p>{hotel.description}</p>

                                        <div className="hotel-bottom">

                                            <span>

                                                <strong>
                                                    ₹{Number(
                                                        hotel.roomTypes?.[0]?.pricePerNight || 0
                                                    ).toLocaleString("en-IN")}
                                                </strong>

                                                <small> / night</small>

                                            </span>

                                            <span className="hotel-rating">

                                                <Star
                                                    size={15}
                                                    fill="currentColor"
                                                />

                                                Guest favourite

                                            </span>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </main>

            {/* FOOTER */}
            <footer className="footer">

                <a href="/" className="brand">
                    tripzy<span className="brand-dot">.</span>
                </a>

                <p>Made for the journeys that matter.</p>

                <span>© 2026 Tripzy. Discover more.</span>

            </footer>

        </div>
    );
}
