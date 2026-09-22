export function StatsSection({ eyebrow, stats, className = "" }) {
  return (
    <div className={["case-stats", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="stats-eyebrow">{eyebrow}</p> : null}
      <div style={{ "--stats-cols": Math.max(stats.length, 1) }}>
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
