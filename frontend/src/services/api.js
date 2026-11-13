
const API_BASE_URL = "http://localhost:8080/api";

export async function getHotels() {
    const response = await fetch(`${API_BASE_URL}/hotels`);

    if (!response.ok) {
        throw new Error("Unable to fetch hotels");
    }

    return response.json();
}

export async function searchHotels(location) {
    const response = await fetch(
        `${API_BASE_URL}/hotels/search?location=${encodeURIComponent(location)}`
    );

    if (!response.ok) {
        throw new Error("Hotel search failed");
    }

    return response.json();
}

export async function getHotelRooms(hotelId) {
    const response = await fetch(
        `${API_BASE_URL}/hotels/${hotelId}/rooms`
    );

    if (!response.ok) {
        throw new Error("Unable to fetch room details");
    }

    return response.json();
}

// Search hotels by location and date availability
export async function searchAvailableHotels(
    location,
    checkInDate,
    checkOutDate
) {
    const params = new URLSearchParams({
        location,
        checkInDate,
        checkOutDate
    });

    const response = await fetch(
        `${API_BASE_URL}/hotels/search/availability?${params.toString()}`
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(
            error?.message || "Unable to find available hotels"
        );
    }

    return response.json();
}
