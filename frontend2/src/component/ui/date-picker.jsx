import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function DatePicker({ date, onDateChange, placeholder = "Pick a date", className, disabled = false }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState(date || new Date());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const handleYearChange = (year) => {
    const newDate = new Date(month);
    newDate.setFullYear(parseInt(year));
    setMonth(newDate);
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(month);
    newDate.setMonth(parseInt(monthIndex));
    setMonth(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Header selectors */}
          <div className="flex items-center space-x-2 p-3">
            <Select value={String(month.getFullYear())} onValueChange={handleYearChange}>
              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>{years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={String(month.getMonth())} onValueChange={handleMonthChange}>
              <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
              <SelectContent>{months.map((m, idx) => <SelectItem key={m} value={String(idx)}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {/* Calendar */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => { onDateChange(selectedDate); setIsOpen(false); }}
            month={month}
            onMonthChange={setMonth}
            disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
            initialFocus
          />
          {/* Quick actions */}
          <div className="flex justify-between p-3 border-t">
            <Button variant="secondary" size="sm" onClick={() => { onDateChange(new Date()); setIsOpen(false); }}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { onDateChange(undefined); setIsOpen(false); }}>
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
