# Tripzy -- Hotel Booking Portal

Tripzy is a full-stack hotel booking portal created for the Thomas Cook
Full Stack Fresher interview assignment. It supports hotel discovery,
destination and date-based search, property details, room selection,
booking, booking retrieval, cancellation, and a rule-based Smart Stay
Recommendation Engine.

## Technology stack

-   Frontend: React, Vite, React Router, JavaScript, lucide-react
-   Backend: Java 21, Spring Boot, Maven
-   Database: MySQL 8
-   Communication: REST APIs with JSON

## Features

-   Browse hotels with location, description, amenities, and room
    prices.
-   Search hotels by destination, check-in, and check-out dates.
-   View hotel details, galleries, amenities, and room categories.
-   Book one room using guest name and email.
-   Display an estimated total and calculate the authoritative amount on
    the backend.
-   Generate a unique booking reference.
-   Retrieve a booking using reference and guest email.
-   Cancel a booking; cancelled bookings no longer consume availability.
-   Validate booking dates and room inventory.
-   Recommend rooms based on destination, budget, trip purpose,
    traveller type, and stay preference.

## Project structure

``` text
Tripzy/
├── backend/
│   ├── src/main/java/com/tripzy/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── README.md
└── DESIGN.md
```

## Prerequisites

-   JDK 21
-   Maven 3.9+
-   MySQL 8
-   Node.js 20+ and npm
-   Git

## Database setup

1.  Start MySQL.
2.  Create the database:

``` sql
CREATE DATABASE tripzy_db;
```

3.  Create a local database user (or use an existing local user):

``` sql
CREATE USER 'tripzy_app'@'localhost' IDENTIFIED BY 'YOUR_LOCAL_PASSWORD';
GRANT ALL PRIVILEGES ON tripzy_db.* TO 'tripzy_app'@'localhost';
FLUSH PRIVILEGES;
```

4.  Configure `backend/src/main/resources/application.properties`. The
    development setup used MySQL port `3307`; change it if your local
    server uses another port.

Example:

``` properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3307/tripzy_db
spring.datasource.username=tripzy_app
spring.datasource.password=${TRIPZY_DB_PASSWORD}
```

Set the password in the environment; do not commit it.

Windows PowerShell:

``` powershell
$env:TRIPZY_DB_PASSWORD = "YOUR_LOCAL_PASSWORD"
```

macOS/Linux:

``` bash
export TRIPZY_DB_PASSWORD="YOUR_LOCAL_PASSWORD"
```

Check that the URL, username, and environment-variable name match your
local configuration.

### Sample data

The backend includes a data initializer for sample hotels and room
categories. The current sample dataset contains 15 hotels across Mumbai,
Goa, Jaipur, Bengaluru, and Manali. Check the initializer and existing
database before manually inserting data to avoid duplicates.

## Run the backend

From the project root:

``` bash
cd backend
mvn clean test
mvn spring-boot:run
```

Backend base URL: `http://localhost:8080`

## Run the frontend

Open a second terminal:

``` bash
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally
`http://localhost:5173`).

The frontend currently calls `http://localhost:8080/api`. If the backend
host or port changes, update the API base URL in
`frontend/src/services/api.js` and any page-level API constants.

## Main API endpoints

  ----------------------------------------------------------------------------------------------------------------------------------------------
  Method                  Endpoint                                                                                       Purpose
  ----------------------- ---------------------------------------------------------------------------------------------- -----------------------
  GET                     `/api/hotels`                                                                                  List active hotels

  GET                     `/api/hotels/{id}`                                                                             Retrieve an active
                                                                                                                         hotel

  GET                     `/api/hotels/search?location={location}`                                                       Search hotels by
                                                                                                                         location

  GET                     `/api/hotels/{id}/rooms`                                                                       Retrieve active room
                                                                                                                         categories

  GET                     `/api/hotels/search/availability?location={location}&checkInDate={date}&checkOutDate={date}`   Find hotels with
                                                                                                                         availability for the
                                                                                                                         requested stay

  POST                    `/api/bookings`                                                                                Create a booking

  GET                     `/api/bookings/{reference}?guestEmail={email}`                                                 Retrieve a booking
                                                                                                                         after email
                                                                                                                         verification

  PUT                     `/api/bookings/{reference}/cancel?guestEmail={email}`                                          Cancel a booking after
                                                                                                                         email verification

  GET                     `/api/recommendations`                                                                         Get room
                                                                                                                         recommendations using
                                                                                                                         preference query
                                                                                                                         parameters
  ----------------------------------------------------------------------------------------------------------------------------------------------

Example booking request:

``` json
{
  "guestName": "Test Guest",
  "guestEmail": "test@example.com",
  "roomTypeId": 1,
  "checkInDate": "2026-11-20",
  "checkOutDate": "2026-11-23"
}
```

The backend calculates the persisted total using the database room price
and number of nights. The frontend total is only an estimate.

## Main user flow

1.  Search for a destination and select check-in/check-out dates.
2.  Review hotels returned by the availability search.
3.  Open a hotel and select a room category.
4.  Enter guest name and email; selected dates are carried to the
    booking form.
5.  Review the estimated total and confirm.
6.  Save the generated booking reference.
7.  Use My Bookings with the reference and email to retrieve or cancel
    the booking.

## Smart Stay Recommendation Engine

The surprise feature is a rule-based recommendation engine. It filters
and ranks room options using destination, maximum budget, guest
capacity, trip purpose, traveller type, and stay preference. It is not a
trained machine-learning model. The rules are deterministic and intended
to provide understandable preference-based suggestions.

## Testing and verification

The backend has been run using:

``` bash
mvn clean test
```

The main flow has also been manually exercised during development,
including hotel availability search, booking creation and confirmation,
booking retrieval, and cancellation.

Before submission, run the tests again from a clean checkout. Confirm
that automated tests meaningfully cover booking amount calculation, date
validation, overlapping availability, and cancellation. A successful
build alone does not prove that every scenario has automated test
coverage.

## Screenshots / demo

Add screenshots or a short recording of: 1. Homepage and destination
search. 2. Availability search results. 3. Hotel details and room
selection. 4. Booking form and price summary. 5. Booking confirmation
and reference. 6. Booking retrieval and cancellation. 7. Smart Stay
recommendations.

Suggested folder: `docs/screenshots/`. Update this section with actual
filenames or a demo link after adding them.

## Security

-   Do not commit database passwords, API keys, or other secrets.
-   Use environment variables for local credentials.
-   Keep local secret files and IDE-specific files out of the public
    repository.
-   Authentication, payment processing, admin panel, and cloud
    deployment are outside this assignment's required scope.

## Development effort and disclosure

-   **Approximate development time:** 13hr
-   **Unfinished items / known limitations:** \[Automated test coverage for edge cases such as simultaneous booking attempts and complex overlapping reservations could be expanded.

The recommendation engine uses rule-based scoring rather than a trained machine-learning model.

The application uses sample hotel data and is intended as an internship assessment prototype.

Authentication, payment integration, and an admin panel have not been implemented, as they were outside the assignment scope.\]
-   **AI assistance disclosure:** AI tools were used for development
    support, including planning, code review, debugging guidance, and
    documentation drafting. The developer is responsible for reviewing
    and understanding the submitted implementation and should be able to
    explain its design and code during the interview.

## Repository

Public GitHub repository: https://github.com/altamashhh/tripzy-hotel-booking-portal

The repository must remain public as required by the assignment.
