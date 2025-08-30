import { useEffect, useRef } from "react";

type HolidayApiEntry = { name: string; date: string; type: string };

type DayHolidayInfo = {
  isNationalHoliday: boolean;
  observanceNames: string[];
};

type HolidaysByDate = Record<string, DayHolidayInfo>;

const API_KEY = import.meta.env.VITE_API_NINJAS_KEY!;
const COUNTRY = "PL";

export const DatePicker = () => {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      try {
        const res = await fetch(
          `https://api.api-ninjas.com/v1/holidays?country=${COUNTRY}`,
          { headers: { "X-Api-Key": API_KEY } }
        );
        const text = await res.text();
        if (!res.ok) {
          console.error("[Holidays ERROR]", res.status, text);
          return;
        }

        const apiData = JSON.parse(text) as HolidayApiEntry[];

        const holidaysByDate: HolidaysByDate = apiData.reduce((acc, h) => {
          const key = h.date;
          const typeUpper = h.type.toUpperCase();
          const isNat = typeUpper === "NATIONAL_HOLIDAY";
          const isObs = typeUpper.includes("OBSERVANCE");
          if (!isNat && !isObs) return acc;

          const entry =
            acc[key] ??
            (acc[key] = { isNationalHoliday: false, observanceNames: [] });

          if (isNat) entry.isNationalHoliday = true;
          if (isObs) entry.observanceNames.push(h.name);

          return acc;
        }, {} as HolidaysByDate);

        console.log("[Holidays PL → by date]", holidaysByDate);
      } catch (e) {
        console.error("[Holidays fetch failed]", e);
      }
    })();
  }, []);

  return <div>DatePicker</div>;
};
