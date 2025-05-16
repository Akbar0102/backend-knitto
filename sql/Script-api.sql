CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_counters (
  invoice_date CHAR(8) PRIMARY KEY, 
  last_number INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, price, stock) VALUES
('Kaos Polos Combed 30s', 50000, 120),
('Hoodie Zipper', 150000, 45),
('Sweater Rajut', 125000, 60),
('Jaket Parasut', 175000, 30),
('Kemeja Flanel', 95000, 75),
('Celana Chino', 100000, 80),
('Topi Trucker', 40000, 150),
('Kaos Oblong', 45000, 200),
('Jaket Bomber', 200000, 25),
('Celana Jeans', 120000, 90);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    total_amount INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL
);

INSERT INTO customers (name, email) VALUES
('Andi Saputra', 'andi@example.com'),
('Budi Santoso', 'budi@example.com'),
('Citra Dewi', 'citra@example.com');