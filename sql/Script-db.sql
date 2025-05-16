insert into tb_product_sales (nama_produk, harga_jual) values
('combed 30s', 5000),
('combed 30s', 5500),
('combed 30s', 7000),
('combed 30s', 6000),
('combed 30s', 6500),
('combed 24s', 8000),
('combed 28s', 9500),
('combed 24s', 8500),
('combed 28s', 10000),
('combed 28s', 10500);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  shipping_log_id INT REFERENCES shipping_logs(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipping_logs (
  id SERIAL PRIMARY KEY,
  origin TEXT,
  destination TEXT,
  courier TEXT,
  service TEXT,
  cost NUMERIC,
  etd TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (name) VALUES
  ('Alice'),
  ('Bob'),
  ('Charlie');

INSERT INTO shipping_logs (origin, destination, courier, service, cost, etd) VALUES
  ('Jakarta', 'Bandung', 'jne', 'REG', 20000, '2-3'),
  ('Jakarta', 'Surabaya', 'pos', 'Kilat', 30000, '3-4'),
  ('Bandung', 'Medan', 'tiki', 'ECO', 50000, '4-5'),
  ('Surabaya', 'Jakarta', 'jne', 'YES', 40000, '1'),
  ('Jakarta', 'Yogyakarta', 'tiki', 'REG', 25000, '2');

INSERT INTO shipments (user_id, shipping_log_id, created_at) VALUES
  (1, 1, '2024-06-01'),
  (1, 2, '2024-06-10'),
  (1, 3, '2024-07-01'),
  (2, 4, '2024-06-15'),
  (3, 5, '2024-07-05'),
  (3, 2, '2024-07-10');


-- No.1 
insert into tb_product_sales_cp (nama_produk, harga_jual)
select nama_produk, harga_jual from tb_product_sales;

-- No.2
select nama_produk, sum(harga_jual) as total_harga 
from tb_product_sales tps 
group by tps.nama_produk 

-- No.3
with shipment_summary AS (
  SELECT
    s.user_id,
    COUNT(s.id) AS total_shipments,
    SUM(sl.cost) AS total_shipping_cost
  FROM shipments s
  JOIN shipment_logs sl ON s.shipping_log_id = sl.id
  GROUP BY s.user_id
)
SELECT
  u.name,
  ss.total_shipments,
  ss.total_shipping_cost
FROM users u
JOIN shipment_summary ss ON ss.user_id = u.id;


-- No.4
with tb_last as (
  select MAX(id) as last_id, nama_produk 
  from tb_product_sales
  group by nama_produk
)
select tps.id, tps.nama_produk, tps.harga_jual
from tb_product_sales tps
join tb_last last on tps.id = last.last_id;

