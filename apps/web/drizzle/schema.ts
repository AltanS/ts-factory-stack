import type { RoleType } from '#drizzle/types/enums';
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  primaryKey,
  vector,
  index,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  deactivated: boolean('deactivated').default(false).notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  role: text('role').$type<RoleType>().default('editor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type InsertArticle = InferInsertModel<typeof articles>;
export type SelectArticle = InferSelectModel<typeof articles>;

export const articlesRelations = relations(articles, ({ many }) => ({
  authors: many(users),
  categories: many(categories),
}));

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export type InsertCategory = InferInsertModel<typeof categories>;
export type SelectCategory = InferSelectModel<typeof categories>;

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type InsertPage = InferInsertModel<typeof pages>;
export type SelectPage = InferSelectModel<typeof pages>;

export const pagesRelations = relations(pages, ({ many, one }) => ({
  authors: many(users),
  category: one(categories),
}));
