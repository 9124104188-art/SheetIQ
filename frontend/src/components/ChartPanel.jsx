import { useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { BarChart3 } from "lucide-react";
import "../styles/chartPanel.css";

const COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#f97316", "#ec4899"];

function ChartPanel({ chartData, labelKey, valueKey }) {
  const [chartType, setChartType] = useState("bar");

  const hasData = chartData && chartData.length > 0 && labelKey && valueKey;

  return (
    <section className="chart-panel card">
      <div className="card-header">
        <div className="chart-title-wrap">
          <div className="chart-icon">
            <BarChart3 size={22} />
          </div>

          <div>
            <p className="eyebrow">Visualization</p>
            <h2>Business Analytics</h2>
          </div>
        </div>

        <div className="chart-actions">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>

          <span className="badge">Live</span>
        </div>
      </div>

      {!hasData ? (
        <div className="chart-empty">
          <BarChart3 size={42} />
          <h3>No chart data</h3>
          <p>Upload a dataset with numeric columns to generate charts.</p>
        </div>
      ) : (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={280}>
            {chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey={labelKey}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey={valueKey}
                  radius={[10, 10, 0, 0]}
                  fill="#2563eb"
                />
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey={labelKey}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey={valueKey}
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <PieChart>
                <Tooltip />
                <Legend />

                <Pie
                  data={chartData}
                  dataKey={valueKey}
                  nameKey={labelKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ChartPanel;