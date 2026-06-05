"use client";

import React, { useState, useEffect, Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { cn } from "@/lib/utils";
import {
  parseDateInput,
  parseIsoDateLocal,
  formatIsoDisplay,
  formatIsoToInput,
} from "@/lib/utils/date";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CALENDAR_ROWS = 6;
const CELL_SIZE = "h-9 w-9";

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select a date",
  hasError,
  disabled,
  className,
  minDate,
  maxDate,
}) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    const parsed = value ? parseIsoDateLocal(value) : null;
    return parsed ?? today;
  });
  const [inputText, setInputText] = useState(() =>
    value ? formatIsoToInput(value) : "",
  );

  useEffect(() => {
    if (value) {
      const parsed = parseIsoDateLocal(value);
      if (parsed) {
        setViewDate(parsed);
        setInputText(formatIsoToInput(value));
      }
    } else {
      setInputText("");
    }
  }, [value]);

  const selectedDate = value ? parseIsoDateLocal(value) : null;

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isToday = (year: number, month: number, day: number): boolean => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isSelected = (year: number, month: number, day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const commitInput = (raw: string) => {
    const iso = parseDateInput(raw);
    if (iso) {
      onChange(iso);
      setInputText(formatIsoToInput(iso));
      const parsed = parseIsoDateLocal(iso);
      if (parsed) setViewDate(parsed);
      return true;
    }
    if (!raw.trim()) {
      onChange("");
      setInputText("");
      return true;
    }
    if (value) {
      setInputText(formatIsoToInput(value));
    } else {
      setInputText("");
    }
    return false;
  };

  const handleDateClick = (day: number, close: () => void) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (!isDateDisabled(date)) {
      const iso = formatDate(date);
      onChange(iso);
      setInputText(formatIsoToInput(iso));
      close();
    }
  };

  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const goToPrevYear = () => {
    setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
  };

  const goToNextYear = () => {
    setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
  };

  const goToToday = (close: () => void) => {
    const todayDate = new Date();
    setViewDate(todayDate);
    const iso = formatDate(todayDate);
    onChange(iso);
    setInputText(formatIsoToInput(iso));
    close();
  };

  const renderCalendar = (close: () => void) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={cn(CELL_SIZE, "shrink-0")} />,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayDisabled = isDateDisabled(date);
      const selected = isSelected(year, month, day);
      const todayDate = isToday(year, month, day);

      days.push(
        <button
          key={day}
          type="button"
          disabled={dayDisabled}
          onClick={() => handleDateClick(day, close)}
          className={cn(
            CELL_SIZE,
            "shrink-0 rounded-lg text-sm font-medium",
            "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            dayDisabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
            selected &&
              "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
            !selected && todayDate && "border-2 border-blue-500 text-blue-600",
            !selected && !todayDate && "text-gray-700",
          )}
        >
          {day}
        </button>,
      );
    }

    const totalCells = firstDay + daysInMonth;
    const trailing = CALENDAR_ROWS * 7 - totalCells;
    for (let i = 0; i < trailing; i++) {
      days.push(
        <div key={`trail-${i}`} className={cn(CELL_SIZE, "shrink-0")} />,
      );
    }

    return days;
  };

  const displayLabel = value ? formatIsoDisplay(value) : "";

  return (
    <Popover className={cn("relative w-full", className)}>
      {({ close }) => (
        <>
          <div
            className={cn(
              "flex h-12 w-full items-stretch overflow-hidden rounded-xl border bg-white shadow-sm",
              hasError ? "border-red-300" : "border-gray-200",
              disabled && "bg-gray-50",
            )}
          >
            <input
              type="text"
              disabled={disabled}
              value={inputText}
              placeholder={placeholder}
              onChange={(e) => {
                const next = e.target.value;
                setInputText(next);
                const iso = parseDateInput(next);
                if (iso) {
                  onChange(iso);
                  const parsed = parseIsoDateLocal(iso);
                  if (parsed) setViewDate(parsed);
                }
              }}
              onBlur={(e) => commitInput(e.target.value)}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                e.preventDefault();
                setInputText(pasted);
                commitInput(pasted);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitInput(inputText);
                }
              }}
              className={cn(
                "min-w-0 flex-1 border-0 bg-transparent py-0 pl-3 pr-2 text-sm text-gray-900 outline-none focus:ring-0",
                "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-500",
              )}
              aria-label={placeholder}
              title={displayLabel || undefined}
            />
            <PopoverButton
              type="button"
              disabled={disabled}
              className={cn(
                "flex w-11 shrink-0 items-center justify-center border-l text-gray-400",
                "hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20",
                hasError ? "border-red-200" : "border-gray-200",
                disabled && "cursor-not-allowed opacity-50",
              )}
              aria-label="Open calendar"
            >
              <Calendar className="h-5 w-5" />
            </PopoverButton>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel
              anchor="bottom start"
              className="z-[100] mt-2 w-80 shrink-0 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 focus:outline-none"
            >
              <div className="mb-4 flex h-8 items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={goToPrevYear}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Previous Year"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToPrevMonth}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Previous Month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>

                <span className="min-w-[8.5rem] text-center text-sm font-semibold text-gray-900">
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Next Month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextYear}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Next Year"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className={cn(
                      CELL_SIZE,
                      "flex shrink-0 items-center justify-center text-xs font-medium text-gray-500",
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div
                className="grid grid-cols-7 gap-1"
                style={{ minHeight: `${CALENDAR_ROWS * 36 + (CALENDAR_ROWS - 1) * 4}px` }}
              >
                {renderCalendar(close)}
              </div>

              <div className="mt-4 flex h-9 items-center justify-between border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => goToToday(close)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Today
                </button>
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setInputText("");
                      close();
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
                  >
                    Clear
                  </button>
                )}
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

DatePicker.displayName = "DatePicker";
