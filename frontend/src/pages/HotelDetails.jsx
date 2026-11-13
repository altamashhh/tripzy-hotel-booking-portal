
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Wifi,
    Waves,
    Car,
    Utensils,
    Wind,
    BedDouble,
    Users,
    Sparkles
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getHotelRooms } from "../services/api";

const API_URL = "http://localhost:8080/api";

// Representative hotel photographs for our demo properties.
// These are not verified photographs of the fictional hotels.

const hotelGalleries = {
    "Seabreeze Residency": [
        { label: "Hotel exterior", image: "photo-1566073771259-6a8506099945" },
        { label: "Deluxe bedroom", image: "photo-1611892440504-42a792e24d32" },
        { label: "Premium bedroom", image: "photo-1590490360182-c33d57733427" },
        { label: "Swimming pool", image: "photo-1571896349842-33c89424de2d" },
        { label: "Hotel reception", image: "photo-1566665797739-1674de7a421a" },
        { label: "Restaurant", image: "photo-1414235077428-338989a2e8c0" }
    ],

    "The Marine Crown": [
        { label: "Luxury hotel exterior", image: "photo-1566073771259-6a8506099945" },
        { label: "Premium ocean-view suite", image: "photo-1611892440504-42a792e24d32" },
        { label: "Elegant luxury bedroom", image: "photo-1618221195710-dd6b41faaea6" },
        { label: "Luxury swimming pool", image: "photo-1571896349842-33c89424de2d" }
    ],

    "Harbour View Suites": [
        { label: "Modern city hotel", image: "photo-1566665797739-1674de7a421a" },
        { label: "Comfortable standard room", image: "photo-1595576508898-0ad5c879a061" },
        { label: "Contemporary bedroom", image: "photo-1578683010236-d716f9a3f461" },
        { label: "Hotel lounge", image: "photo-1497366754035-f200968a6e72" }
    ],

    "Palm Grove Retreat": [
        { label: "Tropical resort", image: "photo-1512343879784-a960bf40e7f2" },
        { label: "Garden bedroom", image: "photo-1578683010236-d716f9a3f461" },
        { label: "Luxury suite", image: "photo-1618221195710-dd6b41faaea6" },
        { label: "Resort swimming pool", image: "photo-1576013551627-0cc20b96c2a7" },
        { label: "Resort lobby", image: "photo-1564501049412-61c2a3083791" },
        { label: "Outdoor dining", image: "photo-1517248135467-4c7edcad34c4" }
    ],

    "Azure Sands Resort": [
        { label: "Luxury tropical resort", image: "photo-1571896349842-33c89424de2d" },
        { label: "Premium resort suite", image: "photo-1618221195710-dd6b41faaea6" },
        { label: "Infinity pool experience", image: "photo-1576013551627-0cc20b96c2a7" },
        { label: "Elegant outdoor dining", image: "photo-1517248135467-4c7edcad34c4" }
    ],

    "Coconut Bay Retreat": [
        { label: "Tropical budget retreat", image: "photo-1512343879784-a960bf40e7f2" },
        { label: "Simple comfortable bedroom", image: "photo-1611892440504-42a792e24d32" },
        { label: "Relaxing garden stay", image: "photo-1578683010236-d716f9a3f461" },
        { label: "Casual dining area", image: "photo-1514933651103-005eec06c04b" }
    ],

    "Aravali Grand Stay": [
        { label: "Heritage property", image: "photo-1599661046827-dacff0c0f09a" },
        { label: "Heritage bedroom", image: "photo-1564078516393-cf04bd966897" },
        { label: "Royal suite", image: "photo-1613977257363-707ba9348227" },
        { label: "Poolside", image: "photo-1575429198097-0414ec08e8cd" },
        { label: "Grand reception", image: "photo-1600210492486-724fe5c67fb0" },
        { label: "Fine dining", image: "photo-1559339352-11d035aa65de" }
    ],

    "Rajputana Palace": [
        { label: "Royal heritage palace", image: "photo-1599661046827-dacff0c0f09a" },
        { label: "Royal luxury suite", image: "photo-1613977257363-707ba9348227" },
        { label: "Palace-inspired interior", image: "photo-1600210492486-724fe5c67fb0" },
        { label: "Luxury poolside", image: "photo-1575429198097-0414ec08e8cd" }
    ],

    "Pink City Heritage Inn": [
        { label: "Traditional heritage building", image: "photo-1599661046827-dacff0c0f09a" },
        { label: "Simple heritage bedroom", image: "photo-1564078516393-cf04bd966897" },
        { label: "Traditional room interior", image: "photo-1590490360182-c33d57733427" },
        { label: "Cozy guest lounge", image: "photo-1564501049412-61c2a3083791" }
    ],

    "Urban Nest Suites": [
        { label: "Modern hotel", image: "photo-1564013799919-ab600027ffc6" },
        { label: "Executive bedroom", image: "photo-1595576508898-0ad5c879a061" },
        { label: "Business suite", image: "photo-1601918774946-25832a4be0d6" },
        { label: "Swimming pool", image: "photo-1575429198097-0414ec08e8cd" },
        { label: "Modern lobby", image: "photo-1497366754035-f200968a6e72" },
        { label: "Dining lounge", image: "photo-1514933651103-005eec06c04b" }
    ],

    "Silicon Garden Hotel": [
        { label: "Premium modern hotel", image: "photo-1566073771259-6a8506099945" },
        { label: "Executive luxury suite", image: "photo-1601918774946-25832a4be0d6" },
        { label: "Contemporary bedroom", image: "photo-1611892440504-42a792e24d32" },
        { label: "Business lounge", image: "photo-1497366754035-f200968a6e72" }
    ],

    "The Orchid Residency": [
        { label: "Modern budget property", image: "photo-1566665797739-1674de7a421a" },
        { label: "Compact standard room", image: "photo-1595576508898-0ad5c879a061" },
        { label: "Comfortable guest bedroom", image: "photo-1578683010236-d716f9a3f461" },
        { label: "Simple dining space", image: "photo-1514933651103-005eec06c04b" }
    ],

    "Pinecrest Mountain Lodge": [
        { label: "Mountain property", image: "photo-1626621341517-bbf3d9990a23" },
        { label: "Mountain bedroom", image: "photo-1510798831971-661eb04b3739" },
        { label: "Wooden suite", image: "photo-1449158743715-0a90ebb6d2d8" },
        { label: "Mountain view", image: "photo-1464822759023-fed622ff2c3b" },
        { label: "Lodge interior", image: "photo-1600210492486-724fe5c67fb0" },
        { label: "Restaurant", image: "photo-1517248135467-4c7edcad34c4" }
    ],

    "Snowpeak Retreat": [
        { label: "Premium mountain resort", image: "photo-1626621341517-bbf3d9990a23" },
        { label: "Luxury mountain suite", image: "photo-1510798831971-661eb04b3739" },
        { label: "Panoramic mountain scenery", image: "photo-1464822759023-fed622ff2c3b" },
        { label: "Premium wooden interiors", image: "photo-1600210492486-724fe5c67fb0" }
    ],

    "Himalayan Vista Resort": [
        { label: "Mountain budget retreat", image: "photo-1626621341517-bbf3d9990a23" },
        { label: "Cozy mountain bedroom", image: "photo-1510798831971-661eb04b3739" },
        { label: "Rustic wooden room", image: "photo-1590490360182-c33d57733427" },
        { label: "Mountain landscape", image: "photo-1464822759023-fed622ff2c3b" }
    ]
};

function imageUrl(id, width = 1000) {
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

export default function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Dates passed from the homepage
    const { checkIn, checkOut } = location.state || {};

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load hotel and room information
    useEffect(() => {
        async function loadHotel() {
            try {
                const [hotelResponse, roomData] = await Promise.all([
                    fetch(`${API_URL}/hotels/${id}`),
                    getHotelRooms(id)
                ]);

                if (!hotelResponse.ok) {
                    throw new Error("Hotel not found");
                }

                const hotelData = await hotelResponse.json();

                setHotel(hotelData);
                setRooms(roomData);

            } catch (err) {
                setError(err.message || "Unable to load hotel details");

            } finally {
                setLoading(false);
            }
        }

        loadHotel();
    }, [id]);

    if (loading) {
        return <p className="page-message">Loading hotel details...</p>;
    }

    if (error || !hotel) {
        return <p className="page-message">{error || "Hotel not found"}</p>;
    }

    const gallery = hotelGalleries[hotel.name] || [];

    const amenityIcons = {
        wifi: <Wifi />,
        ac: <Wind />,
        "swimming pool": <Waves />,
        parking: <Car />,
        restaurant: <Utensils />
    };

    return (
        <div className="app-shell">

            <Navbar />

            <main className="details-container">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={17} /> Back to hotels
                </button>

                {/* HOTEL HEADING */}
                <div className="details-heading">

                    <span className="eyebrow dark">
                        DISCOVER YOUR NEXT STAY
                    </span>

                    <h1>{hotel.name}</h1>

                    <p>
                        <MapPin size={16} /> {hotel.location}
                    </p>

                    {/* SELECTED STAY DATES */}
                    {checkIn && checkOut && (
                        <div className="selected-stay-dates">

                            <span>
                                Check-in: <strong>{checkIn}</strong>
                            </span>

                            <span>
                                Check-out: <strong>{checkOut}</strong>
                            </span>

                        </div>
                    )}

                </div>

                {/* HOTEL GALLERY */}
                <div className="details-gallery">

                    {gallery.length > 0 ? (

                        gallery.map((item, index) => (

                            <div
                                className="gallery-item"
                                key={item.label}
                            >

                                <img
                                    src={imageUrl(item.image, 1000)}
                                    alt={`${hotel.name} - ${item.label}`}
                                    loading={index === 0 ? "eager" : "lazy"}
                                />

                                <span className="gallery-caption">
                                    {item.label}
                                </span>

                            </div>

                        ))

                    ) : (

                        <p>Property photographs coming soon.</p>

                    )}

                </div>

                {/* HOTEL DETAILS AND ROOM TYPES */}
                <section className="details-section">

                    {/* PROPERTY INFORMATION */}
                    <div>

                        <span className="eyebrow dark">
                            ABOUT THIS PROPERTY
                        </span>

                        <h2>
                            A stay to <em>remember.</em>
                        </h2>

                        <p>{hotel.description}</p>

                        <h3>What this place offers</h3>

                        <div className="amenities-grid">

                            {hotel.amenities?.map((amenity) => (

                                <div
                                    className="amenity-item"
                                    key={amenity}
                                >

                                    {amenityIcons[amenity.toLowerCase()] || <Sparkles />}

                                    <span>{amenity}</span>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* ROOM SELECTION */}
                    <aside className="room-panel">

                        <span className="eyebrow dark">
                            AVAILABLE ROOM TYPES
                        </span>

                        <h2>
                            Choose your <em>stay.</em>
                        </h2>

                        {rooms.length === 0 ? (

                            <p>No room types are currently available.</p>

                        ) : (

                            rooms.map((room) => (

                                <div className="room-card" key={room.id}>

                                    <BedDouble size={22} />

                                    <h3>{room.category}</h3>

                                    <p>{room.description}</p>

                                    <div className="room-capacity">
                                        <Users size={15} />
                                        Up to {room.capacity} guests
                                    </div>

                                    <strong>
                                        ₹{Number(room.pricePerNight).toLocaleString("en-IN")}
                                        <small> / night</small>
                                    </strong>

                                    <button
                                        className="search-button room-book-button"
                                        onClick={() =>
                                            navigate(`/book/${room.id}`, {
                                                state: {
                                                    checkIn,
                                                    checkOut
                                                }
                                            })
                                        }
                                    >
                                        Select room <ArrowLeft size={16} />
                                    </button>

                                </div>

                            ))

                        )}

                    </aside>

                </section>

            </main>

        </div>
    );
}
