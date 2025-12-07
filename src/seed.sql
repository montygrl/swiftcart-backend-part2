INSERT INTO category (name) VALUES ('Electronics'), ('Clothing');

INSERT INTO product (name, description, price, inventory, category_id)
VALUES 
  ('Wireless Headphones', 'Noise-cancelling', 99.99, 50, 1),
  ('T-Shirt', 'Cotton, Medium', 19.99, 100, 2);

INSERT INTO "user" (first_name, last_name, email, password_hash)
VALUES ('Jane', 'Doe', 'jane@swiftcart.com', '$2b$10$fakehash');

INSERT INTO address (type, street, city, postal_code, user_id)
VALUES 
  ('Shipping', '123 Main St', 'Toronto', 'M1M1M1', 1),
  ('Billing', '456 Oak Ave', 'Toronto', 'M2M2M2', 1);

INSERT INTO payment_method (type, last4, expiry, user_id)
VALUES ('credit_card', '1234', '12/27', 1);