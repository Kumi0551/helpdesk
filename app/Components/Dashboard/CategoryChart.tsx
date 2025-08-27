import { Tooltip } from "@relume_io/relume-ui";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryData {
  hardware: number;
  software: number;
  network: number;
  other: number;
}

interface CategoryChartProps {
  data: CategoryData;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const chartData = [
    { name: "Hardware", value: data.hardware },
    { name: "Software", value: data.software },
    { name: "Network", value: data.network },
    { name: "Other", value: data.other },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Tickets" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
