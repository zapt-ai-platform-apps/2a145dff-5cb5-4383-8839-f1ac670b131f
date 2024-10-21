import { authenticateUser } from './_apiUtils.js';
import { db } from './_db.js';
import { preferences, preferencesToExams } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { selectedExams, sessionPreferences } = req.body;

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

    await db.delete(preferencesToExams).where(eq(preferencesToExams.userId, user.id));

    const examMappings = selectedExams.map((examId) => ({
      userId: user.id,
      examId,
    }));

    if (examMappings.length > 0) {
      await db.insert(preferencesToExams).values(examMappings);
    }

    res.status(200).json({ message: 'Preferences saved successfully' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: 'Error saving preferences' });
  }
}