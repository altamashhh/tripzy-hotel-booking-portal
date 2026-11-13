
import { useState } from "react";
import { Search, CalendarDays, MapPin, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:8080/api";

export default function MyBookings() {
    const [reference, setReference] = useState("");
    const [email, setEmail] = useState("");
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function findBooking(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setBooking(null);

        try {
            const response = await fetch(
                `${API_URL}/bookings/${encodeURIComponent(reference.trim())}?guestEmail=${encodeURIComponent(email.trim())}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Booking not found.");
            }

            setBooking(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function cancelBooking() {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/bookings/${encodeURIComponent(reference.trim())}/cancel?guestEmail=${encodeURIComponent(email.trim())}`,
                { method: "PUT" }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Cancellation failed.");
            }

            setBooking(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app-shell">
            <Navbar />

            <main className="my-bookings-page">
                <span className="eyebrow dark">YOUR JOURNEY, YOUR WAY</span>
                <h1>Manage your <em>booking.</em></h1>
                <p>Enter your booking reference and email to view your reservation.</p>

                <form className="lookup-form" onSubmit={findBooking}>
                    <label>Booking reference</label>
                    <input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g. TRP-3A197BA4FE"
                        required
                    />

                    <label>Guest email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter the email used for booking"
                        required
                    />

                    <button className="search-button" disabled={loading}>
                        <Search size={17} />
                        {loading ? "Please wait..." : "Find my booking"}
                    </button>
                </form>

                {error && <p className="booking-error">{error}</p>}

                {booking && (
                    <section className="booking-result">
                        <div className="result-heading">
                            <div>
                                <span className="eyebrow dark">RESERVATION DETAILS</span>
                                <h2>{booking.hotelName}</h2>
                                <p>{booking.roomCategory}</p>
                            </div>

                            <span className={`status-pill ${booking.status.toLowerCase()}`}>
                                {booking.status}
                            </span>
                        </div>

                        <div className="result-reference">
                            <small>BOOKING REFERENCE</small>
                            <strong>{booking.bookingReference}</strong>
                        </div>

                        <div className="result-details">
                            <div>
                                <CalendarDays />
                                <span>Check-in</span>
                                <strong>{booking.checkInDate}</strong>
                            </div>

                            <div>
                                <CalendarDays />
                                <span>Check-out</span>
                                <strong>{booking.checkOutDate}</strong>
                            </div>

                            <div>
                                <MapPin />
                                <span>Guest</span>
                                <strong>{booking.guestName}</strong>
                            </div>
                        </div>

                        <div className="result-total">
                            <span>Total amount</span>
                            <strong>
                                ₹{Number(booking.totalAmount).toLocaleString("en-IN")}
                            </strong>
                        </div>

                        {booking.status === "CONFIRMED" && (
                            <button
                                className="cancel-booking-button"
                                onClick={cancelBooking}
                                disabled={loading}
                            >
                                <XCircle size={17} />
                                Cancel reservation
                            </button>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
