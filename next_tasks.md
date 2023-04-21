# Tasks

## Add all account types
Current Account Types:
1. Lot Operator
2. Advertiser

## Account types named in RCT_v10 with discriptions
1. ~~Subscribed Parking Lot Operators~~ (Now known as **Lot Operator**) -- A person with a parking lot who pays us to monitor it, help their customers find spaces
2. ~~Car Parking Users~~ (Nameless user who has not logged in, and is not in database) -- A unenrolled website user, who probably wants to find best space in a parking lot, who never logs in
3. ~~Subscribed Advertisers~~  (Now known as **Advertiser**) -- A person who pays us to advertise on our website
4. Advertising & Sales Representative -- A ParkEz employee who supports **Advertisers**, including with technical problems
5. Customer Support Specialist -- A ParkEz employee who helps both **Advertisers** and **Lot Operators**, but with more basic, non-technical issues.
6. Accountant -- A ParkEz employee who manages paperwork
7. Manager -- A ParkEz employee who supports  **Lot Operators**, including with technical problems

The Role titles are not named in a logical way, and they are named too long, so let's rename them to be short and descriptive.
## Renamed roles
1. Subscribed Parking Lot Operators -> **Lot Operator** (paying customer)
2. Car Parking Users -> **None** (just a default user who hasn't logged in, doesn't pay)
3. Subscribed Advertisers -> **Advertiser** (paying customer)
4. Advertising --  **Advertising Specialist** (employee)
5. Customer Support Specialist -- **Customer Support** (employee)
6. Accountant -> **Accountant** (employee)
7. Manager -> **Parking Lot Support** (employee)

## Todo List
* All pages should be able to view/edit their personal information (including password and email), except for role
 * One new EditAccount page all users can have access too
* Accountant should be able to create new accounts for all employees, including new accoutants (they fill in email and temporary password, then new employees fill in the rest when they first log in) and edit roles for all accounts
 * Page for accountants to create new accounts (the only way for new employee accounts to be created)
 * Page for accoutnants to edit all accounts including role (the only way to edit accounts)
