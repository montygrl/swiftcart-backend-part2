-- 1. User --
CREATE TABLE "user" (
    user_id        SERIAL PRIMARY KEY,
    first_name     VARCHAR(25) NOT NULL,
    last_name      VARCHAR(50) NOT NULL,
    email          VARCHAR(50) UNIQUE NOT NULL,
    password_hash  VARCHAR(255) NOT NULL
);

-- 2. Address ---
CREATE TABLE address (
    address_id     SERIAL PRIMARY KEY,
    type           VARCHAR(20) CHECK (type IN ('Shipping','Billing')) NOT NULL,
    street         VARCHAR(255) NOT NULL,
    city           VARCHAR(50) NOT NULL,
    postal_code    VARCHAR(10) NOT NULL,
    user_id        INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- 3. Category --
CREATE TABLE category (
    category_id    SERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL
);

-- 4. Product --
CREATE TABLE product (
    product_id          SERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    price               DECIMAL(10,2) NOT NULL,
    inventory           INTEGER NOT NULL DEFAULT 0,
    inventory_reserved  INTEGER NOT NULL DEFAULT 0,
    category_id         INTEGER NOT NULL REFERENCES category(category_id)
);

-- 5. Payment Method --
CREATE TABLE payment_method (
    payment_id     SERIAL PRIMARY KEY,
    type           VARCHAR(25) NOT NULL,
    last4          CHAR(4),
    expiry         CHAR(5),
    user_id        INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- 6. Cart Item --
CREATE TABLE cart_item (
    cart_item_id   SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    product_id     INTEGER NOT NULL REFERENCES product(product_id),
    quantity       INTEGER NOT NULL CHECK (quantity > 0),
    added_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 7. Wishlist Item  --
CREATE TABLE wishlist_item (
    wishlist_item_id SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    product_id       INTEGER NOT NULL REFERENCES product(product_id),
    added_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 8. Order --
CREATE TABLE "order" (
    order_id            SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL REFERENCES "user"(user_id),
    shipping_address_id INTEGER NOT NULL REFERENCES address(address_id),
    billing_address_id  INTEGER REFERENCES address(address_id),
    payment_method_id   INTEGER NOT NULL REFERENCES payment_method(payment_id),
    order_date          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status              VARCHAR(20) CHECK (status IN ('Pending','Paid','Processing','Shipped','Delivered','Cancelled')) NOT NULL DEFAULT 'Pending',
    total_price         DECIMAL(10,2) NOT NULL
);

-- 9. Order Item --
CREATE TABLE order_item (
    order_item_id  SERIAL PRIMARY KEY,
    order_id       INTEGER NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
    product_id     INTEGER NOT NULL REFERENCES product(product_id),
    quantity       INTEGER NOT NULL CHECK (quantity > 0),
    unit_price     DECIMAL(10,2) NOT NULL
);