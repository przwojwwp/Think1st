import { useMemo, useState } from "react";
import { useHolidays } from "@/hooks/useHolidays";
import { ymd } from "@/utlis/date";

export type CalendarCell = { date: Date | null; blocked?: boolean };

export function useCalendar(country = "PL") {
  const { data: holidaysByDate, loading, error } = useHolidays(country);

  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selected, setSelected] = useState<Date | null>(null);

  const startOfToday = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const { cells, monthLabel } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;

    const items: CalendarCell[] = [];
    for (let i = 0; i < offset; i++) items.push({ date: null });

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = ymd(date);

      const isSunday = date.getDay() === 0;
      const isNat = !!holidaysByDate?.[key]?.isNationalHoliday;
      const isPast = date < startOfToday;

      items.push({ date, blocked: isSunday || isNat || isPast });
    }

    const label = cursor.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    return { cells: items, monthLabel: label };
  }, [cursor, holidaysByDate, startOfToday]);

  const selectedKey = selected ? ymd(selected) : null;
  const observances =
    selectedKey && holidaysByDate?.[selectedKey]?.observanceNames
      ? holidaysByDate[selectedKey]!.observanceNames
      : [];

  return {
    cursor,
    setCursor,
    selected,
    setSelected,
    holidaysByDate,
    loading,
    error,
    cells,
    monthLabel,
    observances,
    startOfToday,
  };
}
