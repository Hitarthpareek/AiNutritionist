import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export async function analyzeMeal(mealDescription) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Analyze this meal:

"${mealDescription}"

Return ONLY valid JSON and in recommendation write short lines upto 15 words and emojis according to the positive or negative recommandation

{
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "healthScore": 0,
  "recommendations": []
}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  return JSON.parse(
    text.replace(/```json|```/g, "").trim()
  );
}