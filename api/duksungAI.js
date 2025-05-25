
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const perfumeDB = {
  spring: [
    {
      name: "Jo Malone Peony & Blush Suede",
      top: "Red Apple",
      middle: "Peony, Jasmine, Rose",
      base: "Suede"
    },
    {
      name: "Chanel Chance Eau Tendre",
      top: "Grapefruit, Quince",
      middle: "Jasmine, Hyacinth",
      base: "Musk, Iris, Cedar"
    },
    {
      name: "Diptyque Eau Rose",
      top: "Lychee, Blackcurrant",
      middle: "Rose, Geranium",
      base: "White Musk, Cedar"
    },
    {
      name: "Marc Jacobs Daisy",
      top: "Strawberry, Violet Leaf",
      middle: "Gardenia, Jasmine",
      base: "Vanilla, Musk"
    }
  ],
  summer: [
    {
      name: "Dolce & Gabbana Light Blue",
      top: "Sicilian Lemon, Apple",
      middle: "Bamboo, Jasmine",
      base: "Cedarwood, Amber"
    },
    {
      name: "Chanel Chance Eau Fraiche",
      top: "Lemon, Cedar",
      middle: "Pink Pepper, Jasmine",
      base: "Patchouli, Musk"
    },
    {
      name: "Acqua di Parma Fico di Amalfi",
      top: "Grapefruit, Fig",
      middle: "Pink Pepper, Jasmine",
      base: "Cedarwood, Fig Tree"
    },
    {
      name: "Versace Bright Crystal",
      top: "Yuzu, Pomegranate",
      middle: "Peony, Magnolia",
      base: "Musk, Amber"
    }
  ],
  fall: [
    {
      name: "Byredo Bibliothèque",
      top: "Peach, Plum",
      middle: "Peony, Violet",
      base: "Patchouli, Leather"
    },
    {
      name: "Maison Margiela Jazz Club",
      top: "Pink Pepper, Lemon",
      middle: "Rum, Neroli",
      base: "Tobacco, Vanilla"
    },
    {
      name: "Tom Ford Oud Wood",
      top: "Rosewood, Cardamom",
      middle: "Oud, Sandalwood",
      base: "Vanilla, Amber"
    },
    {
      name: "Jo Malone Myrrh & Tonka",
      top: "Lavender",
      middle: "Myrrh",
      base: "Tonka Bean, Vanilla"
    }
  ],
  winter: [
    {
      name: "Yves Saint Laurent Black Opium",
      top: "Pear, Pink Pepper",
      middle: "Coffee, Jasmine",
      base: "Vanilla, Cedarwood"
    },
    {
      name: "Tom Ford Black Orchid",
      top: "Truffle, Blackcurrant",
      middle: "Orchid, Lotus",
      base: "Vanilla, Incense"
    },
    {
      name: "Maison Francis Kurkdjian Baccarat Rouge 540",
      top: "Saffron, Orange Blossom",
      middle: "Jasmine, Amberwood",
      base: "Fir Resin, Cedar"
    },
    {
      name: "Giorgio Armani Si",
      top: "Blackcurrant Nectar",
      middle: "Rose, Neroli",
      base: "Patchouli, Vanilla"
    }
  ]
};

function getSeason(month, hemisphere) {
  if (hemisphere === "north") {
    if ([3, 4, 5].includes(month)) return "spring";
    if ([6, 7, 8].includes(month)) return "summer";
    if ([9, 10, 11].includes(month)) return "fall";
    return "winter"; // 12,1,2
  } else {
    if ([3, 4, 5].includes(month)) return "fall";
    if ([6, 7, 8].includes(month)) return "winter";
    if ([9, 10, 11].includes(month)) return "spring";
    return "summer"; // 12,1,2
  }
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
    return res.status(400).json({ error: "태어난 달(month)과 반구(hemisphere)를 모두 입력해주세요." });
  }

  try {
    const season = getSeason(Number(month), hemisphere);
    const list = perfumeDB[season];
    const chosen = list[Math.floor(Math.random() * list.length)];

    const answer = `
🐱 야옹~ 오늘의 향기는 바로 이거야!

✨ "${chosen.name}" ✨

💐 톱노트: ${chosen.top}  
🌸 미들노트: ${chosen.middle}  
🌿 베이스노트: ${chosen.base}

오늘은 이 향기를 살며시 묻히고 하루를 걸어 봐.  
행운이 네 곁에 따르냥~ 🐾
    `;

    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "앗! 실수로 향수를 엎었어!" });
  }
}
