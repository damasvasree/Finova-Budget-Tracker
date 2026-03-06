import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import "../App.css";

const data = [
  { month: "Jan", spend: 3254 },
  { month: "Feb", spend: 3303 },
  { month: "Mar", spend: 3104 },
  { month: "Apr", spend: 2879 },
  { month: "May", spend: 2876 },
  { month: "Jun", spend: 3195 },
  { month: "Jul", spend: 3516 },
  { month: "Aug", spend: 3630 },
  { month: "Sep", spend: 3460 },
  { month: "Oct", spend: 3115 },
  { month: "Nov", spend: 3057 },
  { month: "Dec", spend: 3296 }
];

export default function Analytics() {
  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Expense Analytics</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Spend (YTD)</h3>
          <h2>₹38,685</h2>
          <p>Across all categories</p>
        </div>

        <div className="analytics-card">
          <h3>Average Monthly Spend</h3>
          <h2>₹3,224</h2>
          <p>Based on 12 months</p>
        </div>

        <div className="analytics-card">
          <h3>Peak Month</h3>
          <h2>August</h2>
          <p>₹3,630 total</p>
        </div>
      </div>

      <div className="chart-box">
        <h3>Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}