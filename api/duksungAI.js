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

  const { name, birth }=req.body;
  if (!name || !birth) {
    return res.status(400).json({ error: "이름(name)과 생년월일(birth)이 필요합니다"});
  }

  try {
    const today = new Date().toISOString().slice(0, 10);

    const prompt =`
      이름: ${name}
      생년월일: ${birth}
      오늘 날짜: ${today}

      이 사람의 오늘의 운세와 행운의 아이템을 사주풀이 형식으로 알려줘.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은  사주풀이 전문가 고양이입니다. 처음 시작할 때 고양이 이모티콘을 써주세요. 사람들의 오늘 운세를 100글자 이내로 전해주세요. 운세 다음 줄에에 오늘 가지고 있으면 좋은 <오늘의 행운 아이템>을 추천해주세요. 멘트는 오늘 이걸 가지고 있으면 행운이 올 거야! 이런 식으로 해주세요. 아이템은 색과 일상적 물건(파란색 펜, 노란색 가방 등)을 조합하여 사람마다 다양하게 추천해주세요.",
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


