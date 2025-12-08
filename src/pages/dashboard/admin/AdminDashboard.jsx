import StatsCard from "../../../components/dashboard/StatsCard";
import AnalyticsChart from "../../../components/dashboard/AnalyticsChart";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Users" value={100} icon="Users" />
        <StatsCard title="Total Lessons" value={500} icon="Book" />
        <StatsCard title="Reported Lessons" value={10} icon="Alert" />
        <StatsCard title="Premium Users" value={50} icon="Star" />
      </div>
      <AnalyticsChart />
    </div>
  );
};
export default AdminDashboard;
