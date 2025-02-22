import bcrypt from 'bcryptjs';
import { users, pages } from './schema';
import { db, client } from './db';
import 'dotenv/config';

async function main() {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_EMAIL) {
    throw new Error('Missing environment variables ADMIN_PASSWORD or ADMIN_EMAIL');
  }
  try {
    console.log(`Seeding database...`);
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await db
      .insert(users)
      .values({
        email: process.env.ADMIN_EMAIL,
        name: 'Admin',
        password: passwordHash,
        role: 'admin',
      })
      .onConflictDoNothing();

    await db
      .insert(pages)
      .values({
        title: 'About',
        slug: 'about',
        content: 'Welcome to the about page',
      })
      .onConflictDoNothing();

    console.log(`Database seeded successfully.`);
  } catch (error) {
    console.error("Error checking or creating database 'delphi':", error);
  } finally {
    await client.end();
  }
}

main();
