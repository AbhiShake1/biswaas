import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const CACHE_ROOT = "data/scraped/.cache";

function ensureCacheDir(): void {
	if (!existsSync(CACHE_ROOT)) {
		mkdirSync(CACHE_ROOT, { recursive: true });
	}
}

function cachePath(url: string): string {
	const hash = createHash("sha1").update(url).digest("hex");
	return join(CACHE_ROOT, `${hash}.html`);
}

export function get(url: string): string | null {
	ensureCacheDir();
	const p = cachePath(url);
	if (!existsSync(p)) return null;
	try {
		return readFileSync(p, "utf8");
	} catch {
		return null;
	}
}

export function set(url: string, body: string): void {
	ensureCacheDir();
	writeFileSync(cachePath(url), body, "utf8");
}

export const cache = { get, set };
