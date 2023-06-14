INSERT INTO roles (id, role_name, user_type, is_employee)
VALUES
  (1, 'Lot Operator', 'customer', FALSE),
  (2, 'Advertiser', 'paying customer', FALSE),
  (3, 'Customer Support', 'employee', TRUE),
  (4, 'Lot Specialist', 'employee', TRUE),
  (5, 'Advertising Specialist', 'employee', TRUE),
  (6, 'Accountant', 'employee', TRUE);

INSERT INTO users (
  role_id, email, first_name, last_name, company_name, 
  company_address, state, city, zip, password
) VALUES
  (1, 'funky.chicken@example.com', 'Funky', 'Chicken', 'Cluckin\' Good', '123 Cluck St', 'NY', 'New York', '10001', 'funky123'),
  (2, 'jolly.giraffe@example.com', 'Jolly', 'Giraffe', 'High Heads', '456 Tall Ave', 'CT', 'Hartford', '06103', 'jolly123'),
  (3, 'curious.cat@parkez.com', 'Curious', 'Cat', 'Whisker Whispers', '789 Purr St', 'NJ', 'Newark', '07102', 'curious123'),
  (4, 'chatty.penguin@parkez.com', 'Chatty', 'Penguin', 'Ice Breakers', '321 Waddle Ave', 'NY', 'Buffalo', '14201', 'chatty123'),
  (5, 'happy.hippo@parkez.com', 'Happy', 'Hippo', 'River Riders', '654 Splash St', 'CT', 'Bridgeport', '06604', 'happy123'),
  (6, 'lively.lemur@parkez.com', 'Lively', 'Lemur', 'Tree Jumpers', '987 Leap Ln', 'NJ', 'Jersey City', '07302', 'lively123');
