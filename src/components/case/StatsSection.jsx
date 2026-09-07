export function StatsSection({ eyebrow, stats, className = "" }) {
  return (
    <div className={["case-stats", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="stats-eyebrow">{eyebrow}</p> : null}
      <div style={{ gridTemplateColumns: `repeat(${Math.max(stats.length, 1)}, minmax(0, 1fr))` }}>
        {stats.map(([value, label]) => (
          <article key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
