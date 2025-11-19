-- Rollback initial schema
DROP TRIGGER IF EXISTS orders_set_updated_at ON orders;
DROP FUNCTION IF EXISTS set_updated_at;
DROP TABLE IF EXISTS ads;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS _migrations;
