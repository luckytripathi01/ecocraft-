CREATE DATABASE ecocraft;

USE ecocraft;

CREATE TABLE users (
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_email (email)
) ENGINE = InnoDB;

CREATE TABLE materials (
    material_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    material_name VARCHAR(100) NOT NULL,
    description TEXT,
    recyclable_flag TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (material_id),
    UNIQUE KEY uq_material_name (material_name)
) ENGINE = InnoDB;

CREATE TABLE scans (
    scan_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    image_url TEXT NOT NULL,
    material_id INT UNSIGNED DEFAULT NULL,
    confidence DECIMAL(5, 2) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (scan_id),
    KEY idx_scans_user (user_id),
    KEY idx_scans_material (material_id),
    CONSTRAINT fk_scans_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_scans_material FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE
    SET
        NULL
) ENGINE = InnoDB;

CREATE TABLE reuse_ideas (
    reuse_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    material_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    youtube_video_id VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (reuse_id),
    KEY idx_reuse_material (material_id),
    CONSTRAINT fk_reuse_material FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE recycle_guides (
    guide_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    material_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    instructions TEXT NOT NULL,
    local_notes TEXT,
    PRIMARY KEY (guide_id),
    KEY idx_guide_material (material_id),
    CONSTRAINT fk_guide_material FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE tutorials (
    tutorial_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    material_id INT UNSIGNED NOT NULL,
    youtube_video_id VARCHAR(50) NOT NULL,
    title VARCHAR(250) NOT NULL,
    channel_name VARCHAR(150),
    thumbnail_url TEXT,
    language VARCHAR(30),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tutorial_id),
    KEY idx_tutorial_material (material_id),
    CONSTRAINT fk_tutorial_material FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE listings (
    listing_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    seller_id INT UNSIGNED NOT NULL,
    material_id INT UNSIGNED DEFAULT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    condition_text VARCHAR(30),
    status ENUM('draft', 'active', 'sold', 'archived') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (listing_id),
    KEY idx_listings_seller (seller_id),
    KEY idx_listings_material (material_id),
    CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_listings_material FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE
    SET
        NULL
) ENGINE = InnoDB;

CREATE TABLE listing_images (
    image_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    listing_id INT UNSIGNED NOT NULL,
    image_url TEXT NOT NULL,
    PRIMARY KEY (image_id),
    KEY idx_listing_images_listing (listing_id),
    CONSTRAINT fk_listing_images_listing FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE addresses (
    address_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    line1 VARCHAR(200) NOT NULL,
    line2 VARCHAR(200),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (address_id),
    KEY idx_addresses_user (user_id),
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE orders (
    order_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    buyer_id INT UNSIGNED NOT NULL,
    shipping_address_id INT UNSIGNED DEFAULT NULL,
    order_status ENUM(
        'pending',
        'paid',
        'shipped',
        'completed',
        'refunded',
        'cancelled'
    ) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id),
    KEY idx_orders_buyer (buyer_id),
    KEY idx_orders_address (shipping_address_id),
    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_address FOREIGN KEY (shipping_address_id) REFERENCES addresses(address_id) ON DELETE
    SET
        NULL
) ENGINE = InnoDB;

CREATE TABLE order_items (
    order_item_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    listing_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_item_id),
    KEY idx_order_items_order (order_id),
    KEY idx_order_items_listing (listing_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_listing FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
) ENGINE = InnoDB;

CREATE TABLE payments (
    payment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    payment_method ENUM('upi', 'card', 'netbanking', 'wallet', 'cod') NOT NULL,
    transaction_ref VARCHAR(100) DEFAULT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    paid_at DATETIME DEFAULT NULL,
    PRIMARY KEY (payment_id),
    UNIQUE KEY uq_payment_txn (transaction_ref),
    KEY idx_payments_order (order_id),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE messages (
    message_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    sender_id INT UNSIGNED NOT NULL,
    receiver_id INT UNSIGNED NOT NULL,
    listing_id INT UNSIGNED DEFAULT NULL,
    message_text TEXT NOT NULL,
    sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id),
    KEY idx_messages_sender (sender_id),
    KEY idx_messages_receiver (receiver_id),
    KEY idx_messages_listing (listing_id),
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_listing FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE reviews (
    review_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    listing_id INT UNSIGNED NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (review_id),
    KEY idx_reviews_user (user_id),
    KEY idx_reviews_listing (listing_id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_listing FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
    CONSTRAINT chk_rating CHECK (
        rating BETWEEN 1
        AND 5
    )
) ENGINE = InnoDB;   
-- ============================================
-- ECOCRAFT XP & CERTIFICATE SYSTEM
-- ============================================

CREATE TABLE xp_transactions (
    xp_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    xp_earned INT NOT NULL,
    description VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (xp_id),
    KEY idx_xp_user (user_id),

    CONSTRAINT fk_xp_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE certificates (
    certificate_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    certificate_number VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    tier ENUM('Bronze', 'Silver', 'Gold', 'Diamond') NOT NULL,
    xp INT UNSIGNED NOT NULL,
    issue_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verification_code VARCHAR(100) NOT NULL,

    PRIMARY KEY (certificate_id),

    UNIQUE KEY uq_certificate_number (certificate_number),
    UNIQUE KEY uq_verification_code (verification_code),

    KEY idx_certificate_user (user_id),

    CONSTRAINT fk_certificate_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE = InnoDB;