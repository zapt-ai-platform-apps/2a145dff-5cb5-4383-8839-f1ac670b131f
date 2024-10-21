# Upgrade

## Overview

Upgrade is an app designed to help students create a personalized revision timetable in preparation for their school examinations. The app schedules revision sessions based on the student's availability and preferences, ensuring an equal distribution of study time across all subjects or weighted based on confidence levels.

## User Journeys

### Student Journey

1. **Account Creation**
   - The student navigates to the app and creates an account using their school email address or signs in using Google, Facebook, or Apple.
   - They see "Sign in with ZAPT" above the authentication options.
   - A link to [ZAPT](https://www.zapt.ai) is available, opening in a new tab.

2. **Initial Setup**
   - Upon first login, the student is presented with exams they will be sitting, including dates, examination boards, and their teachers.
   - The student selects the exams they will be taking.

3. **Setting Preferences**
   - The student selects which days of the week they would like to revise, choosing between morning, afternoon, or both for each day.
   - The student specifies the desired length of each revision session (from 30 minutes to 2 hours).
   - An option is available to delay the start date of the revision schedule if desired.

4. **Generating Timetable**
   - Based on the provided information and preferences, the app generates a revision timetable in a monthly calendar view.
   - Each session is scheduled between the current date (or delayed start date) and a week before the exam date.
   - Sessions are assigned to subjects either equally or weighted based on the student's confidence levels in each subject (if provided).

5. **Using the Timetable**
   - The student can view their timetable, which outlines the subjects and topics to study in each session.
   - Each session is dedicated to a specific section of the exam syllabus, ensuring comprehensive coverage of all topics.
   - Sessions can be marked as complete or incomplete.

6. **Rescheduling Sessions**
   - The student can drag and drop sessions to different times or days within the calendar.
   - Upon dragging a session, the student can reschedule it to a new date and time.

7. **Customization**
   - The student can edit the subject or length of a session directly within the calendar.
   - The design is responsive and user-friendly across all devices.

8. **Confidence Ranking (Optional)**
   - The student has the option to rank their confidence in each subject on a scale from 1 to 3.
   - The app weights the scheduling of sessions based on these rankings, allocating more time to subjects with lower confidence scores.

### Teacher Journey

1. **Account Creation**
   - The teacher creates an account using their school email address or signs in using Google, Facebook, or Apple.
   - They see "Sign in with ZAPT" above the authentication options.

2. **Viewing Student Progress**
   - The teacher can view the progress of each student in their class for a particular subject.
   - This includes seeing which sessions have been marked as complete or incomplete.

## External APIs Used

- **ZAPT Authentication**
  - Used for student and teacher authentication, providing secure account management.

- **Exam Syllabus API** (Placeholder)
  - Fetches the exam syllabus content to populate revision sessions with specific topics.

## Environment Variables

- `VITE_PUBLIC_APP_ID`: Your app ID for ZAPT integration.
- `NEON_DB_URL`: Your Neon database URL for storing app data.

## Notes

- The app is free to use.
- The calendar supports drag-and-drop functionality for easy rescheduling.
- The design is responsive and user-friendly across all devices.
- All buttons have hover effects and are disabled during loading states to prevent multiple submissions.
- The app uses '@neodrag/solid' for drag-and-drop functionality.