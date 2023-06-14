CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL,
    category ENUM('Lot Owners', 'Advertisers', 'General') NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);