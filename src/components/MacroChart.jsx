import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Protein", value: 30 },
  { name: "Carbs", value: 50 },
  { name: "Fat", value: 20 },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

export default function MacroChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 h-[400px]">
      <h3 className="text-xl font-semibold mb-4">
        Macronutrient Distribution
      </h3>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={120}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}