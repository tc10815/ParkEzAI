# ParkEz AI

In this project, functional requirements taken from a 9 person, 2 semester class project (ParkEz) are being implemented by a single student, with AI assistance in coding, writing ('copy'), design and images (ParkEz AI). 

The goal of the product in both projects is to monitor parking lots for businesses using AI. *The larger goal of the ParkEz group class project is to learn documentation and Software Engineering methodologies as a team.* ***The larger goal of this version of the project is to understand AI's role in the future of programming from the perspective of the programmer***. 

- [Functional Requirements](#functional-requirements), what both the ParkEz AI and the group project ParkEz will actually do
- [Overview](#parkez-ai-project-overview), focusing on the AI process
- [Conclusions (Draft)](#conclusions-draft) An unfinished list of takeaways from the project
- [Task List](#task-list) from this semester's tasks to project completion
- [Semester 1 AI Prompts](https://github.com/tc10815/ParkEzAI/tree/main/archive/part1/prompt_logs_part1), [Semester 2 AI prompts](https://github.com/tc10815/ParkEzAI/tree/main/prompt_logs) used thus far 
- Notes:
  - [PHP to Django migration](#notes-on-php-to-django-api-migration)
  - [Parking Spot Occupancy Detection](#notes-on-parking-spot-occupancy-detection)
  - [Deploying Computer Vision and Machine Learning on Backend Server](#notes-on-deploying-computer-vision-and-machine-learning-on-backend-server)
  - [Semester 1: complete first semester project](#semester-1), where [Functional Requirements](#functional-requirements) 1.1, 1.2, 1.3, 1.4, 1.5 and 1.6 were completed with PHP 

## Live Parking Spot Detection Demo
[![Liveshot](https://backend.plan6.com/lots/github_view?camera=coldwatermi)](https://plan6.com/lot/coldwater)
Image updates every 30 minutes, refresh this GitHub page to view updated image. The ParkEz AI production machine learning models label the spots as occupied (Red) or free (green). Monroe Street in Coldwater, Michigan. 

Occasionally the models mislabel a spot, although fairly rarely. See more by [clicking the image](https://plan6.com/lot/coldwater).

# ParkEz AI: Semester 2 ([plan6.com](https://plan6.com) - updated 9/08/2023)
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
  - [x] Create auto uploader for Coldwater lot, uploads to ParkEz AI every 30 minutes
  - [x] **[Functional Requirement 3.2](#3-parking-lot-status)**: Create view that shows lots to public, included occupancy and best space
  - [x] **[Functional Requirement 3.1](#3-parking-lot-status)**: Create view with search that shows all available parking lots (including placeholders) to public
  - [x] **[Functional Requirement 3.3](#3-parking-lot-status)**: Create a API endpoint that usable for general external websites and apps that shows public lot data 
- [x] **Step 4:** Implement **[Functional Requirements 2.1, 2.3  and 2.3](#2-parking-lot-management)** by integrating Step 2's scripts with Django
  - [x] **[Functional Requirement 2.1](#2-parking-lot-management)**: Integrate track occupancy with Lot Owner Interface with bonus features 
  - [x] **[Function Requirement 2.2](#2-parking-lot-management)**: Integrate lot image / occupancy data archive in a way that provides lot owners with useful information 
  - [x] **[Function Requirement 2.3](#2-parking-lot-management)**: Create overparking detection, alert and review system and provide interface for lot owners
- [x] **Step 5:** Implement **[Functional Requirements 4.1, 4.2, 4.3](#4-advertising-management)** advertisement system
  - [x] **[Functional Requirement 4.1](#4-advertising-management)**: Create ad, upload ad
  - [x] **[Function Requirement 4.2](#4-advertising-management)**: Modify ad, edits existing ad's content
  - [x] **[Function Requirement 4.3](#4-advertising-management)**: View Ad Statistics, in including impressions and clicks
  - [x] Ad renders correctly on public lot pages; ads are displayed with equal frequency when more than one ad is for a lot. 
- [x] **Step 6:** Implement **[Functional Requirements 5.1 and 5.2](#5-payment-gateway)** model email and payment systems, which are integrated for all account types (this is a demonstration program, so I will not verify and charge real credit cards)
- [x] **Step 7:** Implement **[Functional Requirement 2.4](#2-parking-lot-management)** model license plate tracking
  - [x] Create API infrastructure to receive license plate data, and frontend ability to display it, with random filler data. Reading peoples license plates and posting it on a public demo website is not ethnical, so I won't do it*
- [ ] **Step 8:** Finishing touches
  - [ ] Ensure all appropriate roles can access same Lot information as Lot Operator.
  - [ ] Ensure all appropriate roles can access same Advertisement  information as Advertiser.
  - [ ] Rebuild parking lot detection models with newest training data to increase accuracy of parking detection
  - [ ] Clean up web design of ParkEz AI (I'm not a web designer, but I want to make it look a little nicer)
  - [ ] Refactor some redundant code (GPT-4 produces a lot of duplicate code, so moving some of it to utility files is an easy and worthwhile task). Get rid of console.logs.
  - [ ] Make it so "Reset Database with Demonstration Data" button works again (it currently doesn't reset ads/payment/invoices and breaks associations with ads/payment/invoices). It can ignore lot data since there's no control over that in the app.
  - [ ] Create short, narrated video that briefly explains project and demonstrates ParkEz AI's completed functionality. 

<br> 
  <em>*Someday as an addendum to this project I may post code that reads license plates live and sends it to an API endpoint, although I'll never have a live demo.</em>

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

When I explained to GPT-4 what I wanted to do, it recommended I use the YOLOv3 model to detect cars in parking spaces. YOLO is a model for detecting cars and other objects that doesn't require any training (you just tell it to look for cars and it does its thing). However, at night and in unusual weather it struggled. On 24 hour footage, it only had .58 recall, meaning it only registered cars in spaces 58% of time. 

That wasn't good enough so I worked with GPT-4 to build models like cat-dog classifiers, using CNNs with PyTorch, to be applied to a cropped image of the space. I assigned a rectangle of the parking lot to each space, programmatically cropped the images and shaped them to 128x128 (now 256x256) and trained a model for each space based off of examples of cropped spaces containing a car, and without a car. 

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

# ParkEz AI (Project Overview)
How people code is changing. Over the last year (2022-2023) AI has become powerful and accessible enough to provide real productivity gains for programmers. This Web Application is an exploration of what coding may be like when AI assistance becomes the norm. 

In this project, functional requirements taken from a large class project are being implemented with AI assistance in coding, writing ('copy'), design and images.

ParkEz is a year long school project I'm working on as part of a large team (9 people) which I contributed to the design, but is being implemented by others. The requirements of ParkEz (school project) and ParkEz AI are exactly the same, but the implementation is entirely different, entirely independent. ParkEz AI is coded by one person (me) using mostly code generated by ChatGPT-4. 

When ParkEz AI began development, the ParkEz school project was mostly unimplemented, with only the frontend of the homepage, login page and new account page implemented with no backend. None of the code, design, text or images was used in ParkEz AI.

## The AI Assisted Process
* AI tools used are ChatGPT-4 and Dall·E 2.
* Goal is to have at least 80% code written by AI.
* Includes all prompts and the exact responses in GitHub repo for reference.
* Some images are be created with Dall·E 2 (logo, some embedded imagines)*
* All loge blocks of text ('copy') users see on WebApp are generated by ChatGPT-4.

**The logo was created by AI, but all other images are public stock images from websites GPT-4 recommended. Dall·E 2's images didn't look natural in 2023*

![Sorcerer Mickey](./archive/img/mickey.jpg)

## Functional Requirements 
**Note: identical for ParkEz AI (this project) and group ParkEz class project**

ParkEz AI allows parking lot owners to see how many spaces are occupied in their lot, identify overparkers and record security to the cloud to revisit it later. It allows would be parkers to see how occupied a lot is and see the best spot. Advertisers can also place advertisements on the park lot page for the general public. 

#### 1. Account Management

* [x] **1.1 Summarize Account:**	Basic summary of account (when subscribed, when will expire, type of account).
* [x] **1.2 Authenticate Account:**	Authentication pages are where subscribed customers log in (both lot operators and advertisers).
* [x] **1.3 Request Customer Support:**	A simple page where users can request customer support
* [x] **1.4 Create Account:**	Where users can create an account.
* [x] **1.5 Modify Account:**	Where users can make changes to their account, such as passwords
* [x] **1.6 Cancel Account:**	Where users can cancel their account.

#### 2. Parking Lot Management

* [x] **2.1 Track Occupancy:**	Tracking of how many spots are taken at what times, presented for individuals who manage parking lots
* [x] **2.2 Access Footage Archive:**	Lot owners can access archived footage of their parking lots.
* [x] **2.3 Detect Overparking:** 	Notification of whenever a space is occupied longer than a specified period of time.
* [x] **2.4 Track License Plates:**	Tracking what license plates are registered at what times.*

#### 3. Parking Lot Status

* [x] **3.1 Search and Select Lot:**	Unsubscribed users can browse and search parking lots using ParkEZ. 
* [x] **3.2 View Occupancy Shows:** Unsubscribed users most optimal space available and occupancy of selected parking lot. View includes ads.
* [x] **3.3 Access Occupancy Remotely:**	A non GUI element offers occupancy status data through an interface Parking Lot Managers can use with their website.

#### 4. Advertising Management

* [x] **4.1 Create Ad:** Uploads ads.
* [x] **4.2 Modify Ad:** Edits existing ad's content.
* [x] **4.3 View Ad Statistics:** View impressions and clicks of placed ads.

#### 5. Payment Gateway

* [x] **5.1 Define Payment Method:**	Users decide how they pay for their subscription (ad or lot manger).
* [x] **5.2 Validate Payment:** 	Checks that customer payment method can be billed correctly.

*Note: I checked off a requirement as complete when at least 1 type of user can do it. I still need to adapt permissions so all intended  user account types can do all requirements in finishing touches*

*<em>Create API infrastructure to receive license plate data, and frontend ability to display it, with random filler data. Reading peoples license plates and posting it on a public demo website is not ethnical, so I won't do it</em>

# Conclusions (draft) 
***Note: This is a working document, and won't be complete until the first version of the project is complete***

As of 2023, ChatGPT-4 is incredible at solving programming problems when presented as small, discrete tasks. Even in its current state, I was able make ParkEz AI significantly faster and with slightly less knowledge than previously possible.

Using ChatGPT-4 for ParkEz AI, I've also seen its limitations. It's not possible for someone who knows nothing to build a complex application yet. While GPT-4 generated most of the code for my project, it almost never worked the first time; I'd almost always have to remix and debug GPT-4's code to get it to do what I wanted. Although with GPT-4 you need less specific knowledge to make progress, you still need a deep understanding of what's happening in the code to avoid getting stuck.

There were times when GPT-4's code was so problematic that it would have been faster if I just wrote it myself, but it mostly it saved me time, helped me debug faster, and helped me do things with code I hadn't mastered yet. Using some basic strategies when interacting with GTP-4 can increase productivity. 

### What skills are necessary working with AI to code?
Going into the project I had a **very strong background in Java, OOP and CS theory** from my undergraduate degree and some software internships in the late 00's. I learned **Python, basic machine learning with Keras/scikit-learn, Jupyter Notebook and some very basic React** working on my graduate degree 2021-2023.  

I had **no real experience with PHP**, so for the Semester 1 project backend I relied on GPT for almost everything. It succeeded in making a working demo where accounts could be made and modified from other accounts, but authentication was inconsistent and it could easily be abused by bad actors. It worked as a demo but could never be used for real life. 

Semester 2 I changed webservers and could now use Gunicorn, so I wanted to change to a Python-based backend to easily deploy real time machine learning. With my PHP experience in Semester 1, I learned I could not depend on GPT-4 to build a good website without me also understanding the code, so in May, 2023 I read the first half of two books: William S. Vincent's Django for Beginners and Django for APIs. **Thanks to studying Django for a month before starting the project with GPT-4, the resulting Django backend is much higher quality and more resilient than Semester 1's PHP backend**

### Tips 
***Note: These tips are from my personal experience making ParkEz AI alone. I'm not quoting or referencing any other material***

1. **Don't ask GPT-4 to do too much in a single prompt.** If you ask it to do something that requires too many steps, it will give you an answer that looks correct, and probably runs, but won't actually do what you were hoping. You'll save time in the long run by breaking complex tasks into multiple prompts and checking each step along the way.
2. **Include as much relevant context/code as possible in all prompts.** GPT-4 does remember code it wrote in previous messages, and code you previously sent it, but as the conversation continues it gets forgetful and starts making mistakes. I find it makes the fewest errors when I send it *all of the relevant code* needed for the answer in every prompt, omitting as much unrelated code as possible. 
3. **Exclude as much irrelevant code as possible in difficult prompts.** I've noticed I get lower quality responses if you include unrelated code in your prompt, such as unrelated functions and CSS code in React. I'll still include unnecessary code for basic requests since its time consuming to clean up, but for very difficult requests I'm careful to keep context as concise as possible.
4. **Mention versions of the software you are using if you are having issues.** With React, in particular, there's different ways of doing things with different versions of the framework. In 2023, GPT-4 only knows code up to late 2021, so most of its knowledge is going to be out of date. In ParkEz AI, GPT-4 was never completely stumped about how to do something with modern techniques, but a few times I've had to tell it my versions to get the right answer.
5. **Ask it big picture questions, not just for code**. I would have made ParkEz AI a lot differently if I hadn't occasionally discussed what I was doing with GPT-4. It's advice wasn't always great (the original method of detecting cars it recommended with the YOLO model took me days to implement and ultimately didn't work that well), but many times it gave me good perspective.
6. **It performs much better when you give it an example of something similar elsewhere in the code in the prompt**