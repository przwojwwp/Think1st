import { DayCell } from "./DayCell";
import { WEEKDAYS, ymd } from "@/utlis/date";
import { useCalendar } from "../../hooks/useCalendar";
import PolygonButton from "@/assets/icon/polygon.svg?react";
import { TimeSlots } from "./TimeSlots";
import { useState } from "react";

export const DatePicker = () => {
  const {
    cursor,
    setCursor,
    selected,
    setSelected,
    cells,
    monthLabel,
    observances,
    loading,
    error,
    startOfToday,
  } = useCalendar("PL");

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const prevMonth = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
  const disablePrev =
    prevMonth <
    new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  return (
    <div className="relative w-form">
      <label className="mb-2 block">Date</label>

      <div className="flex flex-col w-calendar h-calendar rounded-lg border border-border-default bg-bg-light box-content p-6">
        <div className="mb-3 h-6 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            disabled={disablePrev}
            className={`flex items-center justify-center h-7 w-7 rounded-md group ${
              disablePrev ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
            }
          >
            <PolygonButton
              className={`w-4 h-4 text-border-default ${
                disablePrev
                  ? ""
                  : "group-hover:stroke-border-focus group-hover:text-border-focus"
              }`}
            />
          </button>

          <div className="text-center font-medium leading-3">{monthLabel}</div>

          <button
            type="button"
            aria-label="Next month"
            className="group flex items-center justify-center h-7 w-7 rounded-md cursor-pointer"
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
            }
          >
            <PolygonButton
              className="w-4 h-4 text-border-default group-hover:stroke-border-focus group-hover:text-border-focus
            rotate-180"
            />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 text-center text-sm text-text">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={i === 6 ? "text-gray" : undefined}>
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
              <DayCell
                key={key}
                date={cell.date}
                blocked={isBlocked}
                selected={isSelected}
                onSelect={setSelected}
              />
            );
          })}
        </div>
        {selected && (
          <TimeSlots
            selectedDate={selected}
            value={selectedTime}
            onChange={setSelectedTime}
            slots={["12:00", "14:00", "16:30", "18:30", "20:00"]}
          />
        )}
      </div>

      {observances.length > 0 && (
        <div
          className="mt-3 rounded-md border border-border-default bg-bg-light px-3 py-2 text-sm"
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
