/**
 * A6: Nepal admin-division lookup and address parser.
 *
 * Strategy: tokenise a comma-delimited address; match tokens against known
 * districts and municipalities (case-insensitive); derive province from the
 * matched district. What doesn't match gets concatenated back into `address`.
 *
 * MVP dataset is compact — the 7 provinces, their 77 districts, and major
 * municipalities we're likely to see in DoN listings. Not exhaustive.
 * `parseAddress` never throws: an unrecognised address returns
 * `{ address: <trimmed input> }`.
 */

type ProvinceName =
	| "Koshi"
	| "Madhesh"
	| "Bagmati"
	| "Gandaki"
	| "Lumbini"
	| "Karnali"
	| "Sudurpashchim";

/**
 * Canonical district → province mapping. All 77 districts of Nepal.
 * Spellings match the most common English rendering used on the DoN site.
 */
const DISTRICT_TO_PROVINCE: Record<string, ProvinceName> = {
	// Koshi (formerly Province 1) — 14 districts
	Bhojpur: "Koshi",
	Dhankuta: "Koshi",
	Ilam: "Koshi",
	Jhapa: "Koshi",
	Khotang: "Koshi",
	Morang: "Koshi",
	Okhaldhunga: "Koshi",
	Panchthar: "Koshi",
	Sankhuwasabha: "Koshi",
	Solukhumbu: "Koshi",
	Sunsari: "Koshi",
	Taplejung: "Koshi",
	Terhathum: "Koshi",
	Udayapur: "Koshi",

	// Madhesh — 8 districts
	Bara: "Madhesh",
	Dhanusha: "Madhesh",
	Mahottari: "Madhesh",
	Parsa: "Madhesh",
	Rautahat: "Madhesh",
	Saptari: "Madhesh",
	Sarlahi: "Madhesh",
	Siraha: "Madhesh",

	// Bagmati — 13 districts
	Bhaktapur: "Bagmati",
	Chitwan: "Bagmati",
	Dhading: "Bagmati",
	Dolakha: "Bagmati",
	Kathmandu: "Bagmati",
	Kavrepalanchok: "Bagmati",
	Lalitpur: "Bagmati",
	Makwanpur: "Bagmati",
	Nuwakot: "Bagmati",
	Ramechhap: "Bagmati",
	Rasuwa: "Bagmati",
	Sindhuli: "Bagmati",
	Sindhupalchok: "Bagmati",

	// Gandaki — 11 districts
	Baglung: "Gandaki",
	Gorkha: "Gandaki",
	Kaski: "Gandaki",
	Lamjung: "Gandaki",
	Manang: "Gandaki",
	Mustang: "Gandaki",
	Myagdi: "Gandaki",
	Nawalpur: "Gandaki",
	Parbat: "Gandaki",
	Syangja: "Gandaki",
	Tanahun: "Gandaki",

	// Lumbini — 12 districts
	Arghakhanchi: "Lumbini",
	Banke: "Lumbini",
	Bardiya: "Lumbini",
	Dang: "Lumbini",
	Eastern_Rukum: "Lumbini", // placeholder, replaced below
	Gulmi: "Lumbini",
	Kapilvastu: "Lumbini",
	Palpa: "Lumbini",
	Parasi: "Lumbini",
	Pyuthan: "Lumbini",
	Rolpa: "Lumbini",
	Rupandehi: "Lumbini",

	// Karnali — 10 districts
	Dailekh: "Karnali",
	Dolpa: "Karnali",
	Humla: "Karnali",
	Jajarkot: "Karnali",
	Jumla: "Karnali",
	Kalikot: "Karnali",
	Mugu: "Karnali",
	Salyan: "Karnali",
	Surkhet: "Karnali",
	"Western Rukum": "Karnali",

	// Sudurpashchim — 9 districts
	Achham: "Sudurpashchim",
	Baitadi: "Sudurpashchim",
	Bajhang: "Sudurpashchim",
	Bajura: "Sudurpashchim",
	Dadeldhura: "Sudurpashchim",
	Darchula: "Sudurpashchim",
	Doti: "Sudurpashchim",
	Kailali: "Sudurpashchim",
	Kanchanpur: "Sudurpashchim",
};

// Fix the placeholder from the Lumbini block (Eastern Rukum has a space).
delete (DISTRICT_TO_PROVINCE as Record<string, ProvinceName>).Eastern_Rukum;
(DISTRICT_TO_PROVINCE as Record<string, ProvinceName>)["Eastern Rukum"] = "Lumbini";

/**
 * Major municipalities we expect to appear in addresses. Maps municipality
 * display name → home district. Derived from Nepal's metropolitan,
 * sub-metropolitan and well-known municipal city lists.
 *
 * Keep this list practical, not exhaustive: the address parser falls back
 * to matching just districts when a municipality isn't here.
 */
const MUNICIPALITY_TO_DISTRICT: Record<string, string> = {
	// Metropolitan cities
	Kathmandu: "Kathmandu",
	Lalitpur: "Lalitpur",
	Pokhara: "Kaski",
	Bharatpur: "Chitwan",
	Biratnagar: "Morang",
	Birgunj: "Parsa",

	// Sub-metropolitan cities
	Butwal: "Rupandehi",
	Dharan: "Sunsari",
	Hetauda: "Makwanpur",
	Itahari: "Sunsari",
	Janakpur: "Dhanusha",
	Nepalgunj: "Banke",
	Dhangadhi: "Kailali",
	Ghorahi: "Dang",
	Tulsipur: "Dang",
	Jitpur_Simara: "Bara", // replaced below for the space variant

	// Common municipalities / cities in Kathmandu valley + tourist hubs
	Bhaktapur: "Bhaktapur",
	Madhyapur_Thimi: "Bhaktapur",
	Kirtipur: "Kathmandu",
	Budhanilkantha: "Kathmandu",
	Tokha: "Kathmandu",
	Gokarneshwar: "Kathmandu",
	Tarakeshwar: "Kathmandu",
	Chandragiri: "Kathmandu",
	Nagarjun: "Kathmandu",
	Kageshwari_Manohara: "Kathmandu",
	Godawari: "Lalitpur",
	Mahalaxmi: "Lalitpur",
	Banepa: "Kavrepalanchok",
	Dhulikhel: "Kavrepalanchok",
	Panauti: "Kavrepalanchok",
	Namobuddha: "Kavrepalanchok",
	Lekhnath: "Kaski",
	Ilam: "Ilam",
	Birtamod: "Jhapa",
	Mechinagar: "Jhapa",
	Damak: "Jhapa",
	Tikapur: "Kailali",
	Gaur: "Rautahat",
	Rajbiraj: "Saptari",
	Malangwa: "Sarlahi",
	Siraha: "Siraha",
	Jaleshwar: "Mahottari",
	Kalaiya: "Bara",
	Lumbini: "Rupandehi", // Lumbini Sanskritik / pilgrim city
	Siddharthanagar: "Rupandehi",
	Tansen: "Palpa",
	Gorkha: "Gorkha",
	Damauli: "Tanahun",
	Besisahar: "Lamjung",
	Baglung: "Baglung",
	Kushma: "Parbat",
	Syangja: "Syangja",
	Birendranagar: "Surkhet",
	Jumla: "Jumla",
	Dipayal_Silgadhi: "Doti",
	Amargadhi: "Dadeldhura",
};

// Replace the underscored placeholder keys with the real spaced names.
const UNDERSCORE_KEYS = [
	["Jitpur_Simara", "Jitpur Simara"],
	["Madhyapur_Thimi", "Madhyapur Thimi"],
	["Kageshwari_Manohara", "Kageshwari Manohara"],
	["Dipayal_Silgadhi", "Dipayal Silgadhi"],
] as const;
for (const [underscore, spaced] of UNDERSCORE_KEYS) {
	const v = (MUNICIPALITY_TO_DISTRICT as Record<string, string>)[underscore];
	if (v !== undefined) {
		delete (MUNICIPALITY_TO_DISTRICT as Record<string, string>)[underscore];
		(MUNICIPALITY_TO_DISTRICT as Record<string, string>)[spaced] = v;
	}
}

// Case-folded lookup tables built once.
const DISTRICT_LOOKUP = new Map<string, string>(
	Object.keys(DISTRICT_TO_PROVINCE).map((d) => [d.toLowerCase(), d]),
);
const MUNICIPALITY_LOOKUP = new Map<string, string>(
	Object.keys(MUNICIPALITY_TO_DISTRICT).map((m) => [m.toLowerCase(), m]),
);

export type ParsedAddress = {
	province?: string;
	district?: string;
	municipality?: string;
	address: string;
};

/**
 * Parse a comma-delimited Nepali address string into its administrative
 * components. Never throws. If nothing matches, returns the trimmed input
 * as `address`.
 */
export function parseAddress(raw: string): ParsedAddress {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) return { address: "" };

	// Tokenise by commas; also split obvious trailing ", Nepal" noise.
	const tokens = trimmed
		.split(",")
		.map((t) => t.trim())
		.filter((t) => t.length > 0 && t.toLowerCase() !== "nepal");

	let matchedDistrict: string | undefined;
	let matchedMunicipality: string | undefined;
	const leftover: string[] = [];

	for (const token of tokens) {
		const lc = token.toLowerCase();

		// Some tokens contain parenthetical alternates like "Thadodhunga (Dhobighat)" —
		// try the outer token first, then the inner one.
		const parenMatch = lc.match(/^([^(]+)\s*\(([^)]+)\)\s*$/);
		const candidates = parenMatch
			? [parenMatch[1]!.trim(), parenMatch[2]!.trim()]
			: [lc];

		let tokenMatched = false;
		for (const candidate of candidates) {
			if (!matchedMunicipality && MUNICIPALITY_LOOKUP.has(candidate)) {
				matchedMunicipality = MUNICIPALITY_LOOKUP.get(candidate)!;
				if (!matchedDistrict) {
					matchedDistrict = MUNICIPALITY_TO_DISTRICT[matchedMunicipality];
				}
				tokenMatched = true;
				break;
			}
			if (!matchedDistrict && DISTRICT_LOOKUP.has(candidate)) {
				matchedDistrict = DISTRICT_LOOKUP.get(candidate)!;
				tokenMatched = true;
				break;
			}
		}

		if (!tokenMatched) leftover.push(token);
	}

	const province = matchedDistrict
		? DISTRICT_TO_PROVINCE[matchedDistrict]
		: undefined;

	return {
		province,
		district: matchedDistrict,
		municipality: matchedMunicipality,
		address: leftover.join(", "),
	};
}

/** Exposed for tests / debugging. */
export function listKnownDistricts(): string[] {
	return Object.keys(DISTRICT_TO_PROVINCE).sort();
}

/** Exposed for tests / debugging. */
export function listKnownMunicipalities(): string[] {
	return Object.keys(MUNICIPALITY_TO_DISTRICT).sort();
}
