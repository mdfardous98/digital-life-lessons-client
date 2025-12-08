import StatsCard from "../../../components/dashboard/StatsCard";
import AnalyticsChart from "../../../components/dashboard/AnalyticsChart";

const DashboardHome = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard title="My Lessons" value={10} icon="Book" />
        <StatsCard title="Favorites" value={5} icon="Heart" />
        <StatsCard title="Plan" value="Premium" icon="Star" />
      </div>
      <AnalyticsChart />
    </div>
  );
};

export default DashboardHome;
