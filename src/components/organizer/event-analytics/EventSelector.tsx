import { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

interface Props {
  events: { id: string; title: string }[];
  value?: string;
  onChange: (eventId: string) => void;
}

export function EventSelector({ events, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = events.find(e => e.id === value);

  return (
    <div className="relative w-full max-w-sm">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full flex items-center justify-between
          rounded-xl border border-gray-200 bg-white
          px-4 py-3 text-sm font-medium
          shadow-sm hover:border-gray-300
          focus:outline-none focus:ring-4 focus:ring-indigo-100
        "
      >
        <div className="flex items-center gap-3">
          <Calendar className="text-indigo-500" size={18} />
          <span className={selected ? "text-gray-900" : "text-gray-400"}>
            {selected?.title ?? "Select Event"}
          </span>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute z-20 mt-2 w-full
          rounded-xl border border-gray-200
          bg-white shadow-xl
          overflow-hidden
        ">
          {events.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                onChange(e.id);
                setOpen(false);
              }}
              className="
                w-full flex items-center justify-between
                px-4 py-3 text-sm
                hover:bg-indigo-50
                transition
              "
            >
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-indigo-400" />
                <span className="text-gray-800">
                  {e.title}
                </span>
              </div>

              {value === e.id && (
                <Check size={16} className="text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
