const PRESETS = [
  { label: "+10k", value: 10_000 },
  { label: "+50k", value: 50_000 },
  { label: "+100k", value: 100_000 },
  { label: "+500k", value: 500_000 },
  { label: "+1M", value: 1_000_000 },
];

export default function QuickSums({ onAdd, onClear }) {
  return (
    <div className="quick-sums">
      {PRESETS.map(({ label, value }) => (
        <button key={label} type="button" className="chip" onClick={() => onAdd(value)}>
          {label}
        </button>
      ))}
      <button type="button" className="chip chip-clear" onClick={onClear} title="Tozalash">
        ✕
      </button>
    </div>
  );
}
