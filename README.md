# ParkEzAI

How people code is changing. Over the last year (2022-2023) AI has become powerful and accessible enough to provide real productivity gains for programmers. This website is an exploration of what coding may be like when AI assistance becomes the norm. AI tools used are ChatGPT-4 and Dall·E 2, unless otherwise specified.

ParkEz is a school project I'm working on as part of a large team (8 people) which I contributed to the design, but is being implemented by others. The requirements of ParkEz (school project) and ParkEzAI are exactly the same, but the implementation is entirely different. ParkEzAI is coded by one person (me) using mostly code generated by ChatGPT-4, using technologies I'm most familiar with. In terms of implementation, the only similiarty between ParkEz (school project) and ParkEzAI is they both use React as a frontend web technology (but with different design and code). 

## The Process for ParkEzAi
* AI tools used are ChatGPT-4 and Dall·E 2
* Goal is to have at least 80% code written by AI.
* Include all prompts and the exact responses in a project folder for reference.
* All images will be created with Dall·E 2 (logo, embedded images). 
* All text ('copy') users see on WebApp will be generated by ChatGPT-4  

## Functional Requirements (identical for ParkEzAi and ParkEz School Project)

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
* 2.4 Track License Plates:	Tracking what license plates are registed at what times.

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
