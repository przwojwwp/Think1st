import React from "react";
import { ymd } from "@/utlis/date";

type Props = {
  date: Date;
  blocked: boolean;
  selected: boolean;
  onSelect: (d: Date) => void;
};

export const DayCell = React.memo(
  function DayCell({ date, blocked, selected, onSelect }: Props) {
    const key = ymd(date);

    const base =
      "mx-auto flex h-8 w-8 items-center justify-center rounded-full";
    const state = blocked
      ? "text-gray-400 opacity-50 cursor-not-allowed"
      : "text-text hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300";
    const selectedCls = selected ? "bg-purple-600 text-white" : "";

    return (
      <button
        key={key}
        type="button"
        disabled={blocked}
        onClick={() => {
          onSelect(date);
        }}
        className={[base, state, selectedCls].join(" ")}
        aria-disabled={blocked}
        aria-pressed={selected}
        aria-label={date.toDateString()}
      >
        {date.getDate()}
      </button>
    );
  },
  (prev, next) =>
    prev.blocked === next.blocked &&
    prev.selected === next.selected &&
    prev.date.getTime() === next.date.getTime()
);
