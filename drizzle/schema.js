import { pgTable, serial, text, timestamp, uuid, boolean, integer, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  role: text('role').default('student'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  date: timestamp('date').notNull(),
  board: text('board'),
  teacherId: uuid('teacher_id').references(() => users.id),
  syllabus: json('syllabus'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const preferencesToExams = pgTable('preferences_to_exams', {
  userId: uuid('user_id').references(() => users.id),
  examId: integer('exam_id').references(() => exams.id),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  examId: integer('exam_id').references(() => exams.id),
  date: timestamp('date').notNull(),
  timeOfDay: text('time_of_day').notNull(),
  topic: text('topic').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const preferences = pgTable('preferences', {
  userId: uuid('user_id').references(() => users.id).primaryKey(),
  sessionLength: integer('session_length').notNull(),
  days: json('days').notNull(),
  delayStart: boolean('delay_start').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});