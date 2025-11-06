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
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-2xl blur-xl"></div>

      <div className="relative backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          {filters?.map((filter) =>
            filter.type === "text" || filter.type === "date" ? (
              <div key={filter.name} className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2 group-hover:text-slate-900 transition-colors duration-200">
                  {filter.label}
                </label>
                <input
                  type={filter.type}
                  value={filterValues[filter.name] || ""}
                  onChange={(e) => handleChange(filter.name, e.target.value)}
                  placeholder={filter.type === "text" ? "Enter value..." : undefined}
                  className={`w-52 h-12 px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl text-slate-700 font-medium placeholder-slate-400 shadow-lg shadow-slate-200/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300 ease-out ${
                    filter.type === "date" ? "cursor-pointer" : ""
                  }`}
                />
              </div>
            ) : null
          )}

          {/* Right aligned selects + button */}
          <div className="flex gap-6 items-end ml-auto">
            {filters?.map((filter) =>
              filter.type === "select" ? (
                <div key={filter.name} className="group">
                  <label className="block text-sm font-medium text-slate-700 mb-2 group-hover:text-slate-900 transition-colors duration-200">
                    {filter.label}
                  </label>
                  <div className="relative">
                    <select
                      value={filterValues[filter.name] || ""}
                      onChange={(e) => handleChange(filter.name, e.target.value)}
                      className="appearance-none w-48 h-12 px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl text-slate-700 font-medium shadow-lg shadow-slate-200/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300 ease-out cursor-pointer"
                    >
                      <option value="">All</option>
                      {filter.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : null
            )}

            <button
              onClick={applyFilters}
              className="relative group h-12 px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-300 ease-out overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                Apply Filters
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
