import { authenticateUser } from './_apiUtils.js';
import { db } from './_db.js';
import { preferences } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const [userPref] = await db.select().from(preferences).where(eq(preferences.userId, user.id));

    res.status(200).json({ hasPreferences: !!userPref });
  } catch (error) {
    console.error('Error checking preferences:', error);
    res.status(500).json({ error: 'Error checking preferences' });
  }
}