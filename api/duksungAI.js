import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { month, hemisphere } = req.body;
  if (!month || !hemisphere) {
    return res.status(400).json({ error: "태어난 달(month)과 반구(hemisphere)가 필요합니다" });
  }

  try {
    const prompt = `
      이 사람은 태어난 달이 ${month}월이고, ${hemisphere === "north" ? "북반구" : "남반구"}에서 살고 있어요.
      계절과 분위기에 어울리는 향수를 하나 추천해주세요.
      향수는 구체적인 이름으로 추천하고, 그 이유를 짧고 감성적으로 설명해주세요.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은 감성적인 향수 추천을 해주는 고양이입니다 🐱. 말투는 부드럽고 따뜻하게, 감성적으로 해주세요. 향수는 구체적인 브랜드와 향 이름을 포함해주세요. 예: 'Jo Malone – Wood Sage & Sea Salt'. 추천 이유는 계절감과 기분을 고려해 2~3문장으로 작성해주세요.",
      },
    });

    res.status(200).json({ answer: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Gemini API 오류 발생",
    });
  }
}
