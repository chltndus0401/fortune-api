import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 성별별 & 계절별 향수 DB (종류도 늘림)
const perfumeDB = {
  spring: {
    male: [
      {
        name: "Chanel Bleu de Chanel",
        top: "레몬, 자몽",
        middle: "자스민, 생강",
        base: "시더우드, 샌달우드",
      },
      {
        name: "Dior Sauvage",
        top: "베르가못, 페퍼",
        middle: "라벤더, 파출리",
        base: "앰버우드, 바닐라",
      },
      {
        name: "Acqua Di Parma Colonia",
        top: "시트러스, 라벤더",
        middle: "로즈마리, 로즈",
        base: "시더우드, 패출리",
      },
    ],
    female: [
      {
        name: "Chanel Chance Eau Tendre",
        top: "자몽, 퀸즈랜드 넛",
        middle: "재스민, 히아신스",
        base: "화이트 머스크, 시더우드",
      },
      {
        name: "Dior J’adore",
        top: "베르가못, 배",
        middle: "재스민, 장미",
        base: "바닐라, 샌달우드",
      },
      {
        name: "Gucci Bloom",
        top: "재스민, 튜베로즈",
        middle: "랭구스틴, 오렌지 꽃",
        base: "머스크",
      },
    ],
    neutral: [
      {
        name: "Calvin Klein CK One",
        top: "베르가못, 레몬",
        middle: "자스민, 로즈마리",
        base: "머스크, 앰버",
      },
      {
        name: "Tom Ford Neroli Portofino",
        top: "베르가못, 오렌지 꽃",
        middle: "네롤리, 라벤더",
        base: "앰버, 머스크",
      },
      {
        name: "Jo Malone Wood Sage & Sea Salt",
        top: "바다 소금, 세이지",
        middle: "그레이프프루트",
        base: "자작나무, 머스크",
      },
    ],
  },

  summer: {
    male: [
      {
        name: "Dolce & Gabbana Light Blue Pour Homme",
        top: "시트러스, 자몽",
        middle: "향나무, 로즈마리",
        base: "머스크, 앰버",
      },
      {
        name: "Versace Dylan Blue",
        top: "자몽, 베르가못",
        middle: "페퍼, 블랙 페퍼",
        base: "머스크, 톤카빈",
      },
      {
        name: "Issey Miyake L'Eau d'Issey",
        top: "유자, 레몬",
        middle: "아쿠아틱 노트, 백합",
        base: "시더우드, 머스크",
      },
    ],
    female: [
      {
        name: "Dolce & Gabbana Light Blue",
        top: "사과, 시더",
        middle: "재스민, 바이올렛",
        base: "앰버, 머스크",
      },
      {
        name: "Jo Malone Lime Basil & Mandarin",
        top: "라임, 만다린",
        middle: "바질, 페퍼",
        base: "베티버, 앰버우드",
      },
      {
        name: "Acqua di Gioia",
        top: "민트, 레몬",
        middle: "자스민, 피오니",
        base: "설탕, 시더우드",
      },
    ],
    neutral: [
      {
        name: "Maison Margiela Replica Beach Walk",
        top: "레몬, 코코넛",
        middle: "자스민, 몰약",
        base: "머스크, 시더우드",
      },
      {
        name: "Hermès Un Jardin Sur Le Nil",
        top: "망고, 자몽",
        middle: "로즈, 연꽃",
        base: "시더우드, 앰버",
      },
      {
        name: "CK One Summer",
        top: "레몬, 그린 애플",
        middle: "프리지아, 워터 멜론",
        base: "머스크, 앰버",
      },
    ],
  },

  autumn: {
    male: [
      {
        name: "Tom Ford Oud Wood",
        top: "우드, 스파이스",
        middle: "바닐라, 앰버",
        base: "시더우드, 머스크",
      },
      {
        name: "Yves Saint Laurent La Nuit de L'Homme",
        top: "베르가못, 카르다몸",
        middle: "시더우드, 제라늄",
        base: "베티버, 페퍼",
      },
      {
        name: "Hermès Terre d’Hermès",
        top: "오렌지, 자몽",
        middle: "페퍼, 패출리",
        base: "시더우드, 베티버",
      },
    ],
    female: [
      {
        name: "Tom Ford Black Orchid",
        top: "트러플, 블랙커런트",
        middle: "오키드, 스파이스",
        base: "파출리, 바닐라",
      },
      {
        name: "Yves Saint Laurent Black Opium",
        top: "커피, 배",
        middle: "자스민, 오렌지 블라썸",
        base: "바닐라, 패출리",
      },
      {
        name: "Maison Margiela Replica Jazz Club",
        top: "레몬, 자몽",
        middle: "자스민, 계피",
        base: "바닐라, 토바코 잎",
      },
    ],
    neutral: [
      {
        name: "Byredo Gypsy Water",
        top: "레몬, 페퍼",
        middle: "향나무, 라벤더",
        base: "바닐라, 앰버",
      },
      {
        name: "Le Labo Another 13",
        top: "앰버, 머스크",
        middle: "자스민, 머스크",
        base: "시더우드, 패출리",
      },
      {
        name: "Diptyque Eau Duelle",
        top: "바닐라, 카다몸",
        middle: "파출리, 캐러멜",
        base: "시더우드, 페퍼",
      },
    ],
  },

  winter: {
    male: [
      {
        name: "Dior Fahrenheit",
        top: "버가못, 라벤더",
        middle: "쟈스민, 일랑일랑",
        base: "가죽, 바닐라",
      },
      {
        name: "Guerlain L’Homme Ideal",
        top: "아몬드, 베르가못",
        middle: "로즈마리, 시더우드",
        base: "바닐라, 토바코",
      },
      {
        name: "Maison Margiela Replica By the Fireplace",
        top: "클로브, 오렌지",
        middle: "캐시미어 우드",
        base: "바닐라, 머스크",
      },
    ],
    female: [
      {
        name: "Guerlain Shalimar",
        top: "베르가못, 레몬",
        middle: "아이리스, 자스민",
        base: "바닐라, 인센스",
      },
      {
        name: "Maison Margiela Replica By the Fireplace",
        top: "클로브, 오렌지",
        middle: "캐시미어 우드",
        base: "바닐라, 머스크",
      },
      {
        name: "Calvin Klein Euphoria",
        top: "석류, 청사과",
        middle: "오키드, 크림",
        base: "샌달우드, 앰버",
      },
    ],
    neutral: [
      {
        name: "Tom Ford Tobacco Vanille",
        top: "담배잎, 스파이스",
        middle: "바닐라, 코코넛",
        base: "시더우드, 건초",
      },
      {
        name: "Jo Malone Myrrh & Tonka",
        top: "머스크, 바닐라",
        middle: "머스크, 토바코 잎",
        base: "앰버, 바닐라",
      },
      {
        name: "Le Labo Santal 33",
        top: "샌달우드, 시더우드",
        middle: "카다몸, 바이올렛",
        base: "머스크, 바닐라",
      },
    ],
  },
};

function getSeason(month, hemisphere) {
  const m = Number(month);
  if (hemisphere === "north") {
    if ([3, 4, 5].includes(m)) return "spring";
    if ([6, 7, 8].includes(m)) return "summer";
    if ([9, 10, 11].includes(m)) return "autumn";
    return "winter";
  } else if (hemisphere === "south") {
    if ([9, 10, 11].includes(m)) return "spring";
    if ([12, 1, 2].includes(m)) return "summer";
    if ([3, 4, 5].includes(m)) return "autumn";
    if ([6, 7, 8].includes(m)) return "winter";
  }
  return "winter";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { month, hemisphere, gender } = req.body;

  if (!month || !hemisphere || !gender) {
    return res.status(400).json({ error: "달(month), 반구(hemisphere), 성별(gender) 모두 필요합니다." });
  }

  const m = Number(month);
  if (isNaN(m) || m < 1 || m > 12) {
    return res.status(400).json({ error: "올바른 달(month)을 입력하세요 (1~12)." });
  }
  if (!["north", "south"].includes(hemisphere)) {
    return res.status(400).json({ error: "반구(hemisphere)는 'north' 또는 'south'이어야 합니다." });
  }
  if (!["male", "female", "neutral"].includes(gender)) {
    return res.status(400).json({ error: "성별(gender)는 'male', 'female', 'neutral' 중 하나여야 합니다." });
  }

  try {
    const season = getSeason(m, hemisphere);
    const perfumes = perfumeDB[season][gender];
    const chosen = perfumes[Math.floor(Math.random() * perfumes.length)];

    const prompt = `
당신은 조향사 고양이입니다. 아래 향수 정보를 참고해서 감성적이고 매력적인 추천 문구를 작성해주세요.

향수 이름: ${chosen.name}
톱노트: ${chosen.top}
미들노트: ${chosen.middle}
베이스노트: ${chosen.base}
추천 대상 성별: ${gender === "male" ? "남성" : gender === "female" ? "여성" : "중성"}

추천 멘트 (고양이 이모티콘 포함, 따뜻하고 귀여운 느낌):
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은 조향사 고양이입니다. 향수 추천을 따뜻하고 귀엽게 해주세요. 고양이 이모티콘을 사용하고, 추천 문장은 100자 이내로 작성해주세요.",
      },
    });

    const aiText = result.text.trim();

    const answer = `🐱 야옹~ 오늘의 향기는 바로 이거야!

✨ "${chosen.name}" ✨

💐 톱노트: ${chosen.top}  
🌸 미들노트: ${chosen.middle}  
🌿 베이스노트: ${chosen.base}

${aiText}

행운이 네 곁에 따르냥~ 🐾`;

    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API 오류 발생" });
  }
}
