
import { MapPin, Menu, UserRound } from "lucide-react";

export default function Navbar() {
    return (
        <header className="navbar">
            <a href="/" className="brand">
                <span className="brand-icon">T</span>
                tripzy<span className="brand-dot">.</span>
            </a>

            <nav className="nav-links">
                <a href="/">Discover</a>
                <a href="#destinations">Destinations</a>
                <a href="#hotels">Hotels</a>
                <a href="/recommendations">Smart Stays</a>
            </nav>

            <div className="nav-actions">
                <a href="/my-bookings" className="my-bookings">
                    My Bookings
                </a>
                <button className="profile-button" aria-label="Profile">
                    <UserRound size={18} />
                </button>
                <button className="mobile-menu" aria-label="Menu">
                    <Menu size={21} />
                </button>
            </div>
        </header>
    );
}
