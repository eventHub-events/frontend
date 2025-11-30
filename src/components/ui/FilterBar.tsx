"use client";

import { useEffect, useState } from "react";

interface FilterOption {
  label: string;
  name: string;
  type: "text" | "select" | "date";
  options?: string[];
}

interface FilterBarProps {
  filters?: FilterOption[];
  values?: Record<string, string>;
  onApply: (query: Record<string, string>) => void;
}

export function FilterBar({ filters, onApply,values }: FilterBarProps) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [debouncedFilterValues, setDebouncedFilterValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));

    const filterType = filters?.find((f) => f.name === name)?.type;
    if (filterType === "text") {
     setFilterValues((prev) => ({ ...prev, [name]: value }));
    setDebouncedFilterValues((prev) => ({ ...prev, [name]: value }));
    } else if (filterType === "date") {
       const updated = { ...filterValues, [name]: value };
        setFilterValues(updated);
        onApply(updated);
    }
  };
  useEffect(() => {
  if (values) {
    setFilterValues(values);
  }
}, [values]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(debouncedFilterValues).length > 0) {
       const merged = { ...filterValues, ...debouncedFilterValues };
      onApply(merged);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedFilterValues]);

  const applyFilters = () => {
    onApply(filterValues);
  };

  if (!filters || filters.length === 0) return null;

  return (
  <div className="relative">
    {/* Subtle ambient glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10 rounded-2xl blur-2xl" />

    <div className="relative bg-white/80 backdrop-blur-xl 
                    border border-slate-200/60 
                    rounded-2xl p-5 
                    shadow-xl">
      <div className="flex flex-wrap items-end gap-6">

        {/* LEFT: text + date filters */}
        <div className="flex flex-wrap gap-6">
          {filters?.map((filter) =>
            filter.type === "text" || filter.type === "date" ? (
              <div key={filter.name} className="flex flex-col">
                <label className="text-lg font-semibold text-black-600 mb-2">
                  {filter.label}
                </label>

                <input
                  type={filter.type}
                  value={filterValues[filter.name] || ""}
                  onChange={(e) => handleChange(filter.name, e.target.value)}
                  placeholder={filter.type === "text" ? "Type to search…" : undefined}
                  className="h-11 w-52 px-4 rounded-xl 
                             bg-white border border-slate-300/60 
                             text-slate-700 text-sm font-medium
                             focus:border-indigo-400 
                             focus:ring-4 focus:ring-indigo-100
                             hover:border-slate-400
                             transition"
                />
              </div>
            ) : null
          )}
        </div>

        {/* RIGHT: selects + button */}
        <div className="ml-auto flex items-end gap-6 flex-wrap">
          {filters?.map((filter) =>
            filter.type === "select" ? (
              <div key={filter.name} className="flex flex-col">
                <label className="text-lg font-semibold text-black-600 mb-2">
                  {filter.label}
                </label>

                <div className="relative">
                  <select
                    value={filterValues[filter.name] || ""}
                    onChange={(e) => handleChange(filter.name, e.target.value)}
                    className="w-48 h-11 px-4 pr-10 rounded-xl 
                               appearance-none bg-white 
                               border border-slate-300/60 
                               text-slate-700 text-sm font-medium
                               focus:border-indigo-400 
                               focus:ring-4 focus:ring-indigo-100
                               hover:border-slate-400
                               transition cursor-pointer"
                  >
                    <option value="">All</option>
                    {filter.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* Chevron */}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : null
          )}

          {/* APPLY BUTTON */}
          <button
            onClick={applyFilters}
            className="h-11 px-7 rounded-xl 
                       bg-gradient-to-r from-indigo-600 to-violet-600
                       text-white text-sm font-semibold
                       shadow-lg shadow-indigo-600/25
                       hover:shadow-xl hover:from-indigo-500 hover:to-violet-500
                       active:scale-95
                       transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
);

}
