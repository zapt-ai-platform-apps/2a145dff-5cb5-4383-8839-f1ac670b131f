import { authenticateUser } from './_apiUtils.js';
import { db } from './_db.js';
import { preferences, sessions, exams, preferencesToExams } from '../drizzle/schema.js';
import { eq, inArray } from 'drizzle-orm';
import dayjs from 'dayjs';

function generateSessions(preferencesData, examsData) {
  const sessionsList = [];
  const { days, sessionLength, delayStart } = preferencesData;
  const startDate = delayStart ? dayjs().add(1, 'week') : dayjs();

  examsData.forEach((exam) => {
    const examDate = dayjs(exam.date);
    let currentDate = startDate.clone();

    const syllabusTopics = Array.isArray(exam.syllabus) && exam.syllabus.length > 0 ? exam.syllabus : [`Study ${exam.subject}`];
    let topicIndex = 0;

    while (currentDate.isBefore(examDate.subtract(1, 'week')) && topicIndex < syllabusTopics.length) {
      const dayOfWeek = currentDate.format('dddd');
      const availableTimes = days[dayOfWeek];

      if (availableTimes) {
        if (availableTimes.morning && topicIndex < syllabusTopics.length) {
          sessionsList.push({
            userId: preferencesData.userId,
            examId: exam.id,
            date: currentDate.format('YYYY-MM-DD'),
            timeOfDay: 'morning',
            topic: syllabusTopics[topicIndex] || `Study ${exam.subject} - Morning Session`,
            subject: exam.subject,
            completed: false,
          });
          topicIndex++;
        }

        if (availableTimes.afternoon && topicIndex < syllabusTopics.length) {
          sessionsList.push({
            userId: preferencesData.userId,
            examId: exam.id,
            date: currentDate.format('YYYY-MM-DD'),
            timeOfDay: 'afternoon',
            topic: syllabusTopics[topicIndex] || `Study ${exam.subject} - Afternoon Session`,
            subject: exam.subject,
            completed: false,
          });
          topicIndex++;
        }
      }

      currentDate = currentDate.add(1, 'day');
    }
  });

  return sessionsList;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const [userPref] = await db.select().from(preferences).where(eq(preferences.userId, user.id));

    if (!userPref) {
      return res.status(400).json({ error: 'User preferences not found' });
    }

    let userSessions = await db.select().from(sessions).where(eq(sessions.userId, user.id));

    if (userSessions.length === 0) {
      const examMappings = await db
        .select()
        .from(preferencesToExams)
        .where(eq(preferencesToExams.userId, user.id));

      const examIds = examMappings.map((mapping) => mapping.examId);

      const examsData = await db
        .select()
        .from(exams)
        .where(inArray(exams.id, examIds));

      const generatedSessions = generateSessions(userPref, examsData);

      if (generatedSessions.length > 0) {
        await db.insert(sessions).values(generatedSessions);
        userSessions = generatedSessions;
      }
    }

    res.status(200).json(userSessions);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Error fetching timetable: ' + error.message });
  }
}