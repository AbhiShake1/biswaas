import { fetch as undiciFetch } from "undici";
import PQueue from "p-queue";
import { cache } from "./cache.ts";
import { isAllowed } from "./robots.ts";

const DEFAULT_UA = "BiswaasBot/0.1 (+https://github.com/AbhiShake1/biswaas)";
const DEFAULT_DELAY_MS = 2000; // 0.5 req/s
const DEFAULT_MAX_RETRIES = 3;

export class FetcherDisallowedError extends Error {
	constructor(url: string) {
		super(`Fetch disallowed by robots.txt: ${url}`);
		this.name = "FetcherDisallowedError";
	}
}

export class FetcherHttpError extends Error {
	public readonly status: number;
	public readonly url: string;
	constructor(url: string, status: number) {
		super(`HTTP ${status} for ${url}`);
		this.name = "FetcherHttpError";
		this.url = url;
		this.status = status;
	}
}

export type FetcherOptions = {
	userAgent?: string;
	delayMs?: number;
	concurrency?: number;
	maxRetries?: number;
	respectRobots?: boolean;
	useCache?: boolean;
};

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfter(header: string | undefined): number | null {
	if (header == null) return null;
	const value = header;
	if (!value) return null;
	const secs = Number(value);
	if (Number.isFinite(secs)) return Math.max(0, secs * 1000);
	const dateMs = Date.parse(value);
	if (Number.isFinite(dateMs)) {
		const diff = dateMs - Date.now();
		return diff > 0 ? diff : 0;
	}
	return null;
}

export type Fetcher = {
	fetchHtml: (url: string) => Promise<string>;
};

export function createFetcher(opts: FetcherOptions = {}): Fetcher {
	const userAgent = opts.userAgent ?? DEFAULT_UA;
	const delayMs = opts.delayMs ?? DEFAULT_DELAY_MS;
	const concurrency = opts.concurrency ?? 1;
	const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES;
	const respectRobots = opts.respectRobots ?? true;
	const useCache = opts.useCache ?? true;

	const queue = new PQueue({ concurrency });
	let lastRequestAt = 0;

	async function rateLimit(): Promise<void> {
		const now = Date.now();
		const wait = lastRequestAt + delayMs - now;
		if (wait > 0) await sleep(wait);
		lastRequestAt = Date.now();
	}

	async function doOnce(url: string): Promise<string> {
		await rateLimit();
		const res = await undiciFetch(url, {
			method: "GET",
			headers: {
				"user-agent": userAgent,
				accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
			},
			redirect: "follow",
		});

		const status = res.status;

		if (status === 429) {
			const retryAfter = parseRetryAfter(
				res.headers.get("retry-after") ?? undefined,
			);
			// Drain body to free the socket before sleeping.
			await res.text();
			if (retryAfter != null) await sleep(retryAfter);
			throw new FetcherHttpError(url, status);
		}

		if (status >= 500 && status < 600) {
			await res.text();
			throw new FetcherHttpError(url, status);
		}

		if (!res.ok) {
			await res.text();
			throw new FetcherHttpError(url, status);
		}

		const body = await res.text();
		if (useCache) cache.set(url, body);
		return body;
	}

	async function fetchWithRetry(url: string): Promise<string> {
		let lastErr: unknown;
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				return await doOnce(url);
			} catch (err) {
				lastErr = err;
				if (err instanceof FetcherHttpError) {
					const retriable =
						err.status === 429 ||
						(err.status >= 500 && err.status < 600);
					if (!retriable || attempt === maxRetries) throw err;
					// 1s, 2s, 4s exponential backoff
					const backoff = 1000 * Math.pow(2, attempt);
					await sleep(backoff);
					continue;
				}
				if (attempt === maxRetries) throw err;
				const backoff = 1000 * Math.pow(2, attempt);
				await sleep(backoff);
			}
		}
		throw lastErr instanceof Error
			? lastErr
			: new Error(`Fetch failed: ${url}`);
	}

	async function fetchHtml(url: string): Promise<string> {
		if (useCache) {
			const cached = cache.get(url);
			if (cached != null) return cached;
		}

		if (respectRobots) {
			const ok = await isAllowed(url, userAgent);
			if (!ok) throw new FetcherDisallowedError(url);
		}

		const body = await queue.add(() => fetchWithRetry(url), { throwOnTimeout: true });
		if (body == null) throw new Error(`Empty body for ${url}`);
		return body;
	}

	return { fetchHtml };
}

// Default shared instance for simple call sites.
const defaultFetcher = createFetcher();

export function fetchHtml(url: string): Promise<string> {
	return defaultFetcher.fetchHtml(url);
}
