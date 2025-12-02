"use client";

import { useEffect, useRef, useState } from "react";

interface FilterOption {
  label: string;
  name: string;
  type: "text" | "select" | "date";
  options?: string[];
}

interface FilterBarProps {
  filters?: FilterOption[];
  onApply: (query: Record<string, string>) => void;
}

export function FilterBar({ filters = [], onApply }: FilterBarProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const lastAppliedRef = useRef<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    const type = filters.find((f) => f.name === name)?.type;

    // ✅ Apply immediately for select & date
    if (type === "select" || type === "date") {
      applyIfChanged({ ...values, [name]: value });
    }
  };

  // ✅ Debounce only text inputs
  useEffect(() => {
    const timeout = setTimeout(() => {
      applyIfChanged(values);
    }, 500);

    return () => clearTimeout(timeout);
  }, [values]);

  const applyIfChanged = (next: Record<string, string>) => {
    const changed =
      Object.keys(next).some(
        (key) => next[key] !== lastAppliedRef.current[key]
      );

    if (!changed) return;

    lastAppliedRef.current = next;
    onApply(next);
  };

  if (!filters.length) return null;

  return (
    <div className="relative">
      <div className="relative bg-white rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap gap-6">
          {filters.map((filter) => (
            <div key={filter.name} className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                {filter.label}
              </label>

              {filter.type === "text" && (
                <input
                  value={values[filter.name] || ""}
                  onChange={(e) =>
                    handleChange(filter.name, e.target.value)
                  }
                  className="h-10 w-52 px-3 rounded-lg border"
                />
              )}

              {filter.type === "date" && (
                <input
                  type="date"
                  value={values[filter.name] || ""}
                  onChange={(e) =>
                    handleChange(filter.name, e.target.value)
                  }
                  className="h-10 px-3 rounded-lg border"
                />
              )}

              {filter.type === "select" && (
                <select
                  value={values[filter.name] || ""}
                  onChange={(e) =>
                    handleChange(filter.name, e.target.value)
                  }
                  className="h-10 px-3 rounded-lg border"
                >
                  <option value="">All</option>
                  {filter.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
