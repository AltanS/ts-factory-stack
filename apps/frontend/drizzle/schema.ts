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
  boolean
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
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
