## Part 1 Build: April 4 - April 27 2023
[Deploy archived](https://github.com/tc10815/ParkEzAI/tree/main/archive/part1),  

Included all features listed under _1. Account Management_ in Functional Requirements below.

Working model, but PHP was basic and had inconsistent authentication: Not scalable or secure enough to be used in real life.

### Part 2 (Functional Requirements 2, 3 and 4): June 1 - Present
Current working model: [plan6.com](https://plan6.com)

Remade Part 1's PHP backend in Django. Django is more scalable and secure, almost production ready. Python backend will be useful for Machine Learning in this part of the project.

Migrating the sites model PHP backend to a more serious Django backend took me about 2 weeks, working about 1-3 hours a day

Changes between Part 1 (April 4 - April 27 2023) and Part 2 (June 1 - now)

|  Service Type | Part 1       | Part 2  |
| ------------- |:------------:| -----:|
| Hosting       | Shared       | Virtual Private Server |
| HTTP Protocol | HTTP         | HTTPS |
| Database      | MariaDB      | SQLite |
| Web Server    | Apache       | Nginx |
| Backend Server| Apache       | Gunicorn |
| Backend Language   | PHP          | Python |
| Backend Framework  | None         | Django |
| React Router  | HashRouter      | BrowserRouter |
| Frontend Framework  | ReactJS      | ReactJS |

# ParkEzAI

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

