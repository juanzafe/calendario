import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppContainer } from "./AppContainer";

interface ClasesChartProps {
  clasesPorDia: { dia: number; total: number; acumuladas?: number }[];
}

export const ClasesChart: React.FC<ClasesChartProps> = ({ clasesPorDia }) => {
  // 🔹 Calcular acumuladas directamente dentro del gráfico
  let acumuladas = 0;
  const data = clasesPorDia.map((d) => {
    acumuladas += d.total ?? 0;
    return {
      dia: d.dia,
      total: d.total ?? 0,
      acumuladas: d.acumuladas ?? acumuladas,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="dia"
          label={{
            value: "Día del mes",
            position: "insideBottomRight",
            offset: -10,
          }}
        />
        <YAxis
          label={{
            value: "Número de clases",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip
          formatter={(value, name) => {
            if (name === "total") return [value, "Clases por día"];
            if (name === "acumuladas") return [value, "Clases acumuladas"];
            return [value, name];
          }}
          labelFormatter={(label) => `Día ${label}`}
        />

        <Legend verticalAlign="top" height={36} />

        {/* 🔵 Clases por día */}
        <Line
          type="monotone"
          dataKey="total"
          stroke="#007bff"
          strokeWidth={2}
          name="Clases por día"
          dot={{ r: 3 }}
        />

        {/* 🟢 Clases acumuladas */}
        <Line
          type="monotone"
          dataKey="acumuladas"
          stroke="#28a745"
          strokeWidth={2}
          name="Clases acumuladas"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
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
