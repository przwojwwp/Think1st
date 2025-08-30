import { useEffect, useState } from "react";
import { fetchHolidays, toHolidaysByDate } from "@/api/holidays";
import type { HolidaysByDate } from "@/types/holidays";

export function useHolidays(country = "PL", year?: number) {
  const [data, setData] = useState<HolidaysByDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const entries = await fetchHolidays(country, year, ac.signal);
        if (!ac.signal.aborted) {
          setData(toHolidaysByDate(entries));
        }
      } catch (e) {
        if (!ac.signal.aborted) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [country, year]);

  return { data, loading, error };
}
