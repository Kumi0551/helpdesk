"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface PriorityData {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface PriorityChartProps {
  data: PriorityData;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PriorityChart: React.FC<PriorityChartProps> = ({ data }) => {
  const chartData = [
    { name: "Low", value: data.low },
    { name: "Medium", value: data.medium },
    { name: "High", value: data.high },
    { name: "Critical", value: data.critical },
  ];
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityChart;
