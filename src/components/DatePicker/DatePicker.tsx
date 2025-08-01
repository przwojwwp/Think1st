import { useEffect, useRef, useState } from "react";
import { DayCell } from "./components/DayCell";
import { WEEKDAYS, ymd } from "@/utlis/date";
import { useCalendar } from "./hooks/useCalendar";
import PolygonButton from "@/assets/icon/polygon.svg?react";
import InformationIcon from "@/assets/icon/information-icon.svg?react";
import { TimeSlots } from "./components/TimeSlots";
import ExclamationMarkIcon from "@assets/icon/exclamation-mark-icon.svg?react";

type DatePickerProps = {
  required?: boolean;
  onDateChange?: (isoYmd: string) => void;
  onTimeChange?: (hhmm: string) => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  required = false,
  onDateChange,
  onTimeChange,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onSubmit = () => setShowErrors(true);
    form.addEventListener("submit", onSubmit, true);
    return () => form.removeEventListener("submit", onSubmit, true);
  }, []);

  const {
    cursor,
    setCursor,
    selected,
    setSelected,
    cells,
    monthLabel,
    observances,
    nationalHoliday,
    loading,
    error,
    startOfToday,
  } = useCalendar("PL");

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const prevMonth = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
  const disablePrev =
    prevMonth <
    new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
  const isSelectedSunday = Boolean(selected && selected.getDay() === 0);

  const canPickTime = !!selected && !nationalHoliday && !isSelectedSunday;

  const needDay = required && showErrors && !selected;
  const needTime = required && showErrors && canPickTime && !selectedTime;
  const needsAttention = needDay || needTime;

  return (
    <div id="date-section" ref={rootRef} className="relative w-form">
      <label className="mb-2 block">Date</label>

      <div
        className={[
          "flex flex-col w-calendar min-h-calendar rounded-lg border border-border-default bg-bg-light box-content p-6",
          needsAttention ? "ring-2 ring-red-500" : "",
        ].join(" ")}
      >
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
            <PolygonButton className="w-4 h-4 text-border-default group-hover:stroke-border-focus group-hover:text-border-focus rotate-180" />
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
                onSelect={(d) => {
                  setSelected(d);
                  setSelectedTime(null);
                  onDateChange?.(ymd(d));
                  onTimeChange?.("");
                }}
              />
            );
          })}
        </div>

        {canPickTime && (
          <TimeSlots
            selectedDate={selected}
            value={selectedTime}
            onChange={(t) => {
              setSelectedTime(t);
              onTimeChange?.(t || "");
            }}
          />
        )}

        <input
          type="text"
          name="date"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          value={selected ? ymd(selected) : ""}
          onChange={() => {}}
          required={required}
        />
        <input
          type="text"
          name="time"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          value={selectedTime ?? ""}
          onChange={() => {}}
          required={required}
        />
      </div>

      {required && showErrors && !selected && (
        <div className="h-7 mt-2 text-sm">
          <div className="flex items-start h-7 gap-2">
            <span aria-hidden>
              <ExclamationMarkIcon />
            </span>
            <div className="whitespace-pre-line h-6.75 leading-3.25">
              Please select a day.
            </div>
          </div>
        </div>
      )}

      {required &&
        showErrors &&
        selected &&
        !isSelectedSunday &&
        !nationalHoliday &&
        !selectedTime && (
          <div className="h-7 mt-2 text-sm">
            <div className="flex items-start h-7 gap-2">
              <span aria-hidden>
                <ExclamationMarkIcon />
              </span>
              <div className="whitespace-pre-line h-6.75 leading-3.25">
                Please select a time.
              </div>
            </div>
          </div>
        )}

      {isSelectedSunday && (
        <p className="flex h-4.5 mt-2 text-sm">
          <InformationIcon className="ml-0.5 mr-2" /> We are closed. It is
          Sunday.
        </p>
      )}

      {observances.length > 0 && (
        <div className="flex h-4.5 mt-2 text-sm" role="status">
          <InformationIcon className="ml-0.5 mr-2" />
          {observances.join(" • ")}
        </div>
      )}

      {loading && (
        <p className="mt-2 text-sm text-gray-500">Loading schedule</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">Failed to load holidays.</p>
      )}
    </div>
  );
};
