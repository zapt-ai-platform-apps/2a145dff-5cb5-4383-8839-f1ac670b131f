# Upgrade

## Overview

Upgrade is an app designed to help students create a personalized revision timetable in preparation for their school examinations. The app schedules revision sessions based on the student's availability and preferences, ensuring comprehensive coverage of all exam topics by generating study sessions that cover the entire syllabus.

## User Journeys

### Student Journey

1. **Account Creation**
   - The student navigates to the app and creates an account using their email address or signs in using Google, Facebook, or Apple.
   - They see "Sign in with ZAPT" above the authentication options.
   - A link to [ZAPT](https://www.zapt.ai) is available, opening in a new tab.

2. **Initial Setup**
   - Upon first login, if the student hasn't set up their preferences, they are directed to the setup page.
   - The student adds their exams by entering the subject, date, and optional examination board.
   - They can add multiple exams to their schedule.

3. **Fetching Syllabus**
   - For each exam added, the app automatically fetches the detailed syllabus using AI, ensuring all topics are covered in the revision timetable.

4. **Setting Preferences**
   - The student selects which days of the week they would like to revise, choosing between morning, afternoon, or both for each day.
   - The student specifies the desired length of each revision session (from 30 minutes to 2 hours).
   - An option is available to delay the start date of the revision schedule by one week if desired.

5. **Generating Timetable**
   - Based on the provided exams, syllabus, and preferences, the app generates a revision timetable in a monthly calendar view.
   - Each session is scheduled between the current date (or delayed start date) and a week before the exam date.
   - Sessions are intelligently assigned topics from the syllabus, ensuring comprehensive coverage.
   - If the student provided confidence levels (if implemented), the sessions can be weighted accordingly.

6. **Using the Timetable**
   - The student can view their timetable, which outlines the subjects and specific topics to study in each session.
   - Sessions can be marked as complete or incomplete.
   - The timetable ensures that all syllabus topics are reviewed before the exam.

7. **Rescheduling Sessions**
   - The student can drag and drop sessions to different times or days within the calendar.
   - Upon dragging a session, the student can reschedule it to a new date and time.

8. **Customization**
   - The student can edit the subject or length of a session directly within the calendar.
   - The design is responsive and user-friendly across all devices.

## External APIs Used

- **OpenAI API**
  - Used to fetch the detailed syllabus for each exam subject added by the student.
  - This ensures that the revision timetable covers all necessary topics.

- **ZAPT Authentication**
  - Used for student authentication, providing secure account management.

## Environment Variables

- `VITE_PUBLIC_APP_ID`: Your app ID for ZAPT integration.
- `NEON_DB_URL`: Your Neon database URL for storing app data.
- `OPENAI_API_KEY`: Your OpenAI API key for fetching exam syllabi.

## Notes

- The app is free to use.
- The calendar supports drag-and-drop functionality for easy rescheduling.
- The design is responsive and user-friendly across all devices.
- All buttons have hover effects and are disabled during loading states to prevent multiple submissions.
- The app uses '@neodrag/solid' for drag-and-drop functionality.
