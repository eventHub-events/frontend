// src/components/admin/dashboard/RangeSelector.tsx
const ranges = ["daily", "monthly", "yearly"] as const;

export default function RangeSelector({
  value,
  onChange
}: {
  value: typeof ranges[number];
  onChange: (v: typeof ranges[number]) => void;
}) {
  return (
    <div className="flex gap-2">
      {ranges.map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-4 py-2 rounded border capitalize
            ${value === r ? "bg-blue-600 text-white" : ""}`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
