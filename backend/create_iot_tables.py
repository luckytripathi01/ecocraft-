from database import get_connection

conn = get_connection()
cursor = conn.cursor()

# Smart Bins Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS smart_bins (
    bin_id VARCHAR(50) NOT NULL,
    location VARCHAR(200),
    status ENUM('active', 'inactive', 'maintenance')
    NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bin_id)
) ENGINE=InnoDB;
""")

# Sensor Readings Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS sensor_readings (
    reading_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    bin_id VARCHAR(50) NOT NULL,
    waste_level FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    gas_level FLOAT NOT NULL,
    priority VARCHAR(20),
    environmental_risk VARCHAR(30),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (reading_id),

    CONSTRAINT fk_sensor_bin
    FOREIGN KEY (bin_id)
    REFERENCES smart_bins(bin_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
""")

# IoT Alerts Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS iot_alerts (
    alert_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    bin_id VARCHAR(50) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status ENUM('active', 'resolved')
    NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (alert_id),

    CONSTRAINT fk_alert_bin
    FOREIGN KEY (bin_id)
    REFERENCES smart_bins(bin_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
""")

# Default Smart Bin
cursor.execute("""
INSERT IGNORE INTO smart_bins (bin_id, location)
VALUES ('ECO_001', 'EcoCraft Demo Location')
""")

conn.commit()

print("IoT tables created successfully!")
print("Smart bin ECO_001 added successfully!")

cursor.close()
conn.close()