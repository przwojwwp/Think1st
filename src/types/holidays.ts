export type HolidayApiEntry = { name: string; date: string; type: string };

export type DayHolidayInfo = {
  isNationalHoliday: boolean;
  observanceNames: string[];
};

export type HolidaysByDate = Record<string, DayHolidayInfo>;
