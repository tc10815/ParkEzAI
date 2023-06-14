CREATE TABLE roles (
  id INT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  is_employee BOOLEAN NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isUninitialized BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
