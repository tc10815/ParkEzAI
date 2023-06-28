# ParkEz: Part 2 (deploy: [plan6.com](https://plan6.com))
**In progress: June 1 - Present**
## Task List
- [x] **Step 1:** Remake Part 1 with Django REST framework
  - [x] Increase security by using Django's standard authentication method and HTTPS instead of HTTP.
  - [x] Migrate database to SQLite, app server to Gunicorn, and webserver to Nginx.
  - [x] Remove hashs from  URLs by correctly configuring Nginx for React
- [x]  **Step 2:** Develop independent Python scripts that: 
  - [x] identify cars and open spaces.
  - [x] recommend best spaces 
  - [x] identify overparked cars
- [ ] **Step 3:** Implement Functional Requirements 3.1, 3.2, and 3.3 by integrating Step 2's scripts with Django.
- [ ] **Step 4:** Implement Functional Requirements 2.1, 2.3  and 2.3 by integrating Step 2's scripts with Django (Requirement 2.4 will be done later)
- [ ] **Step 5:** Implement Advertisement system (Functional requirement 4.1, 4.2, 4.3)
- [ ] **Step 6:** Implement model email and payment systems (Functional Requirements 5.1 and 5.2), which are integrated for all account types
- [ ] **Step 7:** Implement sample license plate tracking
- [ ] **Step 8:** Finishing touches

## Step 3: Progress
### Current step
Step 2 staff tools have been documented and organized. Will now integrate those tools in Django.

## Step 2 retrospective: Machine Learning and Core Logic 
### Created working parking detection ML models with real lot data, and a system for integrating future parking lots.
Implemented both Pytorch CNNs and pretrained YOLOv3 on lot. While final testing of YOLOv3 model before integration didn't yield good results, the Pytorch CNNs were tested on the same images and did very well. Here are testing results (159 images with 9 parking spots, taken each half hour in Coldwater, MI, 6/17 2:12am to 6/20 6:43pm):

Analysis:
| **Model**     | **Accuracy** | **Precision** | **Recall** | **F1 Score** |
| ------------- | ------------ | ------------- | ---------- | ------------ |
| **YOLO Weights** | 85.9%        | 97.49%         | 58.37%     | 73.02%       |
| **Pytorch CNN**   | 98.30%       | 99.04%         | 98.30%     | 98.67%       |


The recall shows that if a car is parked in space, it only registers it 58% of the time. Not good. But the new system registers 98.4% of cars in spaces, which is acceptably good in my opinion, especially since the test data includes tricky things like motorcycles, and cars taking up multiple spaces. Using the CNN is a more typical approach for a system like this, so it makes sense it works better. 

![Python output](./archive/img/example.jpg)
An example of car detection (in this case with YOLO)
parking
## Step 1 retrospective: PHP to Django migration 
### Remade Part 1 in Django. Django is more scalable and secure, almost production ready. A Python backend will be useful for machine learning in Requirements 2 and 3.S
- Migrating PHP to Django took 2 weeks, working about 1-3 hours a day
- ~20% of the ~4000 lines React frontend code was rewritten and refactored, Part 2's frontend has about 400 fewer lines of code due to refactoring. 
- 100% of ~900 lines of PHP backend was rewritten in Django with Python. Roughly the same amount of code was needed in both languages.
- Thanks to VPS and having control over the server for Part 2:
  - HTTPS support for React and the API in deployments (Installing Certbot with Let's Encrypt was possible)
  - Browser Router made it so hashes (#) weren't necessary in the URL (required for my previous shared hosting)
- Part II's version is professional, secure and works, but the server is a slightly slower than PHP.  I will look into optimizations to improve this.

|               | Part 1 (4/4-4/27) | Part 2 (6/1-now)  |
| ------------- |:------------:| -----:|
| Hosting       | Shared       | VPS |
| Server    | Apache       | Nginx, Gunicorn |
| Database      | MariaDB      | SQLite |
| Frontend  | ReactJS      | ReactJS |
| Backend  | PHP         | Python, Django |


## Part 1 
**April 4 - April 27, 2023**

[Archive location, including last build](https://github.com/tc10815/ParkEzAI/tree/main/archive/part1),  

All Functional Requirements listed under _1. Account Management_ in Functional Requirements below were completed.

It was a working model, but PHP was basic and had inconsistent authentication: Not scalable or secure enough to be used in real life. 
About 4000 lines of code for the frontend (React) and 900 for the backend (PHP). 
April 4 - April 27, 2023)
# ParkEzAI (Project Overview)
How people code is changing. Over the last year (2022-2023) AI has become powerful and accessible enough to provide real productivity gains for programmers. This Web Application is an exploration of what coding may be like when AI assistance becomes the norm. 

In this project, functional requirements taken from a large class project are being implemented with AI assistance in coding, writing ('copy'), design and images.

ParkEz is a year long school project I'm working on as part of a large team (7 people) which I contributed to the design, but is being implemented by others. The requirements of ParkEz (school project) and ParkEzAI are exactly the same, but the implementation is entirely different, entirely independent. ParkEzAI is coded by one person (me) using mostly code generated by ChatGPT-4. 

When ParkEzAI began development, the ParkEz school project was mostly unimplemented, with only the frontend of the homepage, login page and new account page implemented with no backend. None of the code, design, text or images was used in ParkEzAI.

## The AI Assisted Process
* AI tools used are ChatGPT-4 and Dall·E 2.
* Goal is to have at least 80% code written by AI.
* Include all prompts and the exact responses in a project folder for reference.
* Some images will be created with Dall·E 2 (logo, some embedded imagines). 
* All text ('copy') users see on WebApp will be generated by ChatGPT-4 

![Sorcerer Mickey](./archive/img/mickey.jpg)

## Functional Requirements (identical for ParkEzAi and ParkEz School Project)
ParkEzAI allows parking lot owners to see how many spaces are occupied in their lot, identify overparkers and record security to the cloud to revisit it later. It allows would be parkers to see how occupied a lot is and see the best spot. Advertisors can also place advertisements on the park lot page for the general public. 

<strong>1. Account Management</strong>

* 1.1 Summarize Account:	Basic summary of account (when subscribed, when will expire, type of account).
* 1.2 Authenticate Account:	Authentication pages are where subscribed customers log in (both lot operators and advertisers).
* 1.3 Request Customer Support:	A simple page where users can request customer support.
* 1.4 Create Account:	Where users can create an account.
* 1.5 Modify Account:	Where users can make changes to their account, such as passwords
* 1.6 Cancel Account:	Where users can cancel their account.

<strong>2. Parking Lot Management</strong>

* 2.1 Track Occupancy:	Tracking of how many spots are taken at what times, presented for individuals who manage parking lots
* 2.2 Access Footage Archive:	Lot owners can access archived footage of their parking lots.
* 2.3 Detect Overparking: 	Notification of whenever a space is occupied longer than a specified period of time.
* 2.4 Track License Plates:	Tracking what license plates are registered at what times.

<strong>3. Parking Lot Status</strong>

* 3.1 Search and Select Lot:	Unsubscribed users can browse and search parking lots using ParkEZ. 
* 3.2 View Occupancy	Shows: unsubscribed users most optimal space available and occupancy of selected parkng lot. View includes ads.
* 3.3 Access Occupancy Remotely:	A non GUI element offers occupancy status data through an interface Parking Lot Managers can use with their website.

<strong>4. Advertising Management</strong>

* 4.1 Create Ad:	Uploads ads.
* 4.2 Modify Ad:	Edits existing ad's content.
* 4.3 View Ad Statistics:	View impressions and clicks of placed ads.

<strong>5. Payment Gateway</strong>

* 5.1 Define Payment Method:	Users decide how they pay for their subscription (ad or lot manger).
* 5.2 Validate Payment: 	Checks that customer payment method can be billed correctly.
