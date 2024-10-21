import { config } from 'dotenv';
config();

import { authenticateUser } from './_apiUtils.js';
import { db } from './_db.js';
import { preferences, exams, preferencesToExams } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { exams: userExams, sessionPreferences } = req.body;

    // Save or Update preferences
    await db
      .insert(preferences)
      .values({
        userId: user.id,
        sessionLength: sessionPreferences.sessionLength,
        days: sessionPreferences.days,
        delayStart: sessionPreferences.delayStart,
      })
      .onConflictDoUpdate({
        target: preferences.userId,
        set: {
          sessionLength: sessionPreferences.sessionLength,
          days: sessionPreferences.days,
          delayStart: sessionPreferences.delayStart,
        },
      })
      .returning();

    // Delete old exams and mappings
    await db.delete(preferencesToExams).where(eq(preferencesToExams.userId, user.id));
    // Optionally, delete exams associated with the user, or keep them

    const examsData = [];

    // For each exam provided by the user
    for (const exam of userExams) {
      // Fetch syllabus using OpenAI API
      const prompt = `Provide a detailed syllabus breakdown in JSON format for the ${exam.subject} exam. The response should be an array of topics under a "syllabus" key, like: { "syllabus": ["Topic1", "Topic2", ...] }`;

      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.7,
      });

      const responseText = completion.data.choices[0].text.trim();
      let syllabus = [];

      try {
        const parsedResponse = JSON.parse(responseText);
        syllabus = parsedResponse.syllabus || [];
      } catch (err) {
        console.error('Error parsing syllabus:', err);
        syllabus = [];
      }

      // Insert exam into the exams table
      const [insertedExam] = await db.insert(exams)
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
    }

    res.status(200).json({ message: 'Preferences and exams saved successfully' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: 'Error saving preferences' });
  }
}