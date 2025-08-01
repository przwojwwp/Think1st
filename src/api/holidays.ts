import type { HolidayApiEntry, HolidaysByDate } from "@/types/holidays";

const API_URL = "https://api.api-ninjas.com/v1/holidays";
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY!;

export async function fetchHolidays(
  country = "PL",
  year?: number,
  signal?: AbortSignal
): Promise<HolidayApiEntry[]> {
  const params = new URLSearchParams({ country });
  if (year) params.set("year", String(year));

  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: { "X-Api-Key": API_KEY },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Holidays HTTP ${res.status} ${text}`);
  }

  return res.json();
}

export function toHolidaysByDate(entries: HolidayApiEntry[]): HolidaysByDate {
  const out: HolidaysByDate = {};
  for (const h of entries) {
    const t = h.type.toUpperCase();
    const isNat = t === "NATIONAL_HOLIDAY";
    const isObs = t.includes("OBSERVANCE");
    if (!isNat && !isObs) continue;

    const slot =
      out[h.date] ??
      (out[h.date] = { isNationalHoliday: false, observanceNames: [] });

    if (isNat) slot.isNationalHoliday = true;
    if (isNat) slot.observanceNames.push(h.name)
    if (isObs) slot.observanceNames.push(h.name);
  }
  return out;
}
