export default function StatsCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

      <p className="text-gray-400 text-sm mt-1">
        {subtitle}
      </p>
    </div>
  );
}