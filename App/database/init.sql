CREATE TABLE IF NOT EXISTS taxi_tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    is_autopilot BOOLEAN DEFAULT FALSE,
    image_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    route_points TEXT,
    tariff_id INTEGER NOT NULL REFERENCES taxi_tariffs(id),
    total_price DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) DEFAULT 'created'
);

CREATE TABLE IF NOT EXISTS route_searches (
    id SERIAL PRIMARY KEY,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    route_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO taxi_tariffs (name, description, price, is_autopilot, image_name)
VALUES
    ('Вместе', 'Вместе', 400, FALSE, '1_type.png'),
    ('Эконом', 'Эконом', 500, FALSE, '2_type.png'),
    ('Комфорт', 'Комфорт', 600, FALSE, '3_type.png'),
    ('Комфорт+++', 'Комфорт+++', 670, FALSE, '4_type.png'),
    ('Бизнес', 'Бизнес', 800, FALSE, '5_type.png'),
    ('Без пилота', 'Без пилота', 450, TRUE, '6_type.png')
ON CONFLICT DO NOTHING;
