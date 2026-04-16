import { fetch as undiciFetch } from "undici";
import robotsParser from "robots-parser";

const DEFAULT_UA = "BiswaasBot/0.1 (+https://github.com/AbhiShake1/biswaas)";

type RobotsLike = {
	isAllowed: (url: string, ua?: string) => boolean | undefined;
};

const cache = new Map<string, RobotsLike | null>();

async function loadRobots(host: string): Promise<RobotsLike | null> {
	if (cache.has(host)) return cache.get(host) ?? null;

	const robotsUrl = `https://${host}/robots.txt`;
	try {
		const res = await undiciFetch(robotsUrl, {
			method: "GET",
			headers: { "user-agent": DEFAULT_UA },
			redirect: "follow",
		});
		if (!res.ok) {
			console.error(
				`[robots] failed to fetch ${robotsUrl}: HTTP ${res.status}`,
			);
			cache.set(host, null);
			return null;
		}
		const body = await res.text();
		const parser = robotsParser(robotsUrl, body) as RobotsLike;
		cache.set(host, parser);
		return parser;
	} catch (err) {
		console.error(`[robots] error fetching ${robotsUrl}:`, err);
		cache.set(host, null);
		return null;
	}
}

export async function isAllowed(
	url: string,
	ua: string = DEFAULT_UA,
): Promise<boolean> {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch (err) {
		console.error(`[robots] invalid URL ${url}:`, err);
		return false;
	}

	const robots = await loadRobots(parsed.host);
	if (robots == null) {
		// Fail-closed: error already logged.
		return false;
	}
	const allowed = robots.isAllowed(url, ua);
	// robots-parser returns undefined for unknown — treat undefined as allowed
	// because the site's default `Allow: /` applies, but only when robots loaded ok.
	return allowed !== false;
}

export const robots = { isAllowed };
