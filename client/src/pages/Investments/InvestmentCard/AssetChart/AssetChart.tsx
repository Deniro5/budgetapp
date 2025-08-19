import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "theme";
import { AssetWithPrice } from "types/investment";
import { formatCurrencyShort } from "utils";

type AssetChartProps = {
  asset: AssetWithPrice;
};

export const AssetChart = ({ asset }: AssetChartProps) => {
  const data = asset.history.reverse();
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={(value) => formatCurrencyShort(value)}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="price"
          stroke={COLORS.darkGreen}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
