import { mkdirSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";

type Level = "info" | "warn" | "error";

export type Logger = {
	info: (msg: string, extra?: Record<string, unknown>) => void;
	warn: (msg: string, extra?: Record<string, unknown>) => void;
	error: (msg: string, extra?: Record<string, unknown>) => void;
};

function pretty(level: Level, msg: string, extra?: Record<string, unknown>): string {
	const tag =
		level === "error" ? "ERROR" : level === "warn" ? "WARN " : "INFO ";
	const extraStr =
		extra && Object.keys(extra).length > 0
			? " " + JSON.stringify(extra)
			: "";
	return `[${tag}] ${msg}${extraStr}`;
}

export function createLogger(runDir: string): Logger {
	if (!existsSync(runDir)) {
		mkdirSync(runDir, { recursive: true });
	}
	const logPath = join(runDir, "run.log");

	const write = (level: Level, msg: string, extra?: Record<string, unknown>) => {
		const ts = new Date().toISOString();
		const line = JSON.stringify({ ts, level, msg, ...(extra ?? {}) });
		try {
			appendFileSync(logPath, line + "\n", "utf8");
		} catch (err) {
			// Swallow file write errors — stdout is the fallback.
			console.error("[logger] failed to write to", logPath, err);
		}
		const pretty_line = pretty(level, msg, extra);
		if (level === "error") console.error(pretty_line);
		else if (level === "warn") console.warn(pretty_line);
		else console.log(pretty_line);
	};

	return {
		info: (msg, extra) => write("info", msg, extra),
		warn: (msg, extra) => write("warn", msg, extra),
		error: (msg, extra) => write("error", msg, extra),
	};
}
