// /api/duksungAI.js
import dotenv from "dotenv";
dotenv.config();

const perfumeDB = {
  spring: [
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
  summer: [
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
  autumn: [
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
  winter: [
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
};

function getSeason(month, hemisphere) {
  // 북반구 기준 계절 (3-5 봄, 6-8 여름, 9-11 가을, 12-2 겨울)
  // 남반구는 반대로 (9-11 봄, 12-2 여름, 3-5 가을, 6-8 겨울)
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
  // 기본 겨울
  return "winter";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { month, hemisphere } = req.body;
  if (!month || !hemisphere) {
    return res.status(400).json({ error: "달(month)과 반구(hemisphere)가 필요합니다." });
  }

  const m = Number(month);
  if (isNaN(m) || m < 1 || m > 12) {
    return res.status(400).json({ error: "올바른 달(month)을 입력하세요 (1~12)." });
  }
  if (!["north", "south"].includes(hemisphere)) {
    return res.status(400).json({ error: "반구(hemisphere)는 'north' 또는 'south'이어야 합니다." });
  }

  try {
    const season = getSeason(m, hemisphere);
    const perfumes = perfumeDB[season];
    const chosen = perfumes[Math.floor(Math.random() * perfumes.length)];

    const answer = `
🐱 야옹~ 오늘의 향기는 바로 이거야!

✨ "${chosen.name}" ✨

💐 톱노트: ${chosen.top}  
🌸 미들노트: ${chosen.middle}  
🌿 베이스노트: ${chosen.base}

오늘은 이 향기를 살며시 묻히고 하루를 걸어봐.  
행운이 네 곁에 따르냥~ 🐾
`;

    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류가 발생했어요." });
  }
}
