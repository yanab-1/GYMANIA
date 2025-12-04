
Team Members
Yash Bansal(leader)
Dhruv Agrawal
Saksham Gupta
Kush Kumar
Chirag Guatam

Problem Statement 

3. Gym Membership & Workout Tracking 
System  
1. Background  
Gym owners often struggle with managing memberships, tracking attendance, and retaining 
members, while gym-goers find it difficult to track their physical progress, workout routines, 
and diet plans consistently. A disconnected experience leads to low motivation for members 
and operational inefficiencies for owners.  
2. Challenge  
Develop a unified platform that serves both Gym Management (Business) and Members 
(Fitness). The system must streamline administrative tasks like billing and attendance while 
providing members with digital tools to log workouts, track body metrics, and book sessions 
with trainers.  
3. User Roles & Flow  
Member (App User)  
● Registration & Plan Purchase: Signs up and purchases a membership plan 
(Monthly/Yearly) via payment gateway.  
● QR Check-in: Scans a QR code at the gym entrance to mark daily attendance. ● 
Workout Logger: logs exercises, sets, reps, and weights during a session.  
● Progress Tracking: Views graphs of weight loss, muscle gain, or strength 
improvements over time.  
● Booking: Books slots for group classes (Zumba, Yoga) or personal training sessions.  
Admin (Gym Owner/Manager)  
● Dashboard: Views active members, expiring memberships, and daily revenue.  
● Staff Management: Manages trainer profiles and shifts.  
● Notifications: Sends automated reminders for fee payments and membership 
renewals.  
● Equipment Maintenance: Tracks equipment status and schedules repairs.  
Trainer  
● Client Management: Assigns workout routines and diet plans to specific clients.  
● Performance Review: Monitors client logs and suggests improvements. ● 
Schedule: Manages availability for personal training slots.  
4. Core Requirements  
Functional  
● Membership Engine: Automated handling of start dates, end dates, and freezing 
memberships.  
● Attendance System: Geo-fenced or QR-based check-in system to prevent proxy 
attendance.  
● Workout & Diet Builder: Drag-and-drop interface for trainers to create custom plans.  
● Visual Analytics: Interactive charts for members to visualize progress (e.g., "Bench 
Press max over 6 months").  
● Payment Integration: Recurring billing or one-time payment support.  
Non-Functional  
● Mobile Responsiveness: The member interface must be mobile-first (as users carry 
phones in the gym).  
● Latency: Instant updates for check-ins and slot booking.  
● Scalability: Ability to handle multiple gym branches under one brand.  
5. Technical Hints (Teams may choose their own stack)  
● Mobile App: React Native or Flutter (Critical for the Member role).  
● Web Dashboard: React/Next.js (For Admin/Trainers).  
● Backend: Node.js, Django, or Go.  
● Database: PostgreSQL (User data/transactions) + NoSQL (Workout logs/heavy read 
data).  
● Visualization: Recharts or Chart.js for progress graphs.  
● Extras: Cron jobs for expiration checks and automated emails.  
6. Hackathon Deliverables  
● Working Prototype demonstrating:  
○ Member flow: Buy Plan → QR Check-in → Log Workout → View Graph.  
○ Admin flow: Dashboard Stats → Manage Members → Renew Subscription.  
○ Trainer flow: Assign Diet Plan → View Client Progress.  
● Database Schema: A clear ER Diagram showing relationships between Users, 
Plans, Workouts, and Attendance.  
● Pitch & Demo: Demonstration of the "Check-in" process and the "Workout Logging" 
experience. 
