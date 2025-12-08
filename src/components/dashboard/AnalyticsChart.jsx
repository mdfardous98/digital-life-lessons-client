import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const AnalyticsChart = ({ data }) => {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Lessons Created",
        data: data || [5, 9, 3, 5, 2, 3, 7],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};
export default AnalyticsChart;
