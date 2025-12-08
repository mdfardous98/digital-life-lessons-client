const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stat shadow">
      <div className="stat-figure text-primary">{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
};
export default StatsCard;
