import { memo, useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import type { Task } from "../types";

import "react-big-calendar/lib/css/react-big-calendar.css";

// ── Localizer (module-level singleton — created once) ─────────────────
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

interface Props {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

const eventStyleGetter = (event: CalendarEvent) => {
  const color = event.resource.tag?.color || "#6366f1";
  const isPast = new Date(event.resource.dueDate) < new Date();
  return {
    style: {
      backgroundColor: isPast ? "#fecaca" : color + "30",
      borderLeft: `3px solid ${isPast ? "#ef4444" : color}`,
      color: "#1f2937",
      borderRadius: "4px",
      padding: "2px 6px",
      fontSize: "12px",
    },
  };
};

function CalendarWidget({ events, onSelectEvent }: Props) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const handleView = useCallback((v: View) => setView(v), []);
  const handleNavigate = useCallback((d: Date) => setDate(d), []);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-4 calendar-light">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          view={view}
          onView={handleView}
          date={date}
          onNavigate={handleNavigate}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={onSelectEvent}
          views={["month", "week", "day", "agenda"]}
        />
      </div>

      {/* Calendar light theme override styles */}
      <style>{`
        .calendar-light .rbc-toolbar {
          margin-bottom: 16px;
        }
        .calendar-light .rbc-toolbar button {
          color: #6b7280;
          border-color: #e5e7eb;
          background: transparent;
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 6px;
        }
        .calendar-light .rbc-toolbar button:hover {
          background: #f9fafb;
          color: #111827;
        }
        .calendar-light .rbc-toolbar button.rbc-active {
          background: #f59e0b;
          color: black;
          border-color: #f59e0b;
        }
        .calendar-light .rbc-header {
          color: #6b7280;
          border-color: #e5e7eb;
          padding: 8px 4px;
          font-size: 13px;
          font-weight: 500;
        }
        .calendar-light .rbc-month-view,
        .calendar-light .rbc-time-view {
          border-color: #e5e7eb;
        }
        .calendar-light .rbc-day-bg {
          border-color: #e5e7eb;
        }
        .calendar-light .rbc-off-range-bg {
          background: #f9fafb;
        }
        .calendar-light .rbc-today {
          background: #fffbeb;
        }
        .calendar-light .rbc-month-row {
          border-color: #e5e7eb;
        }
        .calendar-light .rbc-date-cell {
          color: #374151;
          padding: 4px 8px;
          font-size: 13px;
        }
        .calendar-light .rbc-date-cell.rbc-now {
          color: #d97706;
          font-weight: 600;
        }
        .calendar-light .rbc-show-more {
          color: #d97706;
          font-size: 12px;
        }
        .calendar-light .rbc-event {
          border: none !important;
        }
        .calendar-light .rbc-event:focus {
          outline: 2px solid #f59e0b;
          outline-offset: 1px;
        }
        .calendar-light .rbc-time-header-content,
        .calendar-light .rbc-time-content {
          border-color: #e5e7eb;
        }
        .calendar-light .rbc-timeslot-group {
          border-color: #e5e7eb;
        }
        .calendar-light .rbc-time-slot .rbc-label {
          color: #9ca3af;
          font-size: 12px;
        }
        .calendar-light .rbc-agenda-view table {
          border-color: #e5e7eb;
          color: #374151;
        }
        .calendar-light .rbc-agenda-view table thead > tr > th {
          border-color: #e5e7eb;
          color: #6b7280;
        }
        .calendar-light .rbc-agenda-view table tbody > tr > td {
          border-color: #e5e7eb;
        }
        .calendar-light .rbc-agenda-view table tbody > tr + tr {
          border-color: #e5e7eb;
        }
      `}</style>
    </>
  );
}

export default memo(CalendarWidget);
