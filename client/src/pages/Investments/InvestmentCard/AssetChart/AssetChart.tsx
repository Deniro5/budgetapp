import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample mock stock data
const data = [
  { date: "2025-06-01", price: 150 },
  { date: "2025-06-02", price: 153 },
  { date: "2025-06-03", price: 149 },
  { date: "2025-06-04", price: 157 },
  { date: "2025-06-05", price: 155 },
  { date: "2025-06-06", price: 160 },
  { date: "2025-06-07", price: 165 },
];

export const AssetChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
