import { pgTable, serial, text, timestamp, uuid, boolean, integer, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  role: text('role').default('student'), // 'student' or 'teacher'
  createdAt: timestamp('created_at').defaultNow(),
});

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  date: timestamp('date').notNull(),
  board: text('board').notNull(),
  teacherId: uuid('teacher_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  examId: integer('exam_id').references(() => exams.id),
  date: timestamp('date').notNull(),
  timeOfDay: text('time_of_day').notNull(), // 'morning' or 'afternoon'
  topic: text('topic').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const preferences = pgTable('preferences', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionLength: integer('session_length').notNull(),
  days: json('days').notNull(), // JSON object storing days and times
  delayStart: boolean('delay_start').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});