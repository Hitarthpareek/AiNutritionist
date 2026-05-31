import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function WeeklyCaloriesChart({ data = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 h-[400px]">
      <h3 className="text-xl font-semibold mb-4">
        Weekly Calories
      </h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No meal data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="calories"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}