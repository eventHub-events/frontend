"use client";

import * as React from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns";

// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


export function DatePickerWithRange({
  value,
  onChange
}: {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}) {
  const [range, setRange] = React.useState<DateRange | undefined>(value);

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    onChange?.(newRange);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start w-full">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, "dd MMM yyyy")} –{" "}
                {format(range.to, "dd MMM yyyy")}
              </>
            ) : (
              format(range.from, "dd MMM yyyy")
            )
          ) : (
            <span>Select Date Range</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-auto z-[9999]" align="start">

        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
