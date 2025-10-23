import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AppContainer } from "./AppContainer";

interface ClasesChartProps {
  clasesPorDia: { dia: number; total: number }[];
}

export const ClasesChart: React.FC<ClasesChartProps> = ({ clasesPorDia }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={clasesPorDia} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dia" label={{ value: "Día del mes", position: "insideBottomRight", offset: -10 }} />
        <YAxis label={{ value: "Clases", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#007bff" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export function ClasesChartPage() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <AppContainer showOnlyChart />
    </div>
  );
}
