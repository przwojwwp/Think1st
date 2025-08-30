import { useMemo, useState } from "react";
import { useHolidays } from "@/hooks/useHolidays";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const DatePicker = () => {
  const { data: holidaysByDate, loading, error } = useHolidays("PL");

  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  const [selected, setSelected] = useState<Date | null>(null);

  const { cells, monthLabel } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const items: { date: Date | null; blocked?: boolean }[] = [];

    for (let i = 0; i < offset; i++) items.push({ date: null });

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = ymd(date);
      const isSunday = date.getDay() === 0;
      const isNat = !!holidaysByDate?.[key]?.isNationalHoliday;
      items.push({ date, blocked: isSunday || isNat });
    }

    const label = cursor.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    return { cells: items, monthLabel: label };
  }, [cursor, holidaysByDate]);

  const selectedKey = selected ? ymd(selected) : null;
  const observances = selectedKey
    ? holidaysByDate?.[selectedKey]?.observanceNames ?? []
    : [];

  return (
    <div className="w-form">
      <label className="mb-2 block">Date</label>

      <div className="rounded-lg border border-border-default bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            className="h-7 w-7 rounded-md text-purple-500 hover:bg-purple-50"
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
            }
          >
            ◄
          </button>

          <div className="text-center font-medium">{monthLabel}</div>

          <button
            type="button"
            aria-label="Next month"
            className="h-7 w-7 rounded-md text-purple-500 hover:bg-purple-50"
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
            }
          >
            ►
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 text-center text-sm text-text">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={i === 6 ? "text-gray-400" : undefined}>
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, idx) => {
            if (!cell.date) return <div key={`e-${idx}`} />;
            const key = ymd(cell.date);
            const isBlocked = !!cell.blocked;
            const isSelected = Boolean(selected && ymd(selected) === key);

            return (
              <button
                key={key}
                type="button"
                disabled={isBlocked}
                onClick={() => {
                  setSelected(cell.date!);
                }}
                className={[
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                  isBlocked
                    ? "text-gray-400 opacity-50 cursor-not-allowed"
                    : "text-text hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300",
                  isSelected ? "bg-purple-600 text-white" : "",
                ].join(" ")}
                aria-disabled={isBlocked}
                aria-pressed={isSelected}
                aria-label={cell.date.toDateString()}
              >
                {cell.date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {observances.length > 0 && (
        <div
          className="mt-3 rounded-md border border-border-default bg-white px-3 py-2 text-sm"
          role="status"
        >
          <span className="font-medium">Observance:</span>{" "}
          {observances.join(" • ")}
        </div>
      )}

      {loading && (
        <p className="mt-2 text-sm text-gray-500">Loading calendar…</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">Failed to load holidays.</p>
      )}
    </div>
  );
};
