import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const perfumeDB = {
  spring: [
    {
      name: "Chanel Chance Eau Tendre",
      top: "자몽, 푸른사과",
      middle: "자스민, 아이리스",
      base: "시더우드, 머스크",
    },
    {
      name: "Jo Malone Peony & Blush Suede",
      top: "사과, 베르가못",
      middle: "피오니, 장미",
      base: "시더, 화이트 머스크",
    },
    // ...추가
  ],
  summer: [
    {
      name: "Dolce & Gabbana Light Blue",
      top: "시트러스, 애플",
      middle: "재스민, 벨가못",
      base: "시더우드, 머스크",
    },
  ],
  autumn: [
    {
      name: "Tom Ford Black Orchid",
      top: "블랙 트러플, 베르가못",
      middle: "오키드, 스파이스",
      base: "파출리, 바닐라",
    },
  ],
  winter: [
    {
      name: "Yves Saint Laurent Black Opium",
      top: "커피, 배",
      middle: "자스민, 오렌지 꽃",
      base: "바닐라, 패출리",
    },
  ],
};

function getSeason(month) {
  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10, 11].includes(month)) return "autumn";
  return "spring"; // 기본값
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { birth, hemisphere } = req.body;
  if (!birth || !hemisphere) {
    return res.status(400).json({ error: "생년월일(birth)과 반구(hemisphere)가 필요합니다." });
  }

  try {
    // 달 추출
    const month = new Date(birth).getMonth() + 1; 
    const season = getSeason(month);

    // hemisphere 체크 
    let realSeason = season;
    if (hemisphere.toLowerCase() === "south") {
      const oppositeSeasons = { spring: "autumn", summer: "winter", autumn: "spring", winter: "summer" };
      realSeason = oppositeSeasons[season] || season;
    }

    // 계절에 맞는 향수 리스트에서 랜덤 선택
    const perfumes = perfumeDB[realSeason];
    const chosen = perfumes[Math.floor(Math.random() * perfumes.length)];

    // AI 프롬프트 구성
    const prompt = `
🐱 안녕! 나는 고양이 조향사야.
아래 정보를 참고해서, 귀엽고 따뜻한 느낌으로 오늘 사용자에게 맞는 향수를 추천해줘.

이름: (사용자 이름 없음)
생년월일: ${birth}
반구: ${hemisphere}
계절: ${realSeason}

추천 향수: "${chosen.name}"
톱노트: ${chosen.top}
미들노트: ${chosen.middle}
베이스노트: ${chosen.base}

이 향수를 추천하는 귀엽고 감성적인 멘트를 100자 이내로 작성해줘.
멘트 마지막엔 '행운이 네 곁에 따르냥~ 🐾' 같은 고양이 이모티콘과 함께 마무리해줘.
`;

    // ai 호출 부분
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: "당신은 귀여운 고양이 조향사입니다. 감성적이고 따뜻하게 향수를 추천해주세요.",
          },
        ],
      },
    });

    const answer = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "추천을 생성하지 못했어요.";

    res.status(200).json({
      answer: `
🐱 야옹~ 오늘의 향기는 바로 이거야!

✨ "${chosen.name}" ✨

💐 톱노트: ${chosen.top}  
🌸 미들노트: ${chosen.middle}  
🌿 베이스노트: ${chosen.base}

${answer}
      `,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API 오류 발생" });
  }
}
