# Upgrade

## Overview

Upgrade is an application designed to help students create a personalized revision timetable for their upcoming school examinations. By inputting their exam details and preferences, students receive a comprehensive study schedule that covers all topics in their syllabi, ensuring they are thoroughly prepared for each exam.

## User Journeys

### 1. Account Creation and Login

1. **Visit the App**: The student navigates to the Upgrade app.
2. **Sign In**: They see "Sign in with ZAPT" above the authentication options.
3. **Choose Authentication Method**: The student can sign in using their email or social login providers like Google, Facebook, or Apple.
4. **Learn More**: A link to [ZAPT](https://www.zapt.ai) is available, opening in a new tab for students who want more information.

### 2. Initial Setup

1. **Redirect to Setup**: Upon first login, if the student hasn't set up their preferences, they are directed to the setup page.
2. **Add Exams**:
   - **Input Details**: The student enters each exam's subject, date, and optional examination board.
   - **Multiple Exams**: They can add multiple exams by repeating the process.
3. **Set Availability**:
   - **Select Days**: The student selects which days of the week they are available to study.
   - **Choose Times**: For each selected day, they specify whether they can study in the morning, afternoon, or both.
4. **Session Preferences**:
   - **Session Length**: They set the desired length of each revision session (ranging from 30 minutes to 2 hours).
   - **Delay Start Option**: An option is available to delay the start date of the revision schedule by one week if desired.

### 3. Generating the Timetable

1. **Fetch Syllabus**: The app automatically fetches the detailed syllabus for each exam subject using AI via the 'chatgpt_request' event, ensuring all topics are covered.
2. **Create Schedule**:
   - **Algorithm**: Based on the exams, syllabi, and preferences, the app generates a personalized revision timetable.
   - **Scheduling**: Sessions are spread between the current date (or delayed start date) and one week before the exam date.
   - **Topic Coverage**: Each session is assigned specific topics from the syllabus, ensuring comprehensive coverage before the exam.

### 4. Using the Timetable

1. **View Calendar**: The student views their timetable in a monthly calendar format.
2. **Session Details**:
   - **Session Info**: Each session displays the subject and specific topics to study.
   - **Completion Status**: Sessions can be marked as complete or incomplete.
3. **Interactivity**:
   - **Rescheduling**: Students can drag and drop sessions to different dates or times directly within the calendar.
   - **Editing**: They can edit the subject or length of a session as needed.
4. **Responsive Design**: The app provides a user-friendly experience across all devices, ensuring accessibility and ease of use.

### 5. Account Management

1. **Sign Out**: Students can securely sign out of their account using the "Sign Out" button.
2. **Session Persistence**: All data is saved, ensuring that their timetable and preferences are maintained upon subsequent logins.

## External Services Used

- **ZAPT Platform**:
  - Used for secure user authentication.
  - Facilitates AI interactions through events like 'chatgpt_request' for fetching syllabi.
- **Neon Database**:
  - Serves as the backend database to store user preferences, exams, and sessions.
  - Provides a scalable and efficient storage solution for application data.

## Environment Variables

- `VITE_PUBLIC_APP_ID`: The App ID for ZAPT integration.
- `NEON_DB_URL`: The connection string for the Neon database used to store application data.

## Notes

- **Free to Use**: The app is completely free for students.
- **No API Costs**: All AI requests and functionalities are handled without additional costs to the user.
- **Real-Time Updates**: Changes in authentication state (sign in/out) are immediately reflected in the UI without requiring a page refresh.
- **User-Friendly Design**: Buttons have hover effects and are disabled during loading states to prevent multiple submissions.
- **Responsiveness**: The app is designed to be responsive, providing a seamless experience on both desktop and mobile devices.
- **Drag-and-Drop Functionality**: Implemented using '@neodrag/solid' for intuitive rescheduling of sessions.

## External APIs and Services

- **ChatGPT (via ZAPT Platform)**:
  - Used for fetching the detailed syllabus for each exam subject.
  - Ensures that all relevant topics are covered in the generated timetable.

## Required Environment Variables in Vercel

- Ensure that `VITE_PUBLIC_APP_ID` and `NEON_DB_URL` are set in the Vercel project's environment variables settings.
- **Note**: Do not include `.env` files in production. Vercel manages environment variables securely.

## Build and Deployment Notes

- The app uses Vite for building the frontend and serverless functions for the backend API routes.
- Ensure that the `vite.config.js` file is updated to support Vite version 4.
- Removed deprecated options like `polyfillDynamicImport` from the Vite configuration.
- Adjusted the Vite configuration to exclude server-only modules from the client-side bundle.
