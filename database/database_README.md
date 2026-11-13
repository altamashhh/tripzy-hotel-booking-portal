# Tripzy Database Setup

This folder contains database setup guidance for the Tripzy hotel
booking portal.

## 1. Database details

The current local development configuration uses:

  Setting           Value
  ----------------- ---------------------------------------
  Database          `tripzy_db`
  Database server   MySQL
  Host              `127.0.0.1`
  Port              `3307`
  Username          `tripzy_app`
  Password          Supplied through `TRIPZY_DB_PASSWORD`

These are the values currently configured in
`backend/src/main/resources/application.properties`. If your local MySQL
installation uses a different port or username, update the application
configuration accordingly.

## 2. Create the database and local user

Run the following SQL in MySQL Workbench or a MySQL client. Replace the
placeholder password with a strong local password.

``` sql
CREATE DATABASE IF NOT EXISTS tripzy_db;

CREATE USER IF NOT EXISTS 'tripzy_app'@'localhost'
IDENTIFIED BY 'YOUR_LOCAL_PASSWORD';

GRANT ALL PRIVILEGES ON tripzy_db.* TO 'tripzy_app'@'localhost';

FLUSH PRIVILEGES;
```

If the user already exists and you need to change its password, use:

``` sql
ALTER USER 'tripzy_app'@'localhost'
IDENTIFIED BY 'YOUR_LOCAL_PASSWORD';
```

Do not commit the real password to GitHub.

## 3. Configure the backend

The backend configuration is in:

`backend/src/main/resources/application.properties`

Current database properties:

``` properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3307/tripzy_db
spring.datasource.username=tripzy_app
spring.datasource.password=${TRIPZY_DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
```

Set the environment variable before starting Spring Boot.

Windows PowerShell:

``` powershell
$env:TRIPZY_DB_PASSWORD = "YOUR_LOCAL_PASSWORD"
```

macOS / Linux:

``` bash
export TRIPZY_DB_PASSWORD="YOUR_LOCAL_PASSWORD"
```

The environment variable must be set in the same terminal session used
to start the backend.

## 4. Tables and sample data

Hibernate is configured with `spring.jpa.hibernate.ddl-auto=update`.
When the backend starts, Hibernate updates the database schema based on
the JPA entity mappings.

The `DataInitializer` class in
`backend/src/main/java/com/tripzy/config/DataInitializer.java`
implements `CommandLineRunner`. It checks for each sample hotel by name
and inserts the hotel and its room type when that hotel is not already
present.

The initializer currently provides 15 sample hotels across five
destinations:

-   Mumbai
-   Goa
-   Jaipur
-   Bengaluru
-   Manali

Each sample hotel is initialized with one room category, including its
description, nightly price, guest capacity, and total room inventory.

**No separate SQL seed script is required for the current development
setup:** the application inserts this sample data during startup. If you
later add a manual SQL seed script, coordinate it with `DataInitializer`
to avoid duplicate records.

## 5. Start the backend

From the `backend` directory, after MySQL is running and the password
environment variable is set:

``` bash
mvn clean test
mvn spring-boot:run
```

On startup, Hibernate creates or updates the mapped tables and
`DataInitializer` inserts any missing sample hotels.

## 6. Important notes

-   `ddl-auto=update` is convenient for this assignment's local
    development setup. For production, use versioned database migrations
    rather than relying on automatic schema updates.
-   Keep database credentials out of source control.
-   The sample hotel names and descriptions are demonstration data for
    this assignment.
-   To reset the local sample database, back up any data you need before
    dropping and recreating `tripzy_db`. The initializer will repopulate
    the sample hotels the next time the backend starts.
