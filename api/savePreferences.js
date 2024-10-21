import { config } from 'dotenv';
config();

import { authenticateUser } from './_apiUtils.js';
import { db } from './_db.js';
import { preferences, exams, preferencesToExams, users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { initializeZapt } from '@zapt/zapt-js';

const { createEvent } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { exams: userExams, sessionPreferences } = req.body;

    // Check if the user exists in the users table
    const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

    if (existingUser.length === 0) {
      // If the user doesn't exist, insert them into the users table
      await db.insert(users).values({
        id: user.id,
        email: user.email,
      });
    }

    // Check if preferences already exist for this user
    const existingPreferences = await db.select().from(preferences).where(eq(preferences.userId, user.id)).limit(1);

    if (existingPreferences.length > 0) {
      // Update existing preferences
      await db
        .update(preferences)
        .set({
          sessionLength: sessionPreferences.sessionLength,
          days: sessionPreferences.days,
          delayStart: sessionPreferences.delayStart,
        })
        .where(eq(preferences.userId, user.id));
    } else {
      // Insert new preferences
      await db
        .insert(preferences)
        .values({
          userId: user.id,
          sessionLength: sessionPreferences.sessionLength,
          days: sessionPreferences.days,
          delayStart: sessionPreferences.delayStart,
        });
    }

    // Delete old exams and mappings
    await db.delete(preferencesToExams).where(eq(preferencesToExams.userId, user.id));

    const examsData = [];

    // For each exam provided by the user
    for (const exam of userExams) {
      // Fetch syllabus using 'chatgpt_request' event
      const prompt = `Provide a detailed list of topics for the ${exam.subject} exam. The response should be in JSON format with a "syllabus" key, like this: { "syllabus": ["Topic 1", "Topic 2", "Topic 3"] }`;

      try {
        const result = await createEvent('chatgpt_request', {
          prompt: prompt,
          response_type: 'json',
        });

        console.log('Received syllabus:', result);

        let syllabus = result.syllabus;
        if (!Array.isArray(syllabus)) {
          throw new Error('Invalid syllabus format received');
        }

        // Insert exam into the exams table
        const [insertedExam] = await db
          .insert(exams)
          .values({
            subject: exam.subject,
            date: exam.date,
            board: exam.board || '',
            teacherId: null,
            syllabus,
          })
          .returning();

        examsData.push(insertedExam);

        // Link exam to user preferences
        await db.insert(preferencesToExams).values({
          userId: user.id,
          examId: insertedExam.id,
        });
      } catch (err) {
        console.error('Error fetching syllabus:', err);

        // Handle the error by setting a default syllabus
        let defaultSyllabus = [`Study ${exam.subject}`];

        // Insert exam with default syllabus
        const [insertedExam] = await db
          .insert(exams)
          .values({
            subject: exam.subject,
            date: exam.date,
            board: exam.board || '',
            teacherId: null,
            syllabus: defaultSyllabus,
          })
          .returning();

        examsData.push(insertedExam);

        // Link exam to user preferences
        await db.insert(preferencesToExams).values({
          userId: user.id,
          examId: insertedExam.id,
        });
      }
    }

    res.status(200).json({ message: 'Preferences and exams saved successfully' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: 'Error saving preferences: ' + error.message });
  }
}