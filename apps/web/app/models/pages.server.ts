import type { SelectPage, InsertPage } from '#drizzle/schema';
import { pages } from '#drizzle/schema';
import { db } from '#drizzle/db';
import { eq } from 'drizzle-orm';

export async function getPages() {
  return db.query.pages.findMany();
}

export async function getPageById(id: number): Promise<SelectPage> {
  const page = await db.query.pages.findFirst({
    where: eq(pages.id, id),
  });
  if (!page) {
    throw new Error(`Page with id ${id} not found`);
  }
  return page;
}

export async function createPage({ data }: { data: InsertPage }) {
  const [page] = await db.insert(pages).values(data).returning();
  return page;
}

export async function updatePage({ id, data }: { id: number; data: Partial<SelectPage> }) {
  const [updatedPage] = await db.update(pages).set(data).where(eq(pages.id, id)).returning();
  return updatedPage;
}

export async function deletePage(id: number) {
  return db.delete(pages).where(eq(pages.id, id));
}
