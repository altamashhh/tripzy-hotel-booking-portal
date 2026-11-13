
import { useEffect, useState } from "react";
import {
    useParams,
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    UserRound,
    ShieldCheck,
    CheckCircle2,
    BedDouble
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getHotels, getHotelRooms } from "../services/api";

const API_URL = "http://localhost:8080/api";

// Get today's date in local YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function Booking() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Receive dates from HotelDetails page
    const {
        checkIn = "",
        checkOut = ""
    } = location.state || {};

    const [room, setRoom] = useState(null);
    const [hotel, setHotel] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [confirmation, setConfirmation] = useState(null);

    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    // Automatically populate dates from previous page
    const [checkInDate, setCheckInDate] = useState(checkIn);
    const [checkOutDate, setCheckOutDate] = useState(checkOut);

    // Load selected room and its hotel
    useEffect(() => {
        async function loadRoom() {
            try {
                const hotels = await getHotels();

                for (const item of hotels) {
                    const rooms = await getHotelRooms(item.id);

                    const selected = rooms.find(
                        (r) => String(r.id) === String(roomId)
                    );

                    if (selected) {
                        setHotel(item);
                        setRoom(selected);
                        return;
                    }
                }

                throw new Error("Selected room could not be found.");

            } catch (err) {
                setError(err.message || "Unable to load room details.");

            } finally {
                setLoading(false);
            }
        }

        loadRoom();

    }, [roomId]);

    // Calculate number of nights
    const nights =
        checkInDate && checkOutDate &&
            checkOutDate > checkInDate
            ? Math.round(
                (new Date(`${checkOutDate}T00:00:00`) -
                    new Date(`${checkInDate}T00:00:00`)) /
                (1000 * 60 * 60 * 24)
            )
            : 0;

    // Estimated total for display
    const totalAmount = room
        ? Number(room.pricePerNight) * nights
        : 0;

    // Submit booking
    async function handleBooking(event) {
        event.preventDefault();

        if (submitting) return;

        setError("");

        // Validate guest information
        if (!guestName.trim() || !guestEmail.trim()) {
            setError("Please enter your name and email.");
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(guestEmail.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        // Validate dates
        if (!checkInDate || !checkOutDate) {
            setError("Please select your check-in and check-out dates.");
            return;
        }

        if (checkInDate < getTodayDate()) {
            setError("Check-in date cannot be in the past.");
            return;
        }

        if (checkOutDate <= checkInDate) {
            setError("Check-out must be after check-in.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    guestName: guestName.trim(),
                    guestEmail: guestEmail.trim(),
                    roomTypeId: Number(roomId),
                    checkInDate,
                    checkOutDate
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Booking failed. Please try again."
                );
            }

            setConfirmation(data);

        } catch (err) {
            setError(
                err.message || "Unable to complete your booking."
            );

        } finally {
            setSubmitting(false);
        }
    }

    // Loading screen
    if (loading) {
        return (
            <p className="page-message">
                Preparing your reservation...
            </p>
        );
    }

    // Error screen
    if (error && !room) {
        return (
            <div className="app-shell">
                <Navbar />
                <p className="page-message">{error}</p>
            </div>
        );
    }

    if (!room || !hotel) {
        return (
            <p className="page-message">
                Room not found.
            </p>
        );
    }

    // BOOKING CONFIRMATION
    if (confirmation) {
        return (
            <div className="app-shell">

                <Navbar />

                <main className="confirmation-page">

                    <div className="confirmation-card">

                        <CheckCircle2 size={58} />

                        <span className="eyebrow dark">
                            RESERVATION CONFIRMED
                        </span>

                        <h1>
                            Your journey is <em>booked.</em>
                        </h1>

                        <p>
                            Thank you, {confirmation.guestName}.
                            Your reservation has been confirmed.
                        </p>

                        <div className="booking-reference">

                            <small>YOUR BOOKING REFERENCE</small>

                            <strong>
                                {confirmation.bookingReference}
                            </strong>

                        </div>

                        <div className="confirmation-details">

                            <span>{confirmation.hotelName}</span>

                            <span>{confirmation.roomCategory}</span>

                            <span>
                                {confirmation.checkInDate}
                                {" — "}
                                {confirmation.checkOutDate}
                            </span>

                            <strong>
                                ₹{Number(
                                    confirmation.totalAmount
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                        <button
                            className="search-button confirmation-button"
                            onClick={() => navigate("/my-bookings")}
                        >
                            Manage my booking
                        </button>

                        <button
                            className="back-button"
                            onClick={() => navigate("/")}
                        >
                            Back to home
                        </button>

                    </div>

                </main>

            </div>
        );
    }

    // BOOKING FORM
    return (
        <div className="app-shell">

            <Navbar />

            <main className="booking-container">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(`/hotels/${hotel.id}`, {
                            state: {
                                checkIn: checkInDate,
                                checkOut: checkOutDate
                            }
                        })
                    }
                >
                    <ArrowLeft size={17} />
                    Back to hotel
                </button>

                <div className="booking-heading">

                    <span className="eyebrow dark">
                        ALMOST THERE
                    </span>

                    <h1>
                        Make it <em>official.</em>
                    </h1>

                    <p>
                        A few details stand between you and your next escape.
                    </p>

                </div>

                <div className="booking-layout">

                    {/* BOOKING FORM */}
                    <form
                        className="booking-form"
                        onSubmit={handleBooking}
                    >

                        {/* GUEST INFORMATION */}
                        <section className="booking-form-section">

                            <h2>
                                <UserRound />
                                Guest information
                            </h2>

                            <label>Full name</label>

                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) =>
                                    setGuestName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                            />

                            <label>Email address</label>

                            <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) =>
                                    setGuestEmail(e.target.value)
                                }
                                placeholder="Enter your email address"
                                required
                            />

                        </section>

                        {/* TRAVEL DATES */}
                        <section className="booking-form-section">

                            <h2>
                                <CalendarDays />
                                Your travel dates
                            </h2>

                            <label>Check-in</label>

                            <input
                                type="date"
                                min={getTodayDate()}
                                value={checkInDate}
                                onChange={(e) =>
                                    setCheckInDate(e.target.value)
                                }
                                required
                            />

                            <label>Check-out</label>

                            <input
                                type="date"
                                min={checkInDate || getTodayDate()}
                                value={checkOutDate}
                                onChange={(e) =>
                                    setCheckOutDate(e.target.value)
                                }
                                required
                            />

                        </section>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <p className="booking-error">
                                {error}
                            </p>
                        )}

                        {/* CONFIRM BOOKING */}
                        <button
                            type="submit"
                            className="search-button confirm-booking-button"
                            disabled={submitting || nights <= 0}
                        >
                            {submitting
                                ? "Confirming..."
                                : "Confirm reservation"}
                        </button>

                        <p className="secure-note">

                            <ShieldCheck size={16} />

                            Your booking details are securely processed.

                        </p>

                    </form>

                    {/* PRICE SUMMARY */}
                    <aside className="booking-summary">

                        <span className="eyebrow dark">
                            YOUR STAY
                        </span>

                        <div className="summary-hotel">

                            <BedDouble size={23} />

                            <div>
                                <h3>{hotel.name}</h3>
                                <p>{hotel.location}</p>
                            </div>

                        </div>

                        <h3>{room.category}</h3>

                        <p>{room.description}</p>

                        <div className="price-line">

                            <span>Price per night</span>

                            <strong>
                                ₹{Number(
                                    room.pricePerNight
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                        <div className="price-line">

                            <span>Number of nights</span>

                            <strong>{nights}</strong>

                        </div>

                        <div className="price-total">

                            <span>Total amount</span>

                            <strong>
                                ₹{totalAmount.toLocaleString("en-IN")}
                            </strong>

                        </div>

                        <small>
                            Final amount calculated by the booking server.
                        </small>

                    </aside>

                </div>

            </main>

        </div>
    );
}
