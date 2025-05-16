import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Event = {
  id: number;
  title: string;
  startDate: string;
  type: "task" | "obligation" | "meeting";
};

type EventItemProps = {
  title: string;
  date: string;
  type: "task" | "obligation" | "meeting";
};

const EventItem = ({ title, date, type }: EventItemProps) => {
  const formattedTime = format(parseISO(date), "HH:mm", { locale: ptBR });
  
  const getEventTypeIcon = () => {
    switch (type) {
      case "task":
        return { icon: "assignment", bgColor: "bg-primary-100", textColor: "text-primary-700" };
      case "obligation":
        return { icon: "receipt_long", bgColor: "bg-amber-100", textColor: "text-amber-700" };
      case "meeting":
        return { icon: "groups", bgColor: "bg-green-100", textColor: "text-green-700" };
      default:
        return { icon: "event", bgColor: "bg-gray-100", textColor: "text-gray-700" };
    }
  };
  
  const { icon, bgColor, textColor } = getEventTypeIcon();
  
  return (
    <li className="flex items-start">
      <div className={`flex-shrink-0 h-10 w-10 rounded ${bgColor} flex items-center justify-center ${textColor}`}>
        <span className="material-icons">{icon}</span>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-neutral-800">{title}</p>
        <p className="text-xs text-neutral-500 mt-1">
          <span className="material-icons inline-block text-xs align-text-top">schedule</span>
          {" "}{formattedTime}
        </p>
      </div>
    </li>
  );
};

type CalendarProps = {
  events: Event[];
};

export default function Calendar({ events }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Generate header with day names
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  // Generate calendar dates
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days_array = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      // Check if day has events
      const dayEvents = events.filter(event => 
        isSameDay(parseISO(event.startDate), cloneDay)
      );
      
      const hasEvent = dayEvents.length > 0;
      
      days_array.push(
        <button
          key={day.toString()}
          className={cn(
            "p-2 relative",
            !isSameMonth(day, monthStart) && "text-neutral-400",
            isSameDay(day, selectedDate) && "bg-primary-100 rounded-full font-medium text-primary-700"
          )}
          onClick={() => setSelectedDate(cloneDay)}
        >
          {formattedDate}
          {hasEvent && (
            <span 
              className={cn(
                "absolute bottom-0.5 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full",
                getEventColor(dayEvents[0].type)
              )}
            ></span>
          )}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1 text-center text-sm" key={day.toString()}>
        {days_array}
      </div>
    );
    days_array = [];
  }
  
  // Get events for the selected date
  const selectedEvents = events.filter(event => 
    isSameDay(parseISO(event.startDate), selectedDate)
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-800">Calendário</h3>
        <div className="flex space-x-2 text-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <span className="material-icons">chevron_left</span>
          </Button>
          <span className="font-medium">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <span className="material-icons">chevron_right</span>
          </Button>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500">
          {days.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-2">{rows}</div>
      </div>

      {/* Upcoming Events */}
      <div className="px-6 py-5">
        <h4 className="text-sm font-medium text-neutral-800 mb-4">
          {selectedEvents.length > 0 
            ? `Eventos em ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}` 
            : "Próximos Eventos"}
        </h4>

        {selectedEvents.length > 0 ? (
          <ul className="space-y-4">
            {selectedEvents.map(event => (
              <EventItem 
                key={event.id}
                title={event.title}
                date={event.startDate}
                type={event.type}
              />
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {events
              .filter(event => parseISO(event.startDate) >= new Date())
              .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())
              .slice(0, 3)
              .map(event => (
                <EventItem 
                  key={event.id}
                  title={event.title}
                  date={event.startDate}
                  type={event.type}
                />
              ))}
          </ul>
        )}

        <div className="mt-5">
          <Button 
            variant="outline" 
            className="w-full justify-center"
          >
            <span className="material-icons text-sm mr-1">add</span>
            Agendar Evento
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get event dot color based on type
function getEventColor(type: string): string {
  switch (type) {
    case "task":
      return "bg-primary-500";
    case "obligation":
      return "bg-amber-500";
    case "meeting":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}
