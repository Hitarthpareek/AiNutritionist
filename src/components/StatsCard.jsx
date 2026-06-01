export default function StatsCard({
  title,
  value,
  subtitle,
  background
}) {
  
  return (
    
    <div style={{ '--dynamic-bg': `url(${background})` }}  className="h-40 w-full bg-[image:var(--dynamic-bg)] bg-cover bg-center rounded-xl shadow-sm p-5">
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