import { pgTable, serial, text, varchar, timestamp, date } from 'drizzle-orm/pg-core';

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  level: varchar('level', { length: 255 }).notNull(),
  year: varchar('year', { length: 10 }).notNull(),
  desc: text('desc').notNull(),
  url: text('url').notNull(), // base64 or url
  createdAt: timestamp('created_at').defaultNow(),
});

export const pickets = pgTable('pickets', {
  id: serial('id').primaryKey(),
  day: varchar('day', { length: 20 }).notNull(),
  students: text('students').array().notNull(), // array of student names
});

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  day: varchar('day', { length: 20 }).notNull(),
  subjects: text('subjects').array().notNull(), // array of subjects
});

export const documentations = pgTable('documentations', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  url: text('url').notNull(), // base64 or url
  date: varchar('date', { length: 100 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
