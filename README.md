# ParkEz AI

In this project, functional requirements taken from a 7 person, 2 semester class project (ParkEz) are being implemented by a single student, with AI assistance in coding, writing ('copy'), design and images (ParkEz AI). 

The goal of the product in both projects is to monitor parking lots for businesses using AI. *The larger goal of the ParkEz group class project is to learn documentation and Software Engineering methodologies on a team.* ***The larger goal of this version of the project is to understand AI's role in the future of programming from the perspective of the programmer***. 

- [Functional Requirements](#functional-requirements), what both the ParkEz AI and the group project ParkEz will actually do
- [Overview](#parkezai-project-overview), focusing on the AI process
- [Task List](#task-list) from this semester's tasks to project completion
- [Semester 1 AI Prompts](https://github.com/tc10815/ParkEzAI/tree/main/archive/part1/prompt_logs_part1), [Semester 2 AI prompts](https://github.com/tc10815/ParkEzAI/tree/main/prompt_logs) used thus far 
- Notes:
  - [PHP to Django migration](#notes-on-php-to-django-api-migration)
  - [Parking Spot Occupancy Detection](#notes-on-parking-spot-occupancy-detection)
  - [Deploying Computer Vision and Machine Learning on Backend Server](#notes-on-deploying-computer-vision-and-machine-learning-on-backend-server)
  - [Semester 1: complete first semester project](#semester-1), where [Functional Requirements](#functional-requirements) 1.1, 1.2, 1.3, 1.4, 1.5 and 1.6 were completed with PHP 

## Live Parking Spot Detection Demo
[![Liveshot](https://backend.plan6.com/lots/github_view?camera=coldwatermi)](https://plan6.com/lot/coldwater)
Image updates every 30 minutes, refresh this GitHub page to view updated image. The ParkEzAi production machine learning models label the spots as occupied (Red) or free (green). Monroe Street in Coldwater, Michigan. 

Occasionally the models mislabel a spot, although fairly rarely. See more by [clicking the image](https://plan6.com/lot/coldwater).

# ParkEzAI: Semester 2 ([plan6.com](https://plan6.com) - updated 8/08/2023)
**In progress: June 1 - Present**
## Task List
- [x] **Step 1:** Redo **[Functional Requirements 1.1, 1.2, 1.3, 1.4, 1.5 and 1.6](#1-account-management):** 
Remake Semester 1's PHP backend with Django REST framework
  - [x] Migrate database to SQLite, app server to Gunicorn, and webserver to Nginx
  - [x] Remove hashs from  URLs by correctly configuring Nginx for React, use HTTPS instead of HTTP with Certbot + Let's Encrypt
- [x]  **Step 2:** Develop independent Python scripts that: 
  - [x] Identify cars and open spaces.
  - [x] Recommend best spaces 
  - [x] Identify overparked cars (cars parked beyond time limit)
- [x] **Step 3:** Implement **[Functional Requirements 3.1, 3.2, and 3.3](#3-parking-lot-status)** by integrating Step 2's scripts with Django
  - [x] Create a API JPEG upload receiver for camera feeds (currently Coldwater, MI, but will work with any future lots)
  - [x] Create auto uploader for Coldwater lot, uploads to ParkEzAi every 30 minutes
  - [x] **[Functional Requirement 3.2](#3-parking-lot-status)**: Create view that shows lots to public, included occupancy and best space
  - [x] **[Functional Requirement 3.1](#3-parking-lot-status)**: Create view with search that shows all available parking lots (including placeholders) to public
  - [x] **[Functional Requirement 3.3](#3-parking-lot-status)**: Create a API endpoint that usable for general external websites and apps that shows public lot data 
- [x] **Step 4:** Implement **[Functional Requirements 2.1, 2.3  and 2.3](#2-parking-lot-management)** by integrating Step 2's scripts with Django
  - [x] **[Functional Requirement 2.1](#2-parking-lot-management)**: Integrate track occupancy with Lot Owner Interface with bonus features 
  - [x] **[Function Requirement 2.2](#2-parking-lot-management)**: Integrate lot image / occupancy data archive in a way that provides lot owners with useful information 
  - [x] **[Function Requirement 2.3](#2-parking-lot-management)**: Create overparking detection, alert and review system and provide interface for lot owners
- [ ] **Step 5:** Implement **[Functional Requirements 4.1, 4.2, 4.3](#4-advertising-management)** advertisement system
- [ ] **Step 6:** Implement **[Functional Requirements 5.1 and 5.2](#5-payment-gateway)** model email and payment systems, which are integrated for all account types
- [ ] **Step 7:** Implement **[Functional Requirement 2.4](#2-parking-lot-management)** sample license plate tracking
- [ ] **Step 8:** Finishing touches

## Notes on Deploying Computer Vision and Machine Learning on Backend Server
*(6/9/23-6/12/23)* It took me 3 days to deploy Machine Learning and Computer Vision to the Django server backend. My VPS (IONOS.com, \$2 bucks monthly for 10gb) only had 5.3G remaining after the server operating system and my other webpages. That's plenty of space for plain Django (Python + Libraries for Django are only ***80mb***), but when you add Machine Learning and Computer Vision (PyTorch, TorchVision and OpenCV) the libraries  add up to ***4.8gb***. Add folders for lot images and saved Torch Models and its impossible to run the backend on $2 monthly hosting. 

My solution was to backup an old laptop, reformat the entire hard drive,  install Ubuntu Server LTS, install a similar server environment (Nginx and Gunicorn), use Google Domains Dynamic DNS capabilities to link the domain backend.plan6.com to my new server, register it with  Certbot to support SSL encryption and deploy the latest version of the backend there. I never needed to touch the front end since the domain is the same (although the server is different)

The benefit of this 3 day procedure is huge: My new dedicated backend server stats:
- Harddrive 256GB SSD ***(25x more than previous server)***
- AMD Ryzen 5 4500U, 6 cores 2.3 GHz (turbo 4.0 GHz) ***(6x more than previous server)***
- 8gb RAM ***(8x more than previous server)***


The website's backend is not only able to do Computer Vision / Machine Learn easily now, but 
the whole website runs much faster and has tons of space for Lot cam footage.
  
## Notes on Parking Spot Occupancy Detection 

When I explained to GPT4 what I wanted to do, it recommended I use the YOLOv3 model to detect cars in parking spaces. YOLO is a model for detecting cars and other objects that doesn't require any training (you just tell it to look for cars and it does its thing). However, at night and in unusual weather it struggled. On 24 hour footage, it only had .58 recall, meaning it only registered cars in spaces 58% of time. 

That wasn't good enough so I worked with GPT4 to build models like cat-dog classifiers, using CNNs with PyTorch, to be applied to a cropped image of the space. I assigned a rectangle of the parking lot to each space, programmatically cropped the images and shaped them to 128x128 (now 256x256) and trained a model for each space based off of examples of cropped spaces containing a car, and without a car. 

The current model is based on 350 images, 5 CNN layers and uses Adam optimizer and early stopping to improve training results. It still makes mistakes, but mistakes are somewhat rare. 

The models will be periodically improved as more data comes in.

## Notes on PHP to Django API migration 
### Remade Semester 1 in Django. Django is more scalable and secure, almost production ready. A Python backend will be useful for machine learning in Requirements 2 and 3
- Migrating PHP to Django took 2 weeks, working about 1-3 hours a day
- ~20% of the ~4000 lines React frontend code was rewritten and refactored, Semester 2's frontend has about 400 fewer lines of code due to refactoring. 
- 100% of ~900 lines of PHP backend was rewritten in Django with Python. Roughly the same amount of code was needed in both languages.
- Thanks to VPS and having control over the server for Semester 2:
  - HTTPS support for React and the API in deployments (Installing Certbot with Let's Encrypt was possible)
  - Browser Router made it so hashes (#) weren't necessary in the URL (required for my previous shared hosting)
- Semester 2's version is professional, secure and works, but was originally slower than PHP. It performs better after now [that the server has been upgraded](#notes-on-deploying-computer-vision-and-machine-learning-on-backend-server)

|               | Semester 1 (4/4-4/27) | Semester 2 (6/1-now)  |
| ------------- |:------------:| -----:|
| Hosting       | Shared       | VPS (frontend) <br> Home Server (backend)|
| Server    | Apache       | Nginx, Gunicorn |
| Database      | MariaDB      | SQLite |
| Frontend  | ReactJS      | ReactJS |
| Backend  | PHP         | Python, Django |


## Semester 1 
**April 4 - April 27, 2023**

[Archive location, including last build](https://github.com/tc10815/ParkEzAI/tree/main/archive/part1),  

All Functional Requirements listed under _1. Account Management_ in Functional Requirements below were completed (**Functional Requirements 1.1, 1.2, 1.3, 1.4, 1.5 and 1.6**)

It was a working model, but PHP was basic and had inconsistent authentication: Not scalable or secure enough to be used in real life. About 4000 lines of code for the frontend (React) and 900 for the backend (PHP). 

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
* All text ('copy') users see on WebApp will be generated by ChatGPT-4.

![Sorcerer Mickey](./archive/img/mickey.jpg)

## Functional Requirements 
**Note: identical for ParkEzAi (this project) and group ParkEz class project**

ParkEzAI allows parking lot owners to see how many spaces are occupied in their lot, identify overparkers and record security to the cloud to revisit it later. It allows would be parkers to see how occupied a lot is and see the best spot. Advertisers can also place advertisements on the park lot page for the general public. 

#### 1. Account Management

* **1.1 Summarize Account:**	Basic summary of account (when subscribed, when will expire, type of account).
* **1.2 Authenticate Account:**	Authentication pages are where subscribed customers log in (both lot operators and advertisers).
* **1.3 Request Customer Support:**	A simple page where users can request customer support
* **1.4 Create Account:**	Where users can create an account.
* **1.5 Modify Account:**	Where users can make changes to their account, such as passwords
* **1.6 Cancel Account:**	Where users can cancel their account.

#### 2. Parking Lot Management

* **2.1 Track Occupancy:**	Tracking of how many spots are taken at what times, presented for individuals who manage parking lots
* **2.2 Access Footage Archive:**	Lot owners can access archived footage of their parking lots.
* **2.3 Detect Overparking:** 	Notification of whenever a space is occupied longer than a specified period of time.
* **2.4 Track License Plates:**	Tracking what license plates are registered at what times.

#### 3. Parking Lot Status

* **3.1 Search and Select Lot:**	Unsubscribed users can browse and search parking lots using ParkEZ. 
* **3.2 View Occupancy Shows:** unsubscribed users most optimal space available and occupancy of selected parking lot. View includes ads.
* **3.3 Access Occupancy Remotely:**	A non GUI element offers occupancy status data through an interface Parking Lot Managers can use with their website.

#### 4. Advertising Management

* **4.1 Create Ad:** Uploads ads.
* **4.2 Modify Ad:** Edits existing ad's content.
* **4.3 View Ad Statistics:** View impressions and clicks of placed ads.

#### 5. Payment Gateway

* **5.1 Define Payment Method:**	Users decide how they pay for their subscription (ad or lot manger).
* **5.2 Validate Payment:** 	Checks that customer payment method can be billed correctly.
