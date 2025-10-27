import { promises as fs } from "fs";
import path from "path";

export type KiteSessionStore = {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  publicToken?: string;
  userId?: string;
  lastAuthenticatedAt?: string; // ISO string
};

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "kite-session.json");

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readStore(): Promise<KiteSessionStore> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    return JSON.parse(raw) as KiteSessionStore;
  } catch (err: any) {
    if (err && (err.code === "ENOENT" || err.code === "ENOFILE")) {
      return {};
    }
    throw err;
  }
}

export async function writeStore(update: KiteSessionStore): Promise<void> {
  await ensureDataDir();
  const body = JSON.stringify(update, null, 2);
  await fs.writeFile(storePath, body, "utf8");
}

export async function setCredentials(apiKey: string, apiSecret: string): Promise<KiteSessionStore> {
  const prev = await readStore();
  const next: KiteSessionStore = {
    ...prev,
    apiKey,
    apiSecret,
  };
  await writeStore(next);
  return next;
}

export async function setAccessTokens(params: { accessToken: string; publicToken?: string; userId?: string }): Promise<KiteSessionStore> {
  const prev = await readStore();
  const next: KiteSessionStore = {
    ...prev,
    accessToken: params.accessToken,
    publicToken: params.publicToken,
    userId: params.userId,
    lastAuthenticatedAt: new Date().toISOString(),
  };
  await writeStore(next);
  return next;
}

export async function clearTokens(): Promise<KiteSessionStore> {
  const prev = await readStore();
  const { accessToken: _a, publicToken: _p, lastAuthenticatedAt: _l, ...rest } = prev;
  const next: KiteSessionStore = { ...rest };
  await writeStore(next);
  return next;
}

export async function clearAll(): Promise<void> {
  await ensureDataDir();
  try {
    await fs.unlink(storePath);
  } catch (err: any) {
    if (!(err && err.code === "ENOENT")) throw err;
  }
}

export async function hasCredentials(): Promise<boolean> {
  const s = await readStore();
  return Boolean(s.apiKey && s.apiSecret);
}

export async function isAuthenticated(): Promise<boolean> {
  const s = await readStore();
  return Boolean(s.apiKey && s.accessToken);
}

export function getStorePath(): string {
  return storePath;
}
