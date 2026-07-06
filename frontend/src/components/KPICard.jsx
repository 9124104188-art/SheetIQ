function KPICard({
  title,
  value,
  subtitle,
  icon,
  color = "#2563eb",
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div
          className="kpi-icon"
          style={{
            background: `${color}15`,
            color,
          }}
        >
          {icon}
        </div>

        <span className="kpi-status">
          Live
        </span>
      </div>

      <h2>{value}</h2>

      <h4>{title}</h4>

      <p>{subtitle}</p>
    </div>
  );
}

export default KPICard;