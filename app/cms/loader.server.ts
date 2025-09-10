import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import yaml from "yaml";
import { z } from "zod";

import { registry } from "#app/cms/registry";
import type {
  ContentEntry,
  DataItem,
  AnyConfig,
  ContentConfig,
  DataConfig,
} from "#app/cms/types";

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

function absoluteDir(dir: string) {
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

async function listFiles(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => path.join(dir, e.name));
}

function baseId(filePath: string) {
  return path.basename(filePath).replace(/\.[^.]+$/, "");
}

async function readText(filePath: string) {
  return fs.readFile(filePath, "utf-8");
}

function parseContentFrontmatter<T extends z.ZodTypeAny>(
  schema: T,
  filePath: string,
  content: string,
) {
  if (filePath.endsWith(".md") || filePath.endsWith(".markdown") || filePath.endsWith(".mdx")) {
    const { data, content: body } = matter(content);
    // Normalize common frontmatter quirks (e.g., Date objects)
    if (data && typeof data === "object" && (data as any).date instanceof Date) {
      (data as any).date = ((data as any).date as Date).toISOString().slice(0, 10);
    }
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(
        `Frontmatter validation failed for ${filePath}: ${result.error.message}`,
      );
    }
    const bodyHtml = body ? md.render(body) : undefined;
    return { frontmatter: result.data as z.infer<T>, bodyRaw: body, bodyHtml };
  }
  if (filePath.endsWith(".yml") || filePath.endsWith(".yaml")) {
    const data = yaml.parse(content);
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(
        `Frontmatter validation failed for ${filePath}: ${result.error.message}`,
      );
    }
    return { frontmatter: result.data as z.infer<T>, bodyRaw: undefined, bodyHtml: undefined };
  }
  throw new Error(`Unsupported content extension for ${filePath}`);
}

function parseData<T extends z.ZodTypeAny>(schema: T, filePath: string, content: string) {
  let data: unknown;
  if (filePath.endsWith(".yml") || filePath.endsWith(".yaml")) {
    data = yaml.parse(content);
  } else if (filePath.endsWith(".json")) {
    data = JSON.parse(content);
  } else {
    throw new Error(`Unsupported data extension for ${filePath}`);
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Data validation failed for ${filePath}: ${result.error.message}`);
  }
  return result.data as z.infer<T>;
}

function shouldExcludeDraft(frontmatter: Record<string, unknown>, behavior: ContentConfig<z.ZodTypeAny>["draftBehavior"]) {
  const isDraft = Boolean((frontmatter as any).draft);
  if (behavior === "alwaysInclude") return false;
  const isProd = process.env.NODE_ENV === "production";
  return isProd && isDraft;
}

export async function getCollection<TSchema extends z.ZodTypeAny>(
  name: keyof typeof registry,
  opts?: { filterDrafts?: boolean },
): Promise<ContentEntry<z.infer<TSchema>>[]> {
  const cfg = registry[name] as AnyConfig<TSchema>;
  if (!cfg || cfg.type !== "content") throw new Error(`Unknown content collection: ${String(name)}`);
  const abs = absoluteDir(cfg.dir);
  const files = await listFiles(abs);

  const allowed = [".md", ".markdown", ".mdx", ".yml", ".yaml"];
  const entries: ContentEntry<z.infer<TSchema>>[] = [];
  const seenSlugs = new Set<string>();

  for (const f of files) {
    if (!allowed.some((ext) => f.endsWith(ext))) continue;
    const raw = await readText(f);
    const parsed = parseContentFrontmatter(cfg.schema, f, raw);

    const slugFromFrontmatter = (parsed.frontmatter as any).slug as string | undefined;
    const slug = cfg.slugFrom === "frontmatter" && slugFromFrontmatter
      ? slugFromFrontmatter
      : baseId(f);

    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate slug "${slug}" in ${cfg.name}`);
    }
    seenSlugs.add(slug);

    const excludeDraft = opts?.filterDrafts ?? cfg.draftBehavior === "hideInProd";
    if (excludeDraft && shouldExcludeDraft(parsed.frontmatter as any, cfg.draftBehavior)) {
      continue;
    }

    entries.push({
      slug,
      frontmatter: parsed.frontmatter as any,
      bodyHtml: parsed.bodyHtml,
      bodyRaw: parsed.bodyRaw,
      file: f,
    });
  }

  return entries.sort((a, b) => {
    // Default sort: date desc if present
    const ad = (a.frontmatter as any).date;
    const bd = (b.frontmatter as any).date;
    if (ad && bd) return String(bd).localeCompare(String(ad));
    return a.slug.localeCompare(b.slug);
  });
}

export async function getEntry<TSchema extends z.ZodTypeAny>(
  name: keyof typeof registry,
  slug: string,
): Promise<ContentEntry<z.infer<TSchema>> | null> {
  const entries = await getCollection<TSchema>(name);
  return entries.find((e) => e.slug === slug) ?? null;
}

export async function getDataset<TSchema extends z.ZodTypeAny>(
  name: keyof typeof registry,
): Promise<DataItem<z.infer<TSchema>>[]> {
  const cfg = registry[name] as AnyConfig<TSchema>;
  if (!cfg || cfg.type !== "data") throw new Error(`Unknown dataset: ${String(name)}`);
  const abs = absoluteDir(cfg.dir);
  const files = await listFiles(abs);
  const allowed = [".yml", ".yaml", ".json"];
  const items: DataItem<z.infer<TSchema>>[] = [];
  const seen = new Set<string>();

  for (const f of files) {
    if (!allowed.some((ext) => f.endsWith(ext))) continue;
    const raw = await readText(f);
    const id = baseId(f);
    if (seen.has(id)) throw new Error(`Duplicate id "${id}" in ${cfg.name}`);
    seen.add(id);
    const data = parseData(cfg.schema, f, raw);
    items.push({ id, data: data as any, file: f });
  }

  return items.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getDatasetItem<TSchema extends z.ZodTypeAny>(
  name: keyof typeof registry,
  id: string,
): Promise<DataItem<z.infer<TSchema>> | null> {
  const items = await getDataset<TSchema>(name);
  return items.find((e) => e.id === id) ?? null;
}
