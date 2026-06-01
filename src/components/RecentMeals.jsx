export default function RecentMeals({ meals }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">
      <h3 className="text-xl font-semibold mb-4">Recent Meals</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Meal</th>
              <th className="py-3">Calories</th>
              <th className="py-3">Protein</th>
              <th className="py-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id}>
                <td className="py-4">{meal.description}</td>

                <td>{meal.calories}</td>

                <td>{meal.protein}g</td>

                <td>
                  {new Date(
                    meal.createdAt?.seconds * 1000,
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
