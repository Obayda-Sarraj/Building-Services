-- Drop tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS service_providers;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT,
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    company_name VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    rating FLOAT,
    location TEXT
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    description TEXT,
    base_price NUMERIC,
    duration INT
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    provider_id INT REFERENCES service_providers(id),
    service_id INT REFERENCES services(id),
    booking_date TIMESTAMP,
    status VARCHAR(50),
    total_price NUMERIC
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id),
    amount NUMERIC,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(100),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data into users
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES
('Ahmad Khalil', 'ahmad.khalil@gmail.com', '0599123456', 'hashed_pass_1', 'customer'),
('Lina Abu Saif', 'lina.abusaif@gmail.com', '0568123456', 'hashed_pass_2', 'customer'),
('Mohammad Nassar', 'm.nassar@gmail.com', '0599345678', 'hashed_pass_3', 'provider'),
('Samer Odeh', 'samer.odeh@gmail.com', '0569234567', 'hashed_pass_4', 'provider'),
('Admin User', 'admin@buildingservices.ps', '0599000000', 'hashed_admin', 'admin');

-- Insert data into service_providers
INSERT INTO service_providers (user_id, company_name, verified, rating, location)
VALUES
(3, 'Nassar Maintenance Services', TRUE, 4.6, 'Ramallah'),
(4, 'Odeh Cleaning & Maintenance', TRUE, 4.3, 'Nablus');

-- Insert data into services
INSERT INTO services (name, category, description, base_price, duration)
VALUES
('Home Cleaning', 'Cleaning', 'Full house cleaning service', 120, 120),
('Sofa & Upholstery Cleaning', 'Cleaning', 'Deep cleaning for sofas and carpets', 80, 90),
('Electrical Maintenance', 'Maintenance', 'Fixing home electrical issues', 150, 90),
('Plumbing Service', 'Maintenance', 'Pipe repair and water leakage fixing', 130, 60),
('Pest Control', 'Cleaning', 'Rodent and insect control service', 200, 180),
('Water Tank Cleaning', 'Cleaning', 'Water tank disinfection and cleaning', 180, 120);

-- Insert data into bookings
INSERT INTO bookings (user_id, provider_id, service_id, booking_date, status, total_price)
VALUES
(1, 1, 1, '2025-05-10 10:00:00', 'Completed', 120),
(2, 2, 3, '2025-05-12 14:00:00', 'Completed', 150),
(1, 1, 2, '2025-05-15 09:30:00', 'Pending', 80),
(2, 2, 5, '2025-05-18 11:00:00', 'Confirmed', 200);

-- Insert data into payments
INSERT INTO payments (booking_id, amount, payment_method, payment_status)
VALUES
(1, 120, 'Cash', 'Paid'),
(2, 150, 'Credit Card', 'Paid'),
(3, 80, 'Cash', 'Pending'),
(4, 200, 'Credit Card', 'Paid');

-- Insert data into reviews
INSERT INTO reviews (booking_id, rating, comment)
VALUES
(1, 5, 'Excellent cleaning service, very professional team.'),
(2, 4, 'Good electrical service, arrived on time.'),
(4, 5, 'Very effective pest control, highly recommended.');

-- Insert data into notifications
INSERT INTO notifications (user_id, title, message)
VALUES
(1, 'Booking Completed', 'Your home cleaning service has been completed successfully.'),
(2, 'Payment Confirmed', 'Your payment for plumbing service was successful.'),
(3, 'New Booking', 'You have received a new service booking.'),
(4, 'Booking Reminder', 'You have a scheduled service tomorrow at 11:00 AM.');

-- Display all tables
SELECT * FROM users;
SELECT * FROM service_providers;
SELECT * FROM services;
SELECT * FROM bookings;
SELECT * FROM payments;
SELECT * FROM reviews;
SELECT * FROM notifications;