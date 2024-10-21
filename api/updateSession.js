import { authenticateUser } from './_apiUtils.js';
import { db } from './_db.js';
import { sessions } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { sessionId, completed } = req.body;

    await db
      .update(sessions)
      .set({ completed })
      .where(eq(sessions.id, sessionId), eq(sessions.userId, user.id));

    res.status(200).json({ message: 'Session status updated successfully' });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ error: 'Error updating session status' });
  }
}